from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class ProductSerializer(serializers.ModelSerializer):
    shop_owner = serializers.ReadOnlyField(source='shop_owner.username')
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Product
        fields = [
            'id', 'shop_owner', 'title', 'description', 'price',
            'stock', 'is_active', 'category', 'category_name',
            'created_at', 'updated_at'
        ]
