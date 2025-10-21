from rest_framework import serializers
from .models import Message, Review, SupportTicket


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.ReadOnlyField(source='sender.username')
    receiver_username = serializers.ReadOnlyField(source='receiver.username')

    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'receiver', 'sender_username', 'receiver_username',
            'subject', 'body', 'is_read', 'created_at'
        ]
        read_only_fields = ['sender', 'is_read', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    reviewer_username = serializers.ReadOnlyField(source='reviewer.username')
    product_title = serializers.ReadOnlyField(source='product.title')

    class Meta:
        model = Review
        fields = [
            'id', 'product', 'product_title', 'reviewer', 'reviewer_username',
            'rating', 'comment', 'response', 'created_at'
        ]
        read_only_fields = ['reviewer', 'product', 'response', 'created_at']


class SupportTicketSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = SupportTicket
        fields = [
            'id', 'user', 'user_username', 'order_id',
            'subject', 'message', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'status', 'created_at', 'updated_at']
