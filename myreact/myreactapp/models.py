from django.db import models


# Create your models here.





class Menu(models.Model):
    dish_type = models.CharField(max_length=100)
    def __str__(self):
        return self.dish_type

class Ingredients(models.Model):

    name = models.CharField(max_length=100)
    extra_cost = models.DecimalField(max_digits=10 , decimal_places=2, default=0.00)

    def __str__(self):
        return self.name





class Dish(models.Model):
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE,related_name='dishes')
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    ingredients = models.ManyToManyField(Ingredients,blank=True)
    picture = models.CharField(max_length=255, default='http://example.com/default-image.jpg')

    def __str__(self):
        return self.name



class Cart(models.Model):
    """user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  """# Может быть анонимным
    session_key = models.CharField(max_length=40, blank=True, null=True)  # Для анонимных пользователей
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_ordered = models.BooleanField(default=False)
    def __str__(self):
        return f"Cart {self.id} (Session: {self.session_key})"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish, related_name='cart_items', on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    ingredients = models.ManyToManyField(Ingredients, blank=True)



    def __str__(self):
        # Обработка случая, когда dish может быть None
        if self.dish and self.dish.name:
            return self.dish.name
        return "No dish"  # Или любое другое значение, чтобы избежать ошибки


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('canceled', 'Canceled'),
    ]

    cart = models.OneToOneField(Cart, on_delete=models.CASCADE)  # Связь с корзиной
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    phone_number = models.CharField(max_length=15,blank=True)
    delivery_address = models.CharField(max_length=255,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} for cart {self.cart.id}"

