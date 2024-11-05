from rest_framework import serializers
from .models import Menu, Dish,Cart, CartItem,Order,Ingredients

# Укажите поля, которые хотите сериализовать

class CustomBurgerSerializer(serializers.Serializer):
    menu_id = serializers.IntegerField()
    ingredients = serializers.PrimaryKeyRelatedField(queryset=Ingredients.objects.all(), many=True)

    def validate_menu_id(self, value):
        if not Menu.objects.filter(id=value).exists():
            raise serializers.ValidationError("Указанный тип блюда не существует.")
        return value

    def validate_ingredients(self, value):
        if not value:
            raise serializers.ValidationError("Необходимо выбрать хотя бы один ингредиент.")
        return value



class IngredientsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ingredients
        fields = ['id','name', 'extra_cost']

class DishSerializer(serializers.ModelSerializer):
    ingredients = IngredientsSerializer(many=True, read_only=True)
    dish_type = serializers.CharField(source='menu.dish_type', allow_null=True, required=False)
    class Meta:
        model = Dish
        fields = ['id', 'name', 'description', 'price', 'menu','ingredients','picture','dish_type']  # Убедитесь, что поля корректные


# Сериализатор для модели CartItem
class CartItemSerializer(serializers.ModelSerializer):

    dish = DishSerializer()
    ingredients = IngredientsSerializer(many=True, read_only=True)
    dish_type = serializers.CharField(source='menu.dish_type',  required=False)




    class Meta:
        model = CartItem
        fields = [ 'id','dish', 'quantity','ingredients','dish_type', 'custom_dish_price']

    def update(self, instance, validated_data):
        new_quantity = validated_data.get('quantity', instance.quantity)
        if new_quantity > 0:
            instance.quantity = new_quantity
            instance.save()
            return instance
        else:
            raise serializers.ValidationError("Количество должно быть больше нуля.")

# Сериализатор для модели Cart
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)  # Вложенный сериализатор для элементов корзины


    class Meta:
        model = Cart
        fields = ['id', 'session_key', 'created_at', 'updated_at', 'items','is_ordered']  # Убедитесь, что поля корректные



# Сериализатор для модели Menu
class MenuSerializer(serializers.ModelSerializer):
    dishes = DishSerializer(many=True,read_only=True)
    class Meta:
        model = Menu
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    cart = CartSerializer()
    items = CartItemSerializer(many=True, source='cart.items')


    class Meta:
        model = Order
        fields = ['id', 'cart', 'status','total_price','items']


