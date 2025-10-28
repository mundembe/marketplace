from django.urls import path
from .views import ShopperOrderListCreateView, ShopOwnerOrderListView

urlpatterns = [
    path('shopper/', ShopperOrderListCreateView.as_view(), name='shopper-orders'),
    path('shop-owner/', ShopOwnerOrderListView.as_view(), name='shopowner-orders'),
]
