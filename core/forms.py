# ============================================================================
# FORMS MODULE - Custom form classes for user authentication and admin
# ============================================================================
# This module contains custom form classes that extend Django's built-in forms
# and third-party packages to provide enhanced functionality for user
# registration, authentication, and admin interface autocomplete features.

from django import forms
from allauth.account.forms import SignupForm, LoginForm
from .models import ClientList, Booking
from dal import autocomplete  # Django Autocomplete Light for Select2 widgets
import uuid
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit


class CustomSignupForm(SignupForm):
    """
    Custom user registration form extending django-allauth's SignupForm.

    This form adds first_name and last_name fields to the standard signup
    process, making them required fields with proper validation and styling.
    Uses crispy forms for enhanced Bootstrap styling and form handling.

    Attributes:
        first_name (CharField): User's first name (max 30 chars, required)
        last_name (CharField): User's last name (max 30 chars, required)

    Features:
        - Bootstrap-styled form with placeholders
        - Crispy forms integration for consistent styling
        - Automatic user profile creation with names
    """

    first_name = forms.CharField(
        max_length=30,
        required=True,
        widget=forms.TextInput(attrs={"placeholder": "First Name"}),
    )
    last_name = forms.CharField(
        max_length=30,
        required=True,
        widget=forms.TextInput(attrs={"placeholder": "Last Name"}),
    )

    def __init__(self, *args, **kwargs):
        """
        Initialize the signup form with crispy forms helper.

        Sets up form styling, method, and submit button with Bootstrap classes.
        The helper ensures consistent styling across the application.
        """
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_id = "signup-form"
        self.helper.form_method = "post"
        self.helper.add_input(
            Submit("submit", "Sign Up", css_class="btn cstm-btn")
        )

    def save(self, request):
        """
        Save the user with first and last name information.

        Extends the parent save method to include the additional name fields
        in the user model. This ensures the user profile is complete upon
        registration.

        Args:
            request: The HTTP request object from the registration view

        Returns:
            User: The newly created and saved user instance with names
        """
        user = super().save(request)
        user.first_name = self.cleaned_data["first_name"]
        user.last_name = self.cleaned_data["last_name"]
        user.save()
        return user


class CustomLoginForm(LoginForm):
    """
    Custom user authentication form extending django-allauth's LoginForm.

    This form provides consistent styling with the signup form using crispy
    forms helper. Maintains all the security features and validation of the
    base LoginForm while adding Bootstrap styling for better user experience.

    Features:
        - Bootstrap-styled login form
        - Crispy forms integration for consistent styling
        - Standard django-allauth authentication functionality
    """

    def __init__(self, *args, **kwargs):
        """
        Initialize the login form with crispy forms helper.

        Sets up form styling, method, and submit button to match the signup
        form styling. Ensures consistent user interface across authentication
        forms.
        """
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_id = "login-form"
        self.helper.form_method = "post"
        self.helper.add_input(
            Submit("submit", "Sign In", css_class="btn btn-primary")
        )


def create_autocomplete_form(
    model_class, autocomplete_fields=None, readonly_fields=None
):
    """
    Factory function to create ModelForm classes with autocomplete widgets.

    This function dynamically generates form classes with Select2 autocomplete
    widgets for foreign key and many-to-many fields. It's used in the admin
    interface to provide user-friendly dropdown selection with search
    functionality.

    Args:
        model_class (Model): The Django model class to create a form for
        autocomplete_fields (dict, optional): Mapping of field names to
                                            autocomplete configurations.
                                            Format:
                                            {'field_name': {
                                                'url': 'autocomplete-url',
                                                'multiple': True/False
                                            }}
        readonly_fields (list, optional): List of field names to make read-only
                                        with special styling

    Returns:
        type: A dynamically created ModelForm class with autocomplete widgets

    Example:
        MyForm = create_autocomplete_form(
            MyModel,
            autocomplete_fields={
                'user': {'url': 'user-autocomplete', 'multiple': False}
            },
            readonly_fields=['access_token']
        )
    """
    if autocomplete_fields is None:
        autocomplete_fields = {}
    if readonly_fields is None:
        readonly_fields = []

    # Build widgets dictionary for form customization
    form_widgets = {}

    # Configure autocomplete widgets for specified fields
    for field_name, config in autocomplete_fields.items():
        url = config.get("url")
        multiple = config.get("multiple", False)

        # Use appropriate Select2 widget based on field type
        if multiple:
            # For many-to-many fields - allows multiple selections
            form_widgets[field_name] = autocomplete.ModelSelect2Multiple(
                url=url
            )
        else:
            # For foreign key fields - single selection
            form_widgets[field_name] = autocomplete.ModelSelect2(url=url)

    # Configure readonly widgets with special styling
    for field_name in readonly_fields:
        form_widgets[field_name] = forms.TextInput(
            attrs={
                "readonly": "readonly",
                "style": "background-color: #f8f9fa;"
            }
        )

    class AutocompleteForm(forms.ModelForm):
        """
        Dynamically created ModelForm with autocomplete and readonly
        functionality.

        This inner class is created by the factory function and includes all
        the configured widgets and field behaviors specified in the parameters.
        """
        class Meta:
            model = model_class
            fields = "__all__"
            widgets = form_widgets

        def __init__(self, *args, **kwargs):
            """
            Initialize form with special field handling.

            Sets up autocomplete widgets, readonly fields, and automatic
            token generation for new instances.
            """
            super().__init__(*args, **kwargs)

            # Auto-generate unique access_token for new instances
            # This ensures each new record has a unique identifier
            if "access_token" in self.fields and not self.instance.pk:
                self.fields["access_token"].initial = str(uuid.uuid4())

            # Ensure readonly fields are properly configured
            # Adds readonly attribute to prevent user modification
            for field_name in readonly_fields:
                if field_name in self.fields:
                    self.fields[field_name].widget.attrs["readonly"] = True

    return AutocompleteForm


# ============================================================================
# ADMIN FORM INSTANCES - Pre-configured forms for admin interface
# ============================================================================
# These form instances are created using the factory function above and are
# specifically configured for use in the Django admin interface with
# autocomplete functionality for better user experience.

# ClientList admin form with autocomplete for user and services
ClientListAdminForm = create_autocomplete_form(
    ClientList,
    autocomplete_fields={
        # Single user selection
        "user": {"url": "user-autocomplete", "multiple": False},
        # Multiple services selection
        "linked_services": {
            "url": "service-autocomplete",
            "multiple": True
        },
    },
)

# Booking admin form with autocomplete and readonly access token
BookingAdminForm = create_autocomplete_form(
    Booking,
    autocomplete_fields={
        # Single client selection
        "client": {"url": "client-autocomplete", "multiple": False},
        # Multiple services selection
        "services": {
            "url": "service-autocomplete",
            "multiple": True
        },
    },
    # Prevent manual editing of access tokens
    readonly_fields=["access_token"],
)
