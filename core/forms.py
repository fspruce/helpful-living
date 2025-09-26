from django import forms
from .models import ClientList, Booking
from dal import autocomplete


def create_service_autocomplete_form(model_class, service_field='linked_services'):
    class ServiceAutocompleteForm(forms.ModelForm):
        class Meta:
            model = model_class
            fields = "__all__"
            widgets = {
                service_field: autocomplete.ModelSelect2Multiple(
                    url="service-autocomplete"
                  )
                }

    return ServiceAutocompleteForm


ClientListAdminForm = create_service_autocomplete_form(ClientList, 'linked_services')
BookingAdminForm = create_service_autocomplete_form(Booking, 'services')
