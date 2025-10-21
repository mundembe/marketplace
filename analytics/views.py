from datetime import date, timedelta
from django.db.models import Sum, Count, F
from rest_framework import generics, permissions
from rest_framework.response import Response
from orders.models import Order, OrderItem
from shop.models import Product
from .serializers import OverviewSerializer
from orders.permissions import IsShopOwner


class OverviewView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsShopOwner]
    serializer_class = OverviewSerializer

    def get(self, request):
        today = date.today()
        owner = request.user

        # All orders that include this owner’s products
        orders = Order.objects.filter(items__product__shop_owner=owner).distinct()

        # Daily and total revenue
        total_revenue = orders.aggregate(total=Sum('total_amount'))['total'] or 0
        daily_revenue = (
            orders.filter(created_at__date=today)
            .aggregate(total=Sum('total_amount'))['total'] or 0
        )

        # Order counts
        total_orders = orders.count()
        daily_orders = orders.filter(created_at__date=today).count()

        # Low-stock
        low_stock_count = Product.objects.filter(shop_owner=owner, stock__lt=5).count()

        data = {
            'total_revenue': total_revenue,
            'daily_revenue': daily_revenue,
            'total_orders': total_orders,
            'daily_orders': daily_orders,
            'low_stock_count': low_stock_count,
        }
        return Response(self.get_serializer(data).data)


class TopProductsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsShopOwner]
    queryset = OrderItem.objects.all() 

    def get_queryset(self):
        return OrderItem.objects.filter(product__shop_owner=self.request.user)

    def get(self, request):
        owner = request.user
        top = (
            self.get_queryset()
            .values(title=F('product__title'))
            .annotate(total_sold=Sum('quantity'), total_revenue=Sum('subtotal'))
            .order_by('-total_sold')[:5]
        )
        return Response(list(top))


class LowStockView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsShopOwner]
    queryset = Product.objects.all()

    def get_queryset(self):
        return Product.objects.filter(shop_owner=self.request.user)

    def get(self, request):
        low = self.get_queryset().filter(stock__lt=5, is_active=True)
        return Response([
            {'id': p.id, 'title': p.title, 'stock': p.stock}
            for p in low
        ])


class SalesTrendsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsShopOwner]
    queryset = Order.objects.all()

    def get_queryset(self):
        last_30 = date.today() - timedelta(days=30)
        return Order.objects.filter(
            created_at__date__gte=last_30,
            items__product__shop_owner=self.request.user
        )

    def get(self, request):
        qs = (
            self.get_queryset()
            .values('created_at__date')
            .annotate(total=Sum('total_amount'))
            .order_by('created_at__date')
        )
        return Response(list(qs))