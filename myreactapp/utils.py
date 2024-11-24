from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def send_order_update_to_websocket(order_data):
    """
    Отправляет данные о заказе через WebSocket в группу "orders".
    """
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "orders",  # Название группы
        {
            "type": "send_order_update",
            "data": order_data
        }
    )