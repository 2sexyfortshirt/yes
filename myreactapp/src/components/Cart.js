import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Cart.css'; // Импорт стилей
import {Typography,Button} from '@mui/material';




axios.defaults.withCredentials = true;

const Cart = ({ cartData, setCartData}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);


  const [orderMessage, setOrderMessage] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);

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


    const handleSelectIngredient = (itemId) => {
    const selectedItem = cartData.find(item => item.id === itemId);
    // Проверка, является ли выбранный элемент бургером или пиццей
    if (selectedItem.dish_type === 'Burgers' || selectedItem.dish_type === 'Pizza') {
      setSelectedItemId(itemId);
      setIsModalOpen(true);
    } else {
      alert('Ингредиенты могут быть выбраны только для бургеров и пиццы');
    }
  };

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

    const handleSelectIngredients = (itemId, ingredients) => {
    setSelectedIngredients((prevIngredients) => ({
      ...prevIngredients,
      [itemId]: ingredients,
    }));
    setIsModalOpen(false);
  };


  useEffect(() => {
    fetchCartItems();
     fetchMenuData();
  }, []); // Вызываем fetchCartItems при изменении updateFlag


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
      setCartData((prevItems) => {
        const updatedItems = prevItems.filter((item) => item.id !== itemId);
        // Корзина не должна быть пустой, если остались другие блюда
        return updatedItems;
      });
    }
  } catch (error) {
    console.error("Ошибка при удалении предмета:", error);
  }
};

const handleRemoveIngredient = async (ingredientId) => {
  try {
    const response = await axios.delete(`http://localhost:8000/api/remove_ingredient/${ingredientId}/`);
    if (response.data.success) {
      setCartData((prevItems) => {
        const updatedItems = prevItems.map(item => {
          const updatedIngredients = item.ingredients.filter(ingredient => ingredient.id !== ingredientId);

          // Если все ингредиенты кастомного блюда удалены, мы проверяем, есть ли еще обычные блюда в корзине
          if (updatedIngredients.length === 0 && item.dish_type) {
            return null; // Удаляем кастомное блюдо, если не осталось ингредиентов
          }

          return { ...item, ingredients: updatedIngredients }; // Возвращаем обновленное блюдо
        }).filter(item => item !== null); // Удаляем кастомные блюда, если у них нет ингредиентов

        // Если корзина теперь пуста (не осталось обычных или кастомных блюд), вы можете выполнить дополнительные действия
        if (updatedItems.length === 0) {
          console.log("Корзина пуста");
        }

        return updatedItems; // Возвращаем обновленное состояние корзины
      });
    } else {
      console.error(response.data.message);
    }
  } catch (error) {
    console.error("Ошибка при удалении ингредиента:", error);
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
      const openModal = () => setIsModalOpen(true);
       const handleCloseModal = () => setIsModalOpen(false);


    const uniqueDishTypes = Array.from(new Set(menuData.map(item => item.dish_type)));

 return (
    <>
      {cartData.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h5>Корзина пуста</h5>
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              marginTop: '1rem',
            }}
            onClick={() => navigate('/menu')}
          >
            Вернуться к меню
          </button>
        </div>
      ) : (
        <div className="cart-container" style={{ marginTop: '50px' }}>
          <h1>Корзина</h1>
          <ul>
            {cartData.map((item, index) => (
              <li key={item.id || index}>
                <pre>{JSON.stringify(item, null, 2)}</pre> {/* Отображение данных элемента */}
                {item.dish ? (
                  <>
                    <h2>{item.dish_type}</h2>
                    <p>Название: {item.dish?.name || "Нет названия"}</p>
                    <p>Количество: {item.quantity}</p>
                    {item.ingredients && item.ingredients.length > 0 ? (
                      <div>
                        <h4>Ингредиенты:</h4>
                        <ul>
                          {item.ingredients.map((ingredient) => (
                            <li key={ingredient.id}>
                              {ingredient.name} (доп. цена: {ingredient.extra_cost})
                               <button
                    onClick={() => handleRemoveIngredient( ingredient.id)}
                    style={{ marginLeft: '10px', color: 'red' }}
                  >
                    Удалить
                  </button>

                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                       <div>
            <p>Ингредиенты не выбраны</p>

          </div>

                    )}
                    <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                    <button onClick={() => handleRemoveItem(item.id)}>Удалить</button>
                  </>
                ) : (
                  <>
                   <h2>{item.dish_type }</h2> {/* Здесь выводим кастомный dish_type */}

                    {item.ingredients && item.ingredients.length > 0 ? (
                      <div>
                        <h4>Ингредиенты:</h4>
                        <ul>
                          {item.ingredients.map((ingredient) => (
                            <li key={ingredient.id}>
                              {ingredient.name} (доп. цена: {ingredient.extra_cost})
                               <button
                    onClick={() => handleRemoveIngredient(ingredient.id)}
                    style={{ marginLeft: '10px', color: 'red' }}
                  >
                    Удалить
                  </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                            <div>
    <p>Ингредиенты не выбраны</p>

  </div>


                    )}
                    <button onClick={() => handleRemoveItem(item.id)}>Удалить</button>
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
      )}
    </>
  );
};

export default Cart;