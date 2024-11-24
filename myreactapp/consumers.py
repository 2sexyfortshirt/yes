from channels.generic.websocket import AsyncWebsocketConsumer
import json

class OrderConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "orders"

        # Присоединиться к группе
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Отключиться от группы
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        # Передача данных в группу
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "order_message",
                "order": data["order"],
            }
        )

    async def order_message(self, event):
        # Отправка данных клиенту
        await self.send(text_data=json.dumps({
            "order": event["order"]
        }))
