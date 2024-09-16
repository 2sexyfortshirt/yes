from django.contrib import admin
from .models import Menu, Dish, Cart,CartItem

# Register your models here.
@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ('dish_type',)  # Поля, отображаемые в списке

@admin.register(Dish)
class DishAdmin(admin.ModelAdmin):
    list_display = ('name', 'menu', 'price')  # Поля, отображаемые в списке
    list_filter = ('menu',)  # Фильтрация по меню
    search_fields = ('name',)  #
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ( 'session_key', 'created_at', 'updated_at')
@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'dish', 'quantity')