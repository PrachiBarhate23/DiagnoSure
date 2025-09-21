from django.contrib import admin
from django.urls import path, include
from core import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('dj_rest_auth.urls')),  
    path('auth/registration/', include('dj_rest_auth.registration.urls')),  
    path('auth/social/', include('allauth.socialaccount.urls')),  
    path('api/', include('core.urls')),

    # JWT login and refresh endpoints
    path('auth/jwt/login/', TokenObtainPairView.as_view(), name='jwt_login'),
    path('auth/jwt/refresh/', TokenRefreshView.as_view(), name='jwt_refresh'),

    # Root path
    path('', views.home),
]
