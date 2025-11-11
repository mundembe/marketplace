from rest_framework import serializers
from .models import Order, OrderItem, Tracking
from shop.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.ReadOnlyField(source='product.title')
    product_image = serializers.ImageField(source='product.primary_image', read_only=True)
    unit_price = serializers.ReadOnlyField()
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_title', 'product_image',
            'quantity', 'unit_price', 'subtotal'
        ]


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

        # ✅ Reuse cart if it exists
        order, created = Order.objects.get_or_create(
            user=user,
            status='cart',
            defaults={
                'shipping_address': validated_data.get('shipping_address', ''),
                'payment_method': validated_data.get('payment_method', 'unpaid'),
            }
        )

        total = order.total_amount or 0

        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']

            order_item, created = OrderItem.objects.get_or_create(
                order=order,
                product=product,
                defaults={
                    'quantity': quantity,
                    'unit_price': product.price,
                    'subtotal': product.price * quantity,
                },
            )
            if not created:
                order_item.quantity += quantity
                order_item.subtotal = order_item.quantity * order_item.unit_price
                order_item.save()

            total += product.price * quantity

        order.total_amount = total
        order.save()

        return order
