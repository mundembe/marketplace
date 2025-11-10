from django.urls import path
from .views import (
    ShopperOrderListCreateView,
    ShopOwnerOrderListView,
    CartDetailView,
    OrderItemDeleteView,
)

urlpatterns = [
    path('shopper/', ShopperOrderListCreateView.as_view(), name='shopper-orders'),
    path('shopowner/', ShopOwnerOrderListView.as_view(), name='shopowner-orders'),
    path('cart/', CartDetailView.as_view(), name='cart-detail'),
    path('cart/item/<int:pk>/', OrderItemDeleteView.as_view(), name='cart-item-delete'),
]