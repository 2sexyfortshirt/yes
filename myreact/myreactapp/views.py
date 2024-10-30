

# Create your views here.

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework import generics
from .models import Menu, Dish,Cart,CartItem
from .serializers import MenuSerializer, DishSerializer
from django.shortcuts import get_object_or_404


from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Dish, Cart, CartItem,Order,Ingredients
from .serializers import CartSerializer,CartItemSerializer,OrderSerializer,IngredientsSerializer,CustomBurgerSerializer

class IngredientsList(generics.ListAPIView):
    queryset = Ingredients.objects.all()
    serializer_class = IngredientsSerializer




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
    ingredients = request.data.get('ingredients')
    print('Ingredients:', ingredients)

    try:
        dish = Dish.objects.get(id=dish_id)

        # Проверка существующей корзины
        cart = Cart.objects.filter(session_key=session_key).first()

        # Если корзина существует и заказ уже оформлен, создаем новую сессию
        if cart and cart.is_ordered:
            request.session.create()
            session_key = request.session.session_key
            cart = None  # Обнуляем, чтобы создать новую корзину

        # Создание или получение корзины
        if cart is None:
            cart, created = Cart.objects.get_or_create(session_key=session_key, is_ordered=False)

        # Добавление или обновление предмета корзины
        cart_item, created = CartItem.objects.get_or_create(cart=cart, dish=dish)

        # Обрабатываем ингредиенты
        if ingredients:
            selected_ingredients = Ingredients.objects.filter(id__in=ingredients)
            cart_item.ingredients.set(selected_ingredients)  # Привязываем выбранные ингредиенты к элементу корзины




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
        cart = Cart.objects.get(session_key=user_session,is_ordered=False)
    except Cart.DoesNotExist:
        return Response({'cart_items':[]},status=200)

    cart_items = CartItem.objects.filter(cart=cart)
    serialized_cart_items = CartItemSerializer(cart_items,many=True)
    return Response({'cart_items': serialized_cart_items.data})



@api_view(['POST'])
def create_order(request):
    user_session = request.session.session_key
    phone_number = request.data.get('phone_number')
    delivery_address = request.data.get('delivery_address')
    try:



        cart = Cart.objects.get(session_key=user_session, is_ordered=False)
        total_price = 0
        for item in cart.items.all():
            dish = item.dish
            if dish is None:
                # Option 1: Skip this item (continue to next iteration)
                continue
            total_price += dish.price * item.quantity
            print(f'Item: {item.dish.name}, Ingredients: {item.ingredients.all()}')

        for ingredient in item.ingredients.all():
            if ingredient.extra_cost is not None:
                print(f"Ingredient: {ingredient.name}, Extra Cost: {ingredient.extra_cost}, Quantity: {item.quantity}")
                total_price += ingredient.extra_cost * item.quantity

            else:
                print(f"Ингредиент {ingredient.name} не имеет стоимости")

        order = Order.objects.create(cart=cart, total_price=total_price, status="Pending",phone_number=phone_number,delivery_address=delivery_address)
        serializer = OrderSerializer(order)
        cart.is_ordered = True
        cart.save()
        """request.session.cycle_key()"""


        return JsonResponse({'success': True, 'order': serializer.data,'message': 'Ваш заказ успешно оформлен!'})



    except Cart.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Cart not found'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)



@api_view(['PUT'])
def update_cart_item_quantity(request,item_id):
    user_session = request.session.session_key
    try:
        cart_item = CartItem.objects.get(id=item_id)

        if cart_item.cart.session_key != user_session:
            return Response({'success': False, 'message': 'У вас нет доступа к этому элементу'}, status=403)
        serializer = CartItemSerializer(cart_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()


            return Response({'success':True,'message':'Количество обновлено'},status=200)
        else:
            return Response({'success':False,'message':'Количество должно быть больше нуля'},status=400)
    except CartItem.DoesNotExist:
        return Response ({'success':False,'message':'Предмет не найден'},status=404)

@api_view(['DELETE'])
def delete_item(request,item_id):
    user_session = request.session.session_key
    if not user_session:
        return Response({'error' : 'No active session'},status=status.HTTP_400_BAD_REQUEST)

    try:
        cart_item = CartItem.objects.get(id=item_id)

        cart_item.delete()
        cart = Cart.objects.get(session_key=user_session, is_ordered=False)

        serializer = CartSerializer(cart)



        return Response({'success':True,'message': 'Item removed from cart',  'cart': serializer.data },status=status.HTTP_200_OK)
    except CartItem.DoesNotExist:
        return Response({'error':'Item not found in cart '},status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def add_custom_burger_to_cart(request):
    if request.method == 'POST':
        print("Данные запроса:", request.data)
        serializer = CustomBurgerSerializer(data=request.data)

        if serializer.is_valid():
            session_key = request.session.session_key
            if not session_key:
                request.session.create()

            # Создаем кастомный бургер
            cart, created = Cart.objects.get_or_create(session_key=request.session.session_key, is_ordered=False)

            menu_id = request.data.get('menu_id')
            try:
                menu = Menu.objects.get(id=menu_id)
                dish_type = menu.dish_type
            except Menu.DoesNotExist:
                return Response({"error": "Меню не найдено"}, status=status.HTTP_404_NOT_FOUND)

            # Добавляем кастомный бургер в корзину как элемент
            cart_item = CartItem.objects.create(
                cart=cart,
                menu_id=menu_id,
                custom_dish_type=dish_type,


                # Здесь добавьте дополнительные поля, если они нужны
            )
            cart_item.ingredients.set(serializer.validated_data['ingredients'])  # Добавляем ингредиенты
            cart_item.save()


            return Response({'message': 'Custom burger added to cart successfully.'}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def remove_ingredient_from_cart(request, ingredient_id):
    try:
        # Получаем ингредиент
        ingredient = get_object_or_404(Ingredients, id=ingredient_id)

        # Удаляем ингредиент из всех связанных CartItems
        ingredient.cartitem_set.clear()

        return JsonResponse({'success': True, 'message': 'Ингредиент успешно удален.'})

    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=400)