import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Cart.css'; // Импорт стилей
import {Typography,Button} from '@mui/material';


axios.defaults.withCredentials = true;

const Cart = ({ cartData, setCartData}) => {
  const [updateFlag, setUpdateFlag] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [phone, setPhone] = useState('');
  const [menuData, setMenuData] = useState([]);
   const [selectedDishType, setSelectedDishType] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/get/');
      console.log('Ответ от сервера (cart items):', response.data);
      setCartData(response.data.cart_items);
    } catch (error) {
      console.error("Ошибка при загрузке данных корзины:", error);
    }
  };


   const fetchMenuData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/menu/');
        setMenuData(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке меню:", error);
      }
}
  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      if (newQuantity > 0) {
        const response = await axios.put(`http://localhost:8000/api/update_cart_item/${itemId}/`, { quantity: newQuantity });
        console.log('Ответ от сервера:', response.data);
        fetchCartItems();
      } else {
        console.error('Количество не может быть меньше 1');
      }
    } catch (error) {
      console.error('Ошибка при изменении количества товара:', error);
      console.log('itemId:', itemId);
    }
  };

  const handleAddToCartButton = async (dishId) => {
    try {
      console.log('Выбранные ингредиенты:', selectedIngredients);
      await axios.post('http://localhost:8000/api/cart/', {
        dish_id: dishId,
        ingredients: selectedIngredients,
      });
      fetchCartItems();
    } catch (error) {
      console.error('Ошибка при добавлении блюда в корзину:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
     fetchMenuData();
  }, []); // Вызываем fetchCartItems при изменении updateFlag

  if (cartData.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Typography variant="h5">Корзина пуста</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/menu')} // Переход к странице меню
          style={{ marginTop: '1rem' }}
        >
          Вернуться к меню
        </Button>
      </div>
    );
  }
  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleAddressChange = (event) => {
    setDeliveryAddress(event.target.value);
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/delete_item/${itemId}/`);
      if (response.data.success) {
        setCartData((prevItems) => prevItems.filter((item) => item.id !== itemId));
      }
    } catch (error) {
      console.error("Ошибка при удалении предмета:", error);
    }
  };
  const handleRemoveIngredient = async (ingredientId) => {
  try {
    const response = await axios.delete(`http://localhost:8000/api/remove_ingredient/${ingredientId}/`);
    if (response.data.success) {
      // Обновляем данные корзины, удаляя выбранный ингредиент
      setCartData(prevItems =>
        prevItems.map(item => {
          const updatedIngredients = item.ingredients.filter(ingredient => ingredient.id !== ingredientId);
          return { ...item, ingredients: updatedIngredients };
        })
      );
    } else {
      console.error(response.data.message);
    }
  } catch (error) {
    console.error('Ошибка при удалении ингредиента:', error);
  }
};


  const handleOrder = async () => {
  if (!phone || !deliveryAddress) {
      setOrderMessage('Введите номер телефона и адрес доставки!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/create_order/', {
        cart_id: cartData[0].cart_id,
        phone_number: phone,
        delivery_address: deliveryAddress,
      });

      if (response.data && response.data.success) {
        setOrderMessage('Ваш заказ успешно оформлен!');
        setOrderDetails(response.data.order);

        setTimeout(() => {
         setCartData([]);



          navigate('/');
        }, 3000);
      } else {
        setOrderMessage('Произошла ошибка при оформлении заказа.');
      }
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      setOrderMessage('Не удалось оформить заказ. Попробуйте снова.');
    }
  };

    const uniqueDishTypes = Array.from(new Set(menuData.map(item => item.dish_type)));

 return (
  <div className="cart-container" style={{ marginTop: '50px' }}>
    <h1>Корзина</h1>
    <ul>
      {cartData.map((item, index) => (
        <li key={item.id || index}>
          {item.dish ? (
            <>
              <h2>{item.dish.name}</h2>
              <p>Описание: {item.dish.description}</p>
              <p>Количество: {item.quantity}</p>

              {item.ingredients && item.ingredients.length > 0 ? (
                <div>
                  <h4>Ингредиенты:</h4>
                  <ul>
                    {item.ingredients.map((ingredient) => (
                      <li key={ingredient.id}>
                        {ingredient.name} (доп. цена: {ingredient.extra_cost})
                        <button onClick={() => handleRemoveIngredient(ingredient.id)}>Удалить ингредиент</button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>Ингредиенты не выбраны</p>
              )}

              <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => handleRemoveItem(item.id)}>Удалить</button>
            </>
          ) : (
            <>
              <p>Информация о блюде отсутствует</p>

              {item.ingredients && item.ingredients.length > 0 ? (
                <div>
                  <h4>Ингредиенты:</h4>
                  <ul>
                    {item.ingredients.map((ingredient) => (
                      <li key={ingredient.id}>
                        {ingredient.name} (доп. цена: {ingredient.extra_cost})
                        <button onClick={() => handleRemoveIngredient(ingredient.id)}>Удалить ингредиент</button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>Ингредиенты не выбраны</p>
              )}
              {/* Убираем кнопку удаления предмета, если dish равен null */}
            </>
          )}
        </li>
      ))}
    </ul>

    <div className="phone-form">
      <label>Ваш номер телефона:</label>
      <input
        type="tel"
        value={phone}
        onChange={handlePhoneChange}
        placeholder="+7 123 456 7890"
        required
      />
      <label>Адрес для доставки:</label>
      <input
        type="text"
        value={deliveryAddress}
        onChange={handleAddressChange}
      />
    </div>
    {cartData.length > 0 && (
      <button onClick={handleOrder} className="order-button">
        Оформить заказ
      </button>
    )}
    {orderMessage && <p>{orderMessage}</p>}
    {orderDetails && (
      <div className="order-confirmation">
        <h2>Ваш заказ подтвержден!</h2>
        <p>Номер заказа: {orderDetails.id}</p>
        <p>Общая сумма: {orderDetails.total_price} usd</p>
      </div>
    )}
  </div>
);

};

export default Cart;
