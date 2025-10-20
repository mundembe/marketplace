from rest_framework import serializers
from .models import Order, OrderItem, Tracking
from shop.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.ReadOnlyField(source='product.title')

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_title', 'quantity', 'unit_price', 'subtotal']
        read_only_fields = ['unit_price', 'subtotal']


class TrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tracking
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    tracking = TrackingSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'shipping_address', 'payment_method',
            'status', 'total_amount', 'created_at', 'items', 'tracking'
        ]
        read_only_fields = ['user', 'status', 'total_amount', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        order = Order.objects.create(user=user, **validated_data)
        total = 0

        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
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

        return order
