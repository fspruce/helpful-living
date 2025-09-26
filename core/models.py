from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField
import secrets

# Create your models here.


class Service(models.Model):
    service_name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True)
    image_url = CloudinaryField("image", default="placeholder")
    description = models.TextField()
    excerpt = models.TextField(blank=True)
    available = models.BooleanField(default=False)

    class Meta:
        ordering = ["service_name"]

    def __str__(self):
        return f"{self.service_name} | Available: {self.available}"


class ClientList(models.Model):
    """
    Stores a single potential client related to :model:`auth.User`.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        unique=True
    )
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)
    linked_services = models.ManyToManyField("Service", blank=True)
    is_client = models.BooleanField(default=False)

    class Meta:
        ordering = ['is_client', 'last_name']

    def __str__(self):
        return f"{self.last_name}, {self.first_name} | Client Status: {self.is_client}"


class Booking(models.Model):
    client = models.OneToOneField(ClientList, on_delete=models.CASCADE)
    services = models.ManyToManyField("Service", blank=False)
    booking_date = models.DateField(auto_now_add=True)
    booking_time = models.TimeField(auto_now_add=True)
    is_confirmed = models.BooleanField(default=False)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    access_token = models.CharField(max_length=48, unique=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.access_token = secrets.token_urlsafe(24)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ["-booking_date", "-booking_time"]

    def __str__(self):
        return f"Booking for {self.client.email} at {self.booking_date, self.booking_time}"
