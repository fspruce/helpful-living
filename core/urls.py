from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="home"),
    path(
        "service-autocomplete/",
        views.ServiceAutocomplete.as_view(),
        name="service-autocomplete",
    ),
    path(
        "user-autocomplete/",
        views.UserAutocomplete.as_view(),
        name="user-autocomplete",
    ),
    path(
        "client-autocomplete/",
        views.ClientAutocomplete.as_view(),
        name="client-autocomplete",
    ),
    path("services/", views.ServiceList.as_view(), name="services"),
    path("services/<slug:slug>/", views.service_detail, name="service_detail"),
    path("bookings/", views.booking_page_no_service, name="bookings"),
    path("bookings/book-service/", views.book_service, name="book_service"),
    path(
        "bookings/<slug:slug>/",
        views.booking_page,
        name="bookings_with_service"
    ),
]
