from rest_framework import permissions

class IsShopOwner(permissions.BasePermission):
    """
    Allows access only to users with role='shop_owner'
    """
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) == "shop_owner"
        )
