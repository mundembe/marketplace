from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Message, Review, SupportTicket
from .serializers import MessageSerializer, ReviewSerializer, SupportTicketSerializer
from .permissions import IsShopOwner, IsShopper
from shop.models import Product
from django.db.models import Avg, Count


# 📨 Messaging Views
class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(receiver=user) | Message.objects.filter(sender=user)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


# 💬 Reviews Views
class ProductReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated, IsShopper]

    def get_queryset(self):
        product_id = self.kwargs['product_id']
        return Review.objects.filter(product_id=product_id)

    def perform_create(self, serializer):
        product_id = self.kwargs['product_id']
        product = Product.objects.get(id=product_id)
        serializer.save(reviewer=self.request.user, product=product)

    # Custom GET method with aggregation
    def get(self, request, *args, **kwargs):
        product_id = self.kwargs['product_id']
        product = Product.objects.get(id=product_id)

        reviews_qs = self.get_queryset()
        serializer = self.get_serializer(reviews_qs, many=True)

        stats = reviews_qs.aggregate(
            average_rating=Avg('rating'),
            total_reviews=Count('id')
        )

        data = {
            'product_id': product.id,
            'product_title': product.title,
            'average_rating': round(stats['average_rating'] or 0, 2),
            'total_reviews': stats['total_reviews'],
            'reviews': serializer.data,
        }

        return Response(data)

class ReviewResponseView(generics.UpdateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated, IsShopOwner]
    queryset = Review.objects.all()

    def patch(self, request, *args, **kwargs):
        review = self.get_object()
        review.response = request.data.get('response', '')
        review.save()
        return Response({'message': 'Response added successfully'})


# 🆘 Support Tickets
class SupportTicketListCreateView(generics.ListCreateAPIView):
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'shop_owner':
            return SupportTicket.objects.all()
        return SupportTicket.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
