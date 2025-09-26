from django.contrib import admin
from .models import Service, ClientList, Booking
from . import forms
from django_summernote.admin import SummernoteModelAdmin


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


@admin.register(ClientList)
class ClientListAdmin(admin.ModelAdmin):
    form = forms.ClientListAdminForm
    list_display = ("first_name", "last_name", "email", "phone_number", "is_client")
    search_fields = ["first_name", "last_name", "email", "phone_number"]
    list_filter = (
        "is_client",
    )


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    form = forms.BookingAdminForm
    list_display = (
        "client__first_name",
        "client__last_name",
        "client__email",
        "booking_date",
        "booking_time",
        "is_confirmed"
    )
    search_fields = [
        "client__first_name",
        "client__last_name",
        "client__email"
    ]
    list_filter = (
        "is_confirmed",
        "booking_date",
        "client__is_client"
    )
