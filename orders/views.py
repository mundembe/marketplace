from rest_framework import generics, permissions
from .models import Order, Tracking
from .serializers import OrderSerializer
from .permissions import IsShopper, IsShopOwner


class ShopperOrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsShopper]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

class ShopOwnerOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsShopOwner]

    def get_queryset(self):
        # Show only orders containing the shop owner's products
        return Order.objects.filter(items__product__shop_owner=self.request.user).distinct()
