from django.contrib import admin
from .models import Product, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'shop_owner', 'price', 'stock', 'is_active', 'created_at')
    list_filter = ('is_active', 'category')
    search_fields = ('title', 'description')
    list_editable = ('price', 'stock', 'is_active')
    ordering = ('-created_at',)
