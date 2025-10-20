from django.urls import path
from .views import (
    CategoryListCreateView,
    ProductListView, ProductCreateView, ProductDetailView,
)

urlpatterns = [
    path('categories/', CategoryListCreateView.as_view(), name='categories'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/add/', ProductCreateView.as_view(), name='product-add'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
]
