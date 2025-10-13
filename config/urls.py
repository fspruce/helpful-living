from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("allauth.urls")),
    path("summernote/", include("django_summernote.urls")),
    path("", include("core.urls")),
]

# Custom error handlers
handler404 = 'core.views.handler404'
handler403 = 'core.views.handler403'
handler500 = 'core.views.handler500'
handler400 = 'core.views.handler400'
