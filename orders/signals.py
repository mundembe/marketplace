from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order, Tracking

@receiver(post_save, sender=Order)
def create_order_tracking(sender, instance, created, **kwargs):
    if created and not hasattr(instance, "tracking"):
        Tracking.objects.create(order=instance, status="Pending")
