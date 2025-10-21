from django.urls import path
from .views import OverviewView, TopProductsView, LowStockView, SalesTrendsView

urlpatterns = [
    path('overview/', OverviewView.as_view(), name='overview'),
    path('top-products/', TopProductsView.as_view(), name='top-products'),
    path('low-stock/', LowStockView.as_view(), name='low-stock'),
    path('sales-trends/', SalesTrendsView.as_view(), name='sales-trends'),
]
