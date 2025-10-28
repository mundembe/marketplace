from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('shopper', 'Shopper'),
        ('shop_owner', 'Shop Owner'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='shopper')

    def __str__(self):
        return f"{self.username} ({self.role})"
