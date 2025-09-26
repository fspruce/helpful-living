from django.contrib import admin
from django import forms
from .models import Service, ClientList
from django_summernote.admin import SummernoteModelAdmin
from dal import autocomplete

# Register your models here.


@admin.register(Service)
class ServiceAdmin(SummernoteModelAdmin):
    list_display = ("service_name", "slug", "available")
    search_fields = ["service_name", "description", "excerpt"]
    list_filter = (
        "available",
    )
    prepopulated_fields = {"slug": ("service_name",)}
    summernote_fields = ("description",)


class ClientListAdminForm(forms.ModelForm):
    class Meta:
        model = ClientList
        fields = '__all__'
        widgets = {
            'linked_services': autocomplete.ModelSelect2Multiple(
                url='service-autocomplete'
            )
        }


@admin.register(ClientList)
class ClientListAdmin(admin.ModelAdmin):
    form = ClientListAdminForm
    list_display = ("first_name", "last_name", "email", "phone_number", "is_client")
    search_fields = ["first_name", "last_name", "email", "phone_number"]
    list_filter = (
        "is_client",
    )
