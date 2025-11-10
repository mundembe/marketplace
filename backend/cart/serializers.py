from rest_framework import serializers
from shop.models import Product
from .models import Cart, CartItem
from shop.serializers import ProductSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source="product",
        write_only=True
    )
    unit_price = serializers.ReadOnlyField(source="product.price")
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["id", "product", "product_id", "quantity", "unit_price", "subtotal"]

    def get_subtotal(self, obj):
        return obj.quantity * obj.product.price

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "user", "items", "total_amount"]
        read_only_fields = ["user", "items", "total_amount"]

    def get_total_amount(self, obj):
        return sum([item.quantity * item.product.price for item in obj.items.all()])

