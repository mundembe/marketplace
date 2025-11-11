from rest_framework import generics, permissions, filters
from rest_framework.permissions import SAFE_METHODS, BasePermission
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
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description', 'category__name']


class ProductCreateView(generics.CreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated, IsShopOwner]

    def perform_create(self, serializer):
        serializer.save(shop_owner=self.request.user)



class ReadOnlyOrShopOwnerPermission(BasePermission):
    """
    Allow read-only access to everyone,
    but restrict write actions to shop owners only.
    """
    def has_permission(self, request, view):
        # Allow anyone to GET, HEAD, OPTIONS
        if request.method in SAFE_METHODS:
            return True
        # Require authentication for modifications
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.shop_owner == request.user


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [ReadOnlyOrShopOwnerPermission]

    def perform_update(self, serializer):
        serializer.save(shop_owner=self.request.user)