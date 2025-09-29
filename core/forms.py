from django import forms
from allauth.account.forms import SignupForm, LoginForm
from .models import ClientList, Booking
from dal import autocomplete
import uuid
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit


class CustomSignupForm(SignupForm):
    """Custom signup form that includes first name and last name"""

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
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_id = "signup-form"
        self.helper.form_method = "post"
        self.helper.add_input(Submit("submit", "Sign Up", css_class="btn btn-primary"))

    def save(self, request):
        user = super().save(request)
        user.first_name = self.cleaned_data["first_name"]
        user.last_name = self.cleaned_data["last_name"]
        user.save()
        return user


class CustomLoginForm(LoginForm):
    """Custom login form with crispy forms helper"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_id = "login-form"
        self.helper.form_method = "post"
        self.helper.add_input(Submit("submit", "Sign In", css_class="btn btn-primary"))


def create_autocomplete_form(
    model_class, autocomplete_fields=None, readonly_fields=None
):
    """
    Create a form with autocomplete widgets for specified fields.

    Args:
        model_class: The Django model class
        autocomplete_fields: Dict mapping field names to autocomplete configs
                           {'field_name': {'url': 'autocomplete-url', 'multiple': True/False}}
    """
    if autocomplete_fields is None:
        autocomplete_fields = {}
    if readonly_fields is None:
        readonly_fields = []

    # Build widgets dictionary
    form_widgets = {}
    for field_name, config in autocomplete_fields.items():
        url = config.get("url")
        multiple = config.get("multiple", False)

        if multiple:
            form_widgets[field_name] = autocomplete.ModelSelect2Multiple(url=url)
        else:
            form_widgets[field_name] = autocomplete.ModelSelect2(url=url)

    # Add readonly widgets
    for field_name in readonly_fields:
        form_widgets[field_name] = forms.TextInput(
            attrs={"readonly": "readonly", "style": "background-color: #f8f9fa;"}
        )

    class AutocompleteForm(forms.ModelForm):
        class Meta:
            model = model_class
            fields = "__all__"
            widgets = form_widgets

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)

            # Auto-generate access_token for new instances
            if "access_token" in self.fields and not self.instance.pk:
                self.fields["access_token"].initial = str(uuid.uuid4())

            # Make readonly fields truly readonly
            for field_name in readonly_fields:
                if field_name in self.fields:
                    self.fields[field_name].widget.attrs["readonly"] = True

    return AutocompleteForm


# Create specific forms using the factory function
ClientListAdminForm = create_autocomplete_form(
    ClientList,
    autocomplete_fields={
        "user": {"url": "user-autocomplete", "multiple": False},
        "linked_services": {"url": "service-autocomplete", "multiple": True},
    },
)

BookingAdminForm = create_autocomplete_form(
    Booking,
    autocomplete_fields={
        "client": {"url": "client-autocomplete", "multiple": False},
        "services": {"url": "service-autocomplete", "multiple": True},
    },
    readonly_fields=["access_token"],
)
