from rest_framework import serializers
from .models import Menu, Dish,Cart, CartItem

# Укажите поля, которые хотите сериализовать

# Сериализатор для модели Dish
class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ['id', 'name', 'description', 'price', 'menu']  # Убедитесь, что поля корректные

# Сериализатор для модели CartItem
class CartItemSerializer(serializers.ModelSerializer):
    dish = DishSerializer()  # Вложенный сериализатор для блюда

    class Meta:
        model = CartItem
        fields = [ 'dish', 'quantity']  # Убедитесь, что поля корректные

# Сериализатор для модели Cart
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)  # Вложенный сериализатор для элементов корзины

    class Meta:
        model = Cart
        fields = ['id', 'session_key', 'created_at', 'updated_at', 'items']  # Убедитесь, что поля корректные



# Сериализатор для модели Menu
class MenuSerializer(serializers.ModelSerializer):
    dishes = DishSerializer(many=True,read_only=True)
    class Meta:
        model = Menu
        fields = '__all__'

