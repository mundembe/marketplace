from rest_framework import generics, permissions
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from .permissions import IsShopOwner


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer


class ProductCreateView(generics.CreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated, IsShopOwner]

    def perform_create(self, serializer):
        serializer.save(shop_owner=self.request.user)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated, IsShopOwner]

    def perform_update(self, serializer):
        serializer.save(shop_owner=self.request.user)
