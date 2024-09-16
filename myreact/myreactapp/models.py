from django.db import models


# Create your models here.





class Menu(models.Model):
    dish_type = models.CharField(max_length=100)
    def __str__(self):
        return self.dish_type



class Dish(models.Model):
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE,related_name='dishes')
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name


class Cart(models.Model):
    """user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  """# Может быть анонимным
    session_key = models.CharField(max_length=40, blank=True, null=True)  # Для анонимных пользователей
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart {self.id} (Session: {self.session_key})"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish, related_name='cart_items', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)


    def __str__(self):
        return f"{self.dish.name} in cart {self.cart}"
