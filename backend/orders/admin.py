from django.contrib import admin
from .models import Order, OrderItem, Tracking

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'payment_method', 'total_amount', 'created_at')
    list_filter = ('status', 'payment_method')
    search_fields = ('user__username', 'shipping_address', 'tracking_id')
    inlines = [OrderItemInline]

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'product', 'quantity', 'unit_price', 'subtotal')
    search_fields = ('product__title',)
    list_filter = ('order__status', 'product')

@admin.register(Tracking)
class TrackingAdmin(admin.ModelAdmin):
    list_display = ('id', 'tracking_number', 'carrier', 'status', 'estimated_arrival')
    search_fields = ('tracking_number', 'carrier')
