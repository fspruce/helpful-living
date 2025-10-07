from django.shortcuts import render, get_object_or_404
from dal_select2.views import Select2QuerySetView
from django.utils.text import slugify
from django.db.models import Q
from django.views import generic
from .models import User, Service, ClientList


# ============================================================================
# AUTOCOMPLETE VIEWS - Used in admin interface for dynamic form fields
# ============================================================================

class GenericAutocomplete(Select2QuerySetView):
    """
    Base autocomplete view providing search functionality for any model.

    This class serves as a foundation for all autocomplete views in the admin.
    It provides secure, authenticated search functionality that can be extended
    by subclasses for specific models.

    Attributes:
        search_fields (list): List of model fields to search against.
                             Must be overridden in subclasses.

    Security:
        - Only authenticated users can access autocomplete functionality
        - Returns empty queryset for unauthenticated requests
    """

    search_fields = []  # Override this in subclasses

    def get_queryset(self):
        """
        Return filtered queryset for authenticated users only.

        Performs case-insensitive search across all defined search_fields
        using the search term (self.q) provided by the Select2 widget.

        Returns:
            QuerySet: Filtered results matching search criteria, or empty
                     queryset if user is not authenticated.
        """
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
    """
    Extended autocomplete view with object creation functionality.

    Inherits search functionality from GenericAutocomplete and adds the ability
    to create new objects directly from the autocomplete interface. This is
    useful for admin forms where users need to quickly add new entries.

    Attributes:
        create_field (str): Field name to use when creating new objects.
                           Must be overridden in subclasses if using default
                           create_object method.
    """

    create_field = None  # Override this in subclasses

    def get_create_option(self, context, q):
        """
        Add create option for new entries in the autocomplete dropdown.

        Args:
            context: Template context (unused in this implementation)
            q (str): Search query string

        Returns:
            list: List containing create option dict, or empty list if no query
        """
        if not q:
            return []

        return [
            {
                "id": q,
                "text": f'Create "{q}"',
                "create_id": True,
            }
        ]

    def create_object(self, text):
        """
        Create new model instance from autocomplete input.

        Default implementation creates object using the create_field attribute.
        Override this method in subclasses for custom object creation logic.

        Args:
            text (str): The text entered by user to create new object

        Returns:
            Model instance: Newly created object

        Raises:
            NotImplementedError: If create_field is not set and method not
                               overridden
        """
        if self.create_field:
            return self.model.objects.create(**{self.create_field: text})
        raise NotImplementedError(
            "Subclasses must implement create_object method"
        )


# ============================================================================
# SPECIFIC AUTOCOMPLETE IMPLEMENTATIONS
# ============================================================================

class ServiceAutocomplete(CreatableAutocomplete):
    """
    Service autocomplete with create functionality for admin interface.

    Allows administrators to search existing services or create new ones
    directly from form fields. When creating new services, automatically
    generates slug, description, and excerpt fields.

    Used in: Admin forms that reference Service model
    """

    model = Service
    search_fields = ["service_name"]
    create_field = "service_name"

    def create_object(self, text):
        """
        Create a new Service with auto-generated fields.

        Args:
            text (str): Service name entered by user

        Returns:
            Service: Newly created service instance with generated fields
        """
        return Service.objects.create(
            service_name=text,
            slug=slugify(text),
            description=f"Service: {text}",
            excerpt=f"New service: {text}",
        )


class UserAutocomplete(GenericAutocomplete):
    """
    User autocomplete for admin interface - search only, no creation.

    Provides search functionality across user fields for forms that need
    to reference User objects. Creation disabled as users should be created
    through proper user management flows.

    Used in: Admin forms that reference User model
    """

    model = User
    search_fields = ["username", "first_name", "last_name", "email"]


class ClientAutocomplete(GenericAutocomplete):
    """
    Client autocomplete for admin interface - search only, no creation.

    Allows searching existing clients by name and email for admin forms.
    Creation disabled to maintain data integrity and proper client onboarding.

    Used in: Admin forms that reference ClientList model
    """

    model = ClientList
    search_fields = ["first_name", "last_name", "email"]


# ============================================================================
# PUBLIC FACING VIEWS - Main application functionality
# ============================================================================

def index(request):
    """
    Render the homepage/landing page.

    Simple view that displays the main index template. This is typically
    the first page visitors see when they access the website.

    Args:
        request: HTTP request object

    Returns:
        HttpResponse: Rendered index.html template

    Template: core/index.html
    """
    return render(request, "core/index.html")


class ServiceList(generic.ListView):
    """
    Display paginated list of available services.

    Generic ListView that shows all available services (available=1) with
    pagination support. Used for the main services catalog page where
    visitors can browse all offered services.

    Attributes:
        queryset: Filtered to show only available services
        template_name: Template to render the service list
        paginate_by: Number of services per page for pagination

    Template: core/services.html
    Context: 'object_list' or 'service_list' containing Service objects
    """
    queryset = Service.objects.filter(available=1)
    template_name = "core/services.html"
    paginate_by = 6


def service_detail(request, slug):
    """
    Display detailed view of a specific service.

    Shows complete information about a single service including description,
    images, and booking options. Only displays services marked as available.

    Args:
        request: HTTP request object
        slug (str): URL-friendly identifier for the service

    Returns:
        HttpResponse: Rendered service detail template

    Raises:
        Http404: If service with given slug doesn't exist or isn't available

    **Context**
    ``service``
      An instance of :model:`core.Service`

    **Template**
    :template:`core/service_detail.html`
    """
    queryset = Service.objects.filter(available=1)
    service = get_object_or_404(queryset, slug=slug)

    return render(
        request,
        "core/service_detail.html",
        {
            "service": service,
        },
    )


def booking_page(request, slug):
    """
    Display booking form with a specific service pre-selected.

    Renders the booking form with the specified service already selected
    in the service dropdown. Used when users click "Book Now" from a
    specific service page or service list.

    Args:
        request: HTTP request object
        slug (str): URL-friendly identifier for the pre-selected service

    Returns:
        HttpResponse: Rendered booking form with service pre-selected

    Raises:
        Http404: If service with given slug doesn't exist or isn't available

    Template: core/bookings.html
    Context:
        - service_list: All available services for the dropdown
        - selected_service: The pre-selected service object
        - slug: Service slug for URL tracking
    """
    queryset = Service.objects.filter(available=1)
    selected_service = get_object_or_404(queryset, slug=slug)
    all_services = queryset.all()

    return render(
        request,
        "core/bookings.html",
        {
            "service_list": all_services,
            "selected_service": selected_service,
            "slug": slug,
        },
    )


def booking_page_no_service(request):
    """
    Display booking form without any service pre-selected.

    Renders the booking form with all available services in the dropdown
    but no specific service selected. Used for general booking access
    or when users navigate directly to the booking page.

    Args:
        request: HTTP request object

    Returns:
        HttpResponse: Rendered booking form with no service pre-selected

    Template: core/bookings.html
    Context:
        - service_list: All available services for the dropdown
        - selected_service: None (no pre-selection)
    """
    queryset = Service.objects.filter(available=1)
    all_services = queryset.all()

    return render(
        request,
        "core/bookings.html",
        {
            "service_list": all_services,
            "selected_service": None,
        },
    )
