from django.shortcuts import render
from dal_select2.views import Select2QuerySetView
from django.utils.text import slugify
from django.db.models import Q
from .models import User, Service, ClientList


class GenericAutocomplete(Select2QuerySetView):
    """Base autocomplete view - search only functionality for any model."""
    search_fields = []  # Override this in subclasses

    def get_queryset(self):
        """Return filtered queryset for authenticated users only."""
        if not self.request.user.is_authenticated:
            return self.model.objects.none()

        qs = self.model.objects.all()
        if self.q and self.search_fields:
            # Build Q objects for multiple field search
            query = Q()
            for field in self.search_fields:
                query |= Q(**{f"{field}__icontains": self.q})
            qs = qs.filter(query)
        return qs


class CreatableAutocomplete(GenericAutocomplete):
    """Autocomplete view with creation functionality - inherits search from GenericAutocomplete."""
    create_field = None  # Override this in subclasses

    def get_create_option(self, context, q):
        """Add create option for new entries."""
        if not q:
            return []

        return [{
            'id': q,
            'text': f'Create "{q}"',
            'create_id': True,
        }]

    def create_object(self, text):
        """Override this method in subclasses to customize object creation."""
        if self.create_field:
            return self.model.objects.create(**{self.create_field: text})
        raise NotImplementedError("Subclasses must implement create_object method")


# Specific implementations
class ServiceAutocomplete(CreatableAutocomplete):
    """Service autocomplete with create functionality."""
    model = Service
    search_fields = ['service_name']
    create_field = 'service_name'

    def create_object(self, text):
        """Create a new Service with auto-generated fields."""
        return Service.objects.create(
            service_name=text,
            slug=slugify(text),
            description=f"Service: {text}",
            excerpt=f"New service: {text}"
        )


class UserAutocomplete(GenericAutocomplete):
    """User autocomplete - search only, no creation."""
    model = User
    search_fields = ['username', 'first_name', 'last_name', 'email']


class ClientAutocomplete(GenericAutocomplete):
    """Client autocomplete - search only, no creation."""
    model = ClientList
    search_fields = ['first_name', 'last_name', 'email']

# To use access token to view booking details:
"""
def booking_details_by_token(request, token):
    booking = get_object_or_404(Booking, access_token = token)
    context = {
        'booking': booking
    }
    return render(request, "bookings/booking_details.html")
"""


def index(request):
    """Renders the index.html page for the homepage"""
    return render(request, 'core/index.html')
