# ============================================================================
# MODELS MODULE - Database models for the Helpful Living application
# ============================================================================
# This module defines the core data models for managing services, clients,
# and bookings in the Helpful Living platform. All models follow Django
# best practices with proper field validation, relationships, and metadata.

from django.db import models
from django.contrib.auth.models import User  # Django's built-in user model
from cloudinary.models import CloudinaryField  # For cloud-based image storage
import secrets  # For secure token generation


class Service(models.Model):
    """
    Represents a service offered by the Helpful Living platform.

    This model stores information about services that can be provided to
    clients, including service details, availability status, and associated
    imagery. Services can be linked to clients through the ClientList model
    and included in bookings.

    Attributes:
        service_name (str): Unique name of the service (max 200 chars)
        slug (str): URL-friendly version of service name for routing
        image_url (CloudinaryField): Service image stored in Cloudinary
        description (str): Detailed description of the service
        excerpt (str): Short summary for service previews (optional)
        available (bool): Whether service is currently available for booking

    Relationships:
        - Many-to-many with ClientList (services linked to clients)
        - Many-to-many with Booking (services included in bookings)
    """

    # Core service identification
    service_name = models.CharField(
        max_length=200,
        unique=True,
        help_text="Unique name of the service offered"
    )
    slug = models.SlugField(
        max_length=200,
        unique=True,
        help_text="URL-friendly version of service name"
    )

    # Service content and media
    image_url = CloudinaryField(
        "image",
        default="placeholder",
        help_text="Service image stored in Cloudinary CDN"
    )
    description = models.TextField(
        help_text="Detailed description of what the service includes"
    )
    excerpt = models.TextField(
        blank=True,
        help_text="Short summary for service previews and listings"
    )

    # Service availability
    available = models.BooleanField(
        default=False,
        help_text="Whether this service is currently available for booking"
    )

    class Meta:
        """Metadata options for the Service model."""
        ordering = ["service_name"]  # Order services alphabetically
        verbose_name = "Service"
        verbose_name_plural = "Services"

    def __str__(self):
        """
        String representation of the Service model.

        Returns a human-readable string showing the service name and
        availability status for admin interface and debugging.

        Returns:
            str: Format "Service Name | Available: True/False"
        """
        return f"{self.service_name} | Available: {self.available}"


class ClientList(models.Model):
    """
    Represents a potential or confirmed client in the system.

    This model stores client information and can be optionally linked to a
    Django User account for authenticated access. Clients can be associated
    with multiple services and have a status indicating whether they are
    confirmed clients or just potential leads.

    The model serves as a bridge between the authentication system and the
    booking system, allowing both registered users and guest clients to
    be managed in a unified way.

    Attributes:
        user (User): Optional link to Django User account (1-to-1)
        first_name (str): Client's first name (max 200 chars)
        last_name (str): Client's last name (max 200 chars)
        email (str): Unique email address for contact
        phone_number (str): Contact phone number (max 20 chars)
        linked_services (ManyToMany): Services associated with this client
        is_client (bool): Whether this is a confirmed client or just a lead

    Relationships:
        - One-to-one with User (optional authentication account)
        - Many-to-many with Service (client's associated services)
        - One-to-one with Booking (client can have one active booking)
    """

    # Optional link to authenticated user account
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        unique=True,
        help_text="Optional link to Django User account for authentication"
    )

    # Client personal information
    first_name = models.CharField(
        max_length=200,
        help_text="Client's first name"
    )
    last_name = models.CharField(
        max_length=200,
        help_text="Client's last name"
    )
    email = models.EmailField(
        unique=True,
        help_text="Unique email address for client contact"
    )
    phone_number = models.CharField(
        max_length=20,
        help_text="Client's contact phone number"
    )

    # Client relationships and status
    linked_services = models.ManyToManyField(
        "Service",
        blank=True,
        help_text="Services associated with this client"
    )
    is_client = models.BooleanField(
        default=False,
        help_text="True if confirmed client, False if just a lead"
    )

    class Meta:
        """Metadata options for the ClientList model."""
        # Order by client status first, then alphabetically by last name
        ordering = ['is_client', 'last_name']
        verbose_name = "Client"
        verbose_name_plural = "Clients"

    def __str__(self):
        """
        String representation of the ClientList model.

        Returns a human-readable string showing the client's name and
        status for admin interface and debugging.

        Returns:
            str: Format "Last, First | Client Status: True/False"
        """
        return (
            f"{self.last_name}, {self.first_name} | "
            f"Client Status: {self.is_client}"
        )


class Booking(models.Model):
    """
    Represents a service booking made by a client.

    This model manages the booking process, linking clients to services
    with specific dates and times. Each booking has a unique access token
    for secure access and can include multiple services. The booking
    tracks confirmation status and maintains audit trails with creation
    and update timestamps.

    Security Features:
        - Unique access token for secure booking access
        - Automatic token generation on creation
        - Audit trail with creation and update timestamps

    Attributes:
        client (ClientList): The client making the booking (1-to-1)
        services (ManyToMany): Services included in this booking
        booking_date (Date): Date when booking was created (auto-set)
        booking_time (Time): Time when booking was created (auto-set)
        is_confirmed (bool): Whether booking has been confirmed
        created_on (DateTime): When booking record was created
        updated_on (DateTime): When booking was last modified
        access_token (str): Unique token for secure booking access

    Relationships:
        - One-to-one with ClientList (each client can have one active booking)
        - Many-to-many with Service (booking can include multiple services)
    """

    # Core booking relationships
    client = models.OneToOneField(
        ClientList,
        on_delete=models.CASCADE,
        help_text="The client making this booking"
    )
    services = models.ManyToManyField(
        "Service",
        blank=False,
        help_text="Services included in this booking (at least one required)"
    )

    # Booking timing (auto-generated on creation)
    booking_date = models.DateField(
        auto_now_add=True,
        help_text="Date for booking to be scheduled"
    )
    booking_earliest = models.CharField(
        max_length=4,
        help_text="Earliest time when booking can be scheduled"
    )
    booking_latest = models.CharField(
        max_length=4,
        help_text="Latest time when booking can be scheduled"
    )

    # Booking status and audit trail
    is_confirmed = models.BooleanField(
        default=False,
        help_text="Whether this booking has been confirmed"
    )
    created_on = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when booking record was created"
    )
    updated_on = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when booking was last modified"
    )

    # Security token for booking access
    access_token = models.CharField(
        max_length=48,
        unique=True,
        help_text="Unique token for secure booking access and verification"
    )

    def save(self, *args, **kwargs):
        """
        Override save method to auto-generate access token for new bookings.

        Generates a secure URL-safe token when creating a new booking record.
        This token is used for secure access to booking details without
        requiring user authentication.

        The token is only generated once during creation to maintain
        consistency and security.
        """
        if not self.pk:  # Only generate token for new instances
            self.access_token = secrets.token_urlsafe(24)
        super().save(*args, **kwargs)

    class Meta:
        """Metadata options for the Booking model."""
        # Order by most recent bookings first
        ordering = ["-booking_date", "-created_on"]
        verbose_name = "Booking"
        verbose_name_plural = "Bookings"

    def __str__(self):
        """
        String representation of the Booking model.

        Returns a human-readable string showing the client email and
        booking date for admin interface and debugging.

        Returns:
            str: Format "Booking for client@email.com on date"
        """
        return (
            f"Booking for {self.client.email} on "
            f"{self.booking_date}"
        )
