from django.urls import path
from .views import (
    MessageListCreateView,
    ProductReviewListCreateView,
    ReviewResponseView,
    SupportTicketListCreateView,
)

urlpatterns = [
    path('messages/', MessageListCreateView.as_view(), name='messages'),
    path('reviews/<int:product_id>/', ProductReviewListCreateView.as_view(), name='product-reviews'),
    path('reviews/<int:pk>/response/', ReviewResponseView.as_view(), name='review-response'),
    path('tickets/', SupportTicketListCreateView.as_view(), name='support-tickets'),
]
