from django import forms
from .models import ClientList, Booking
from dal import autocomplete


def create_autocomplete_form(model_class, autocomplete_fields=None):
    """
    Create a form with autocomplete widgets for specified fields.

    Args:
        model_class: The Django model class
        autocomplete_fields: Dict mapping field names to autocomplete configs
                           {'field_name': {'url': 'autocomplete-url', 'multiple': True/False}}
    """
    if autocomplete_fields is None:
        autocomplete_fields = {}

    # Build widgets dictionary
    form_widgets = {}
    for field_name, config in autocomplete_fields.items():
        url = config.get('url')
        multiple = config.get('multiple', False)

        if multiple:
            form_widgets[field_name] = autocomplete.ModelSelect2Multiple(url=url)
        else:
            form_widgets[field_name] = autocomplete.ModelSelect2(url=url)

    class AutocompleteForm(forms.ModelForm):
        class Meta:
            model = model_class
            fields = "__all__"
            widgets = form_widgets

    return AutocompleteForm


# Create specific forms using the factory function
ClientListAdminForm = create_autocomplete_form(
    ClientList,
    autocomplete_fields={
        'user': {
            'url': 'user-autocomplete',
            'multiple': False
        },
        'linked_services': {
            'url': 'service-autocomplete',
            'multiple': True
        }
    }
)

BookingAdminForm = create_autocomplete_form(
    Booking,
    autocomplete_fields={
        'client': {
            'url': 'client-autocomplete',
            'multiple': False
        },
        'services': {  # If Booking has a services field
            'url': 'service-autocomplete',
            'multiple': True
        }
    }
)
