from django.contrib import admin
from .models import Message, Review, SupportTicket

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'receiver', 'subject', 'is_read', 'created_at')
    list_filter = ('is_read',)
    search_fields = ('subject', 'body', 'sender__username', 'receiver__username')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'reviewer', 'rating', 'created_at')
    list_filter = ('rating',)
    search_fields = ('product__title', 'reviewer__username', 'comment')
    ordering = ('-created_at',)

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'order_id', 'subject', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('subject', 'user__username', 'message')
    ordering = ('-created_at',)
