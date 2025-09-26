from django.shortcuts import render, get_object_or_404
from dal_select2.views import Select2QuerySetView
from django.utils.text import slugify
from .models import Service, Booking


class ServiceAutocomplete(Select2QuerySetView):
    """Autocomplete view for Service model with create functionality."""
    model = Service
    create_field = "service_name"

    def get_queryset(self):
        """Return filtered services for authenticated users only."""
        if not self.request.user.is_authenticated:
            return Service.objects.none()

        qs = Service.objects.all()
        if self.q:
            qs = qs.filter(service_name__icontains=self.q)
        return qs

    def get_create_option(self, context, q):
        """Add create option for new services."""
        if not q:
            return []

        return [{
            'id': q,
            'text': f'Create "{q}"',
            'create_id': True,
        }]

    def create_object(self, text):
        """Create a new Service with auto-generated fields."""
        return Service.objects.create(
            service_name=text,
            slug=slugify(text),
            description=f"Service: {text}",
            excerpt=f"New service: {text}"
        )

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
