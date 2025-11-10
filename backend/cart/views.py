from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from shop.models import Product
from orders.models import Order, OrderItem
from orders.serializers import OrderSerializer

class CartView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        # optional: if cart items empty, just show an empty cart
        return cart


class AddToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        cart, _ = Cart.objects.get_or_create(user=request.user)
        product = Product.objects.get(id=product_id)

        item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            item.quantity += quantity
        item.save()

        return Response({"message": "Item added", "item_id": item.id})


class UpdateCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        cart = Cart.objects.get(user=request.user)
        item = cart.items.get(pk=pk)
        item.quantity = request.data.get("quantity", item.quantity)
        item.save()
        return Response({"message": "Quantity updated"})


class RemoveCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        cart = Cart.objects.get(user=request.user)
        cart.items.filter(pk=pk).delete()
        return Response({"message": "Item removed"})


class ClearCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        cart = Cart.objects.get(user=request.user)
        cart.items.all().delete()
        return Response({"message": "Cart cleared"})


# ---------- CheckOut ----------

class CheckoutView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user

        # Get the user's cart
        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            return Response({"error": "Cart not found."}, status=status.HTTP_404_NOT_FOUND)

        if not cart.items.exists():
            return Response({"error": "Your cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        # Create order
        order = Order.objects.create(
            user=user,
            shipping_address=request.data.get("shipping_address", ""),
            payment_method=request.data.get("payment_method", "COD"),
        )

        total = 0
        for item in cart.items.all():
            product = item.product
            quantity = item.quantity
            unit_price = product.price
            subtotal = unit_price * quantity
            total += subtotal

            # Reduce stock
            product.stock -= quantity
            product.save()

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                unit_price=unit_price,
                subtotal=subtotal,
            )

        order.total_amount = total
        order.save()

        # Clear the cart
        cart.items.all().delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)