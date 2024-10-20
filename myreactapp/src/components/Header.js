import React, { useState, useEffect } from 'react';
import { Badge, IconButton, Modal, Typography, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';

import axios from 'axios';
import './Header.css';

const Header = ({ cartData, setCartData }) => {
  const [localCartData, setLocalCartData] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [open, setOpen] = useState(false);

  // Обновляем локальное состояние и количество товаров
  useEffect(() => {
    setLocalCartData(cartData);
    const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);
    setCartItemCount(totalItems);
  }, [cartData]);

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/delete_item/${itemId}/`);
      if (response.data.success) {
        setLocalCartData((prevItems) => prevItems.filter((item) => item.id !== itemId));
        setCartData((prevItems) => prevItems.filter((item) => item.id !== itemId));
      }
    } catch (error) {
      console.error('Ошибка при удалении предмета:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <header style={{ padding: '1rem', backgroundColor: '#f8f8f8', display: 'flex', justifyContent: 'space-between' }}>
      <h1>ChikoWorldKitchen</h1>
      <div className="floating-cart">
        <IconButton style={{ position: 'relative' }} onClick={handleOpen}>
          <Badge badgeContent={cartItemCount} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </div>

      {/* Модальное окно */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Ваша корзина</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Корзина внутри модального окна */}
          <ul>
            {localCartData.length === 0 ? (
              <Typography variant="body1">Корзина пуста</Typography>
            ) : (
              localCartData.map((item) => (
                <li key={item.id} style={{ marginBottom: '1rem' }}>
                  <h2>{item.dish.name}</h2>
                  <p>Количество: {item.quantity}</p>
                  <button onClick={() => handleRemoveItem(item.id)}>Удалить</button>
                </li>
              ))
            )}
          </ul>

          <button onClick={handleClose} style={{ marginTop: '1rem' }}>Закрыть</button>
        </Box>
      </Modal>
    </header>
  );
};

export default Header;
