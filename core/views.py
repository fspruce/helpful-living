from django.shortcuts import render, get_object_or_404, redirect
from dal_select2.views import Select2QuerySetView
from django.utils.text import slugify
from django.db import transaction
from django.db.models import Q
from django.views import generic
from datetime import date, time
from .models import User, Service, ClientList, Booking


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

    First checks if user has existing booking and redirects to booking info.
    Otherwise renders the booking form with all available services in dropdown.
    Used for general booking access or when users navigate directly to booking page.

    Args:
        request: HTTP request object

    Returns:
        HttpResponse: Rendered booking form with no service pre-selected or
                     redirect to booking info if user has existing booking

    Template: core/bookings.html
    Context:
        - service_list: All available services for the dropdown
        - selected_service: None (no pre-selection)
    """
    # Check if authenticated user already has a booking
    if request.user.is_authenticated:
        try:
            client = ClientList.objects.get(user=request.user)
            booking = Booking.objects.get(client=client)
            # User has existing booking, redirect to booking info
            return redirect('booking_info')
        except (ClientList.DoesNotExist, Booking.DoesNotExist):
            # User has no booking, continue to show booking form
            pass
    
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


def book_service(request):
    if request.method == "POST":
        # Get form data - field names match JavaScript form
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")
        email = request.POST.get("email_address")
        phone = request.POST.get("phone_number")

        service = request.POST.get("services")
        booking_date_str = request.POST.get("booking_date")
        earliest_h = request.POST.get("earliest_availability_hour")
        earliest_m = request.POST.get("earliest_availability_min")
        latest_h = request.POST.get("latest_availability_hour")
        latest_m = request.POST.get("latest_availability_min")

        # Validate all required fields are present
        if not all([first_name, last_name, email, phone,
                   booking_date_str, earliest_h, earliest_m,
                   latest_h, latest_m]):
            error_msg = "All fields are required. Please fill out the form."
            return render(request, "core/booking_error.html", {
                "error_message": error_msg
            })

        try:
            # Parse and validate date
            booking_date_obj = date.fromisoformat(booking_date_str)

            # Convert time to string format for CharField storage (HHMM)
            earliest_time = f"{int(earliest_h):02d}{int(earliest_m):02d}"
            latest_time = f"{int(latest_h):02d}{int(latest_m):02d}"

        except (ValueError, TypeError) as e:
            return render(request, "core/booking_error.html", {
                "error_message": f"Invalid date or time format: {e}"
            })

        try:
            with transaction.atomic():
                # Prepare default values for client creation
                client_defaults = {
                    "first_name": first_name,
                    "last_name": last_name,
                    "phone_number": phone,
                    "is_client": False,
                }

                # If user is authenticated, link to user account
                if request.user.is_authenticated:
                    client_defaults["user"] = request.user

                # Create or get client
                client, created = ClientList.objects.get_or_create(
                    email=email,
                    defaults=client_defaults
                )

                # If client exists but user wasn't linked before, link now
                if (not created and request.user.is_authenticated and
                        not client.user):
                    client.user = request.user
                    client.save()

                # Create booking record
                booking = Booking.objects.create(
                    client=client,
                    booking_date=booking_date_obj,
                    booking_earliest=earliest_time,
                    booking_latest=latest_time,
                    is_confirmed=False
                )

                # Add service to booking if provided
                if service:
                    try:
                        service_obj = Service.objects.get(id=service)
                        booking.services.add(service_obj)
                    except Service.DoesNotExist:
                        pass  # Service not found, continue without adding

            return render(request, "core/booking_success.html", {
                "booking": booking,
                "client": client,
                "redirect_url": "booking_info"
            })

        except Exception as e:
            error_msg = f"An error occurred while processing your booking: {e}"
            return render(request, "core/booking_error.html", {
                "error_message": error_msg
            })

    # GET request - redirect to booking form
    return redirect('bookings')


def booking_info(request):
    """
    Display booking information for authenticated users or guests with access key.
    
    For authenticated users: Automatically finds their booking and displays it.
    For guests: Shows form to enter access key to view booking details.
    
    Args:
        request: HTTP request object
        
    Returns:
        HttpResponse: Rendered booking info template with booking data or
        access form
    """
    # Check for session messages from edit operation
    success_message = request.session.pop('booking_update_success', None)
    error_message = request.session.pop('booking_update_error', None)
    session_access_token = request.session.pop('access_token_for_view', None)
    
    if request.user.is_authenticated:
        # Try to find booking for authenticated user
        try:
            client = ClientList.objects.get(user=request.user)
            booking = Booking.objects.get(client=client)
            
            context = {
                "booking": booking,
                "client": client,
                "is_authenticated": True
            }
            
            # Add session messages if they exist
            if success_message:
                context["success_message"] = success_message
            if error_message:
                context["error_message"] = error_message
                
            return render(request, "core/booking_info.html", context)
        except (ClientList.DoesNotExist, Booking.DoesNotExist):
            # User has no booking, redirect to booking form
            return redirect('bookings')
    
    # Handle guest access - check for session token first
    if session_access_token:
        try:
            booking = Booking.objects.get(access_token=session_access_token)
            
            context = {
                "booking": booking,
                "client": booking.client,
                "is_authenticated": False,
                "access_key_used": True
            }
            
            # Add session messages if they exist
            if success_message:
                context["success_message"] = success_message
            if error_message:
                context["error_message"] = error_message
                
            return render(request, "core/booking_info.html", context)
        except Booking.DoesNotExist:
            pass  # Fall through to normal flow
    
    # Handle guest access key submission
    if request.method == "POST":
        access_key = request.POST.get("access_key", "").strip()
        
        if not access_key:
            return render(request, "core/booking_info.html", {
                "error_message": "Please enter your access key.",
                "is_authenticated": False
            })
        
        try:
            booking = Booking.objects.get(access_token=access_key)
            
            return render(request, "core/booking_info.html", {
                "booking": booking,
                "client": booking.client,
                "is_authenticated": False,
                "access_key_used": True
            })
        except Booking.DoesNotExist:
            error_msg = "Invalid access key. Please check and try again."
            return render(request, "core/booking_info.html", {
                "error_message": error_msg,
                "is_authenticated": False
            })
    
    # GET request for guest - show access key form
    context = {"is_authenticated": False}
    
    # Add any error messages from session
    if error_message:
        context["error_message"] = error_message
        
    return render(request, "core/booking_info.html", context)


def edit_booking(request):
    """
    Handle booking edit form submissions.
    
    Allows authenticated users or guests with valid access tokens to update
    their booking details including date and time preferences.
    
    Args:
        request: HTTP request object containing form data
        
    Returns:
        HttpResponse: JSON response with success/error status or redirect
    """
    if request.method != "POST":
        return redirect('booking_info')
    
    # Get booking based on user authentication or access token
    booking = None
    
    if request.user.is_authenticated:
        try:
            client = ClientList.objects.get(user=request.user)
            booking = Booking.objects.get(client=client)
        except (ClientList.DoesNotExist, Booking.DoesNotExist):
            return redirect('bookings')
    else:
        # For guests, we need to identify the booking somehow
        # This could be through a hidden field in the form or session
        # For now, let's handle it through a hidden field in the form
        access_token = request.POST.get('access_token')
        if access_token:
            try:
                booking = Booking.objects.get(access_token=access_token)
            except Booking.DoesNotExist:
                return redirect('booking_info')
        else:
            return redirect('booking_info')
    
    if not booking:
        return redirect('booking_info')
    
    # Get form data
    booking_date = request.POST.get('booking_date')
    earliest_hour = request.POST.get('earliest_availability_hour')
    earliest_min = request.POST.get('earliest_availability_min')
    latest_hour = request.POST.get('latest_availability_hour')
    latest_min = request.POST.get('latest_availability_min')
    
    # Validate required fields
    required_fields = [
        booking_date, earliest_hour, earliest_min, latest_hour, latest_min
    ]
    if not all(required_fields):
        return render(request, "core/booking_info.html", {
            "booking": booking,
            "client": booking.client,
            "is_authenticated": request.user.is_authenticated,
            "error_message": "All fields are required."
        })
    
    try:
        # Convert time to 4-digit format (HHMM)
        earliest_time = f"{earliest_hour.zfill(2)}{earliest_min.zfill(2)}"
        latest_time = f"{latest_hour.zfill(2)}{latest_min.zfill(2)}"
        
        # Validate time range
        if latest_time <= earliest_time:
            raise ValueError("Latest time must be after earliest time")
        
        # Update booking
        booking.booking_date = booking_date
        booking.booking_earliest = earliest_time
        booking.booking_latest = latest_time
        booking.save()
        
        # Redirect back to booking_info with success message
        success_msg = "Booking updated successfully!"
        if request.user.is_authenticated:
            request.session['booking_update_success'] = success_msg
            return redirect('booking_info')
        else:
            # For guests, we need to pass the access token to show the booking
            # We'll use session to store a success message
            request.session['booking_update_success'] = success_msg
            request.session['access_token_for_view'] = booking.access_token
            return redirect('booking_info')
        
    except Exception as e:
        # Handle errors by redirecting back with error in session
        error_msg = f"Error updating booking: {str(e)}"
        if request.user.is_authenticated:
            request.session['booking_update_error'] = error_msg
            return redirect('booking_info')
        else:
            request.session['booking_update_error'] = error_msg
            request.session['access_token_for_view'] = booking.access_token
            return redirect('booking_info')
