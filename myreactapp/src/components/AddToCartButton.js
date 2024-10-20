import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
axios.defaults.withCredentials = true;

const AddToCartButton = ({ dishId,selectedIngredients,updateCart }) => {
  const navigate = useNavigate();
  const [cartMessage, setCartMessage] = React.useState('');

  const handleAddToCart = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/cart/', {
        dish_id: dishId,
        quantity: 1,
        ingredients: selectedIngredients,
      });
      updateCart(response.data.cart_item);
      setCartMessage('Блюдо добавлено в корзину!');
      navigate('/cart');  // Перенаправление на страницу корзины
    } catch (error) {
      console.error('Ошибка при добавлении блюда в корзину:', error);
      setCartMessage('Ошибка при добавлении блюда в корзину!');
    }
  };

  return (
    <div>
      <button onClick={handleAddToCart}>Добавить в корзину</button>
      {cartMessage && <p>{cartMessage}</p>}
    </div>
  );
};

export default AddToCartButton;
