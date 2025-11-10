from rest_framework import generics, permissions
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from .permissions import IsShopper, IsShopOwner
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


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

class ActiveCartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        order = Order.objects.filter(user=request.user, status="cart").first()
        if not order:
            return Response({"detail": "No active cart found."}, status=404)
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    

class CartDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsShopper]

    def get_object(self):
        # Get or create user's active cart
        cart, created = Order.objects.get_or_create(
            user=self.request.user,
            status='cart',
            defaults={'shipping_address': '', 'payment_method': 'unpaid'}
        )
        return cart


class OrderItemDeleteView(generics.DestroyAPIView):
    queryset = OrderItem.objects.all()
    permission_classes = [IsShopper]
    serializer_class = OrderItemSerializer

    def delete(self, request, *args, **kwargs):
        item = self.get_object()
        order = item.order

        # Remove the item
        item.delete()

        # Update order total
        order.total_amount = sum(i.subtotal for i in order.items.all())
        order.save()

        return Response({"detail": "Item removed", "total": order.total_amount}, status=status.HTTP_204_NO_CONTENT)