from django.contrib import admin
from .models import Product, Category, ProductImage

# Inline model for multiple images
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1  # show one empty upload slot by default


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'price', 'stock', 'is_active', 'category')
    list_filter = ('is_active', 'category')
    search_fields = ('title', 'description')
    list_editable = ('price', 'stock', 'is_active')
    ordering = ('-id',)
    inlines = [ProductImageInline]  # 👈 Add this line
