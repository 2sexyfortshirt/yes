# myreactapp/urls.py
from django.urls import path, include

from rest_framework.routers import DefaultRouter
from .views import MenuViewSet, DishViewSet,add_to_cart,get_cart,create_order,update_cart_item_quantity,delete_item,IngredientsList,add_custom_burger_to_cart,remove_ingredient_from_cart


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
    path('api/create_order/', create_order,name='create_order'),
    path('api/update_cart_item/<int:item_id>/', update_cart_item_quantity, name='update_cart_item'),
    path('api/delete_item/<int:item_id>/',delete_item, name='delete_item'),
    path('api/ingredients/', IngredientsList.as_view(), name='ingredient-list'),
    path('api/cart/add_custom_burger/', add_custom_burger_to_cart, name='add_custom_burger_to_cart'),
    path('api/remove_ingredient/<int:item_id>/<int:ingredient_id>/', remove_ingredient_from_cart, name='remove_ingredient_from_cart'),
]

