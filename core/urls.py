from django.urls import path
from . import views

urlpatterns = [
  path("", views.index, name="home"),
  path("service-autocomplete/", views.ServiceAutocomplete.as_view(), name="service-autocomplete"),
  path("user-autocomplete/", views.UserAutocomplete.as_view(), name="user-autocomplete"),
  path("client-autocomplete/", views.ClientAutocomplete.as_view(), name="client-autocomplete"),
]
