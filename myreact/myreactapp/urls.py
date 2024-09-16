# myreactapp/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MenuViewSet, DishViewSet,add_to_cart,get_cart


# Создайте роутер и зарегистрируйте ViewSets
router = DefaultRouter()
router.register(r'menu', MenuViewSet)
router.register(r'dish', DishViewSet)
"""router.register(r'cart', CartViewSet)"""
"""router.register(r'cart_item', CartItemViewSet)"""

# Укажите URL-маршруты для API
urlpatterns = [
    path('', include(router.urls)),
    path('api/cart/', add_to_cart, name='add_to_cart'),
    path('api/get/', get_cart, name='get'),
    # Основной маршрут для API
]
