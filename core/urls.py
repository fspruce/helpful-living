from django.urls import path
from . import views

urlpatterns = [
  path("", views.index, name="home"),
  path("service-autocomplete/", views.ServiceAutocomplete.as_view(), name="service-autocomplete"),
]
