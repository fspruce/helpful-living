from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField

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
