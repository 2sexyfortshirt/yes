# Generated by Django 5.1.1 on 2024-11-05 01:43

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myreactapp', '0018_cartitem_custom_dish_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='cart_item',
            field=models.OneToOneField(default=1, on_delete=django.db.models.deletion.CASCADE, to='myreactapp.cartitem'),
            preserve_default=False,
        ),
    ]