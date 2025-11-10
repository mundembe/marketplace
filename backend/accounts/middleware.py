from datetime import datetime
from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from django.conf import settings

class AutoRefreshJWTMiddleware(MiddlewareMixin):
    def process_request(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return

        token_str = auth_header.split(' ')[1]
        try:
            token = AccessToken(token_str)
        except TokenError:
            # Try refreshing
            refresh_token = request.COOKIES.get('refresh_token')
            if refresh_token:
                try:
                    refresh = RefreshToken(refresh_token)
                    new_access = str(refresh.access_token)
                    request.META['HTTP_AUTHORIZATION'] = f'Bearer {new_access}'
                except TokenError:
                    pass  # refresh expired — frontend will handle login
