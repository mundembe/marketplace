from rest_framework import serializers

class OverviewSerializer(serializers.Serializer):
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    daily_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_orders = serializers.IntegerField()
    daily_orders = serializers.IntegerField()
    low_stock_count = serializers.IntegerField()
