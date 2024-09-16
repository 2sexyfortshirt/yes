from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import viewsets
from .models import Menu, Dish,Cart,CartItem
from .serializers import MenuSerializer, DishSerializer
from django.http import JsonResponse

from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Dish, Cart, CartItem
from .serializers import CartSerializer,CartItemSerializer




class MenuViewSet(viewsets.ModelViewSet):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer

class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer

"""class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer"""

"""class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer"""



@api_view(['POST'])
def add_to_cart(request):
    session_key = request.session.session_key
    if not session_key:
        request.session.create()
        session_key = request.session.session_key

    dish_id = request.data.get('dish_id')
    quantity = request.data.get('quantity', 1)

    try:
        dish = Dish.objects.get(id=dish_id)
        cart, created = Cart.objects.get_or_create(session_key=session_key)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, dish=dish)

        if not created:
            cart_item.quantity += int(quantity)
        cart_item.price = dish.price
        cart_item.save()


        # Проверьте, что сериализатор работает правильно
        serializer = CartSerializer(dish)
        print('Serialized data:', serializer.data)

        return Response(serializer.data, status=status.HTTP_200_OK)

    except Dish.DoesNotExist:
        return Response({'error': 'Dish not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_cart(request):
    user_session = request.session.session_key

    try:
        cart = Cart.objects.get(session_key=user_session)
    except Cart.DoesNotExist:
        return Response({'cart_items':[]},status=200)

    cart_items = CartItem.objects.filter(cart=cart)
    serialized_cart_items = CartItemSerializer(cart_items,many=True)
    return Response({'cart_items': serialized_cart_items.data})