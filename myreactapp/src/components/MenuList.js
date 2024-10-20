import React, { useEffect, useState } from 'react';
import AddToCartButton from './AddToCartButton';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MenuStyles.css';
import {
  Container,
  Typography,
  List,
  Collapse,
  Grid,
  Card,
  CardContent,
  CardActions,
  Checkbox,
  FormControlLabel,
  Box,
  Button,
   Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

axios.defaults.withCredentials = true;

const MenuList = () => {
  const [menuData, setMenuData] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
   const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/menu/');
        setMenuData(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке меню:", error);
      }
    };

    const fetchIngredients = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/ingredients/');
        setIngredients(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке ингредиентов:", error);
      }
    };

    fetchMenuData();
    fetchIngredients();
    updateCart();
  }, []);

  const handleMenuClick = (menuId) => {
    setSelectedMenuId(prev => (prev === menuId ? null : menuId));
  };

  const updateCart = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/get/');
      setCartItems(response.data.cart_items);
    } catch (error) {
      console.error('Ошибка при обновлении корзины:', error);
    }
  };

  const handleIngredientChange = (ingredientId) => {
    setSelectedIngredients((prev) => {
      if (prev.includes(ingredientId)) {
        return prev.filter(id => id !== ingredientId);
      } else {
        return [...prev, ingredientId];
      }
    });
  };
 const ingredientAllowedMenus = {
      3: { allowed: true, label: "Создать свою пиццу" },  // Пицца
    2: { allowed: true, label: "Создать свой бургер" },  // Бургер
};

  const isIngredientSelectionAllowed = (menuId) => {
     return ingredientAllowedMenus[menuId]?.allowed;
  };
  const getIngredientButtonLabel = (menuId) => {
  return ingredientAllowedMenus[menuId]?.label;  // Возвращаем название кнопки
};
   const handleCreateCustomBurger = async () => {
    if (selectedIngredients.length === 0) {
      alert("Пожалуйста, выберите хотя бы один ингредиент!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/cart/add_custom_burger/', {
        ingredients: selectedIngredients,
      });

      if (response.status === 201) {

        updateCart(); // обновляем содержимое корзины
        navigate('/cart');
      }
    } catch (error) {
      console.error("Ошибка при создании кастомного бургера:", error);
      alert("Произошла ошибка при добавлении кастомного бургера в корзину.");
    } finally {
      setSelectedIngredients([]); // Сброс выбранных ингредиентов после добавления
      handleCloseDialog(); // Закрываем диалог
    }
  };

 const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
     setSelectedIngredients([])
  };




  return (
    <Container maxWidth="md" className="menu-container" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom align="center">
        Menu List
      </Typography>
      <List component="nav">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(5, 1fr)',
            },
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {menuData.map(menu => (
            <div key={menu.id}>
              <Box
                onClick={() => handleMenuClick(menu.id)}
                sx={{

                  width: '100%',
                  height: '100px',
                  backgroundColor: 'orange',
                  border: '2px solid #388e3c',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#ffffff',
                  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    backgroundColor: '#66bb6a',
                    transform: 'scale(1.05)',
                    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                <RestaurantIcon sx={{ marginRight: 1 }} />
                <Typography variant="h6" align="center">
                  {menu.dish_type}
                </Typography>
                {selectedMenuId === menu.id ? <ExpandLess /> : <ExpandMore />}
              </Box>

              <Collapse in={selectedMenuId === menu.id} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <Grid container spacing={2} style={{ padding: '1rem' }}>
                    {menu.dishes.map(dish => (
                      <Grid item xs={12} key={dish.id}>
                        <Card className="menu-card" style={{ width: '100%', marginBottom: '1rem' }}>
                          <CardContent className="menu-card">
                            <Typography variant="h6" component="div">
                              {dish.name}
                            </Typography>
                             <img src={`http://localhost:8000/${dish.picture}`} alt={dish.name} style={{ width: '100%', height: 'auto' }} />
                            <Typography variant="body2" color="text.secondary">
                              {dish.description}
                            </Typography>
                            <Typography variant="subtitle1" color="text.primary">
                              Цена: ${dish.price}
                            </Typography>



                          </CardContent>
                          <CardActions>
                            <AddToCartButton
                              dishId={dish.id}
                              selectedIngredients={selectedIngredients}
                              updateCart={updateCart}
                            />
                          </CardActions>
                        </Card>
                      </Grid>


                    ))}
                  </Grid>
                  {/* Кнопка для создания кастомного бургера */}
                  {isIngredientSelectionAllowed(menu.id) && (
                    <Box  textAlign="center" marginTop="1rem">
                      <Button
      variant="contained"
      color="primary"
      onClick={handleOpenDialog}
    >
      {getIngredientButtonLabel(menu.id)} {/* Название кнопки */}
       </Button>

                    </Box>
                  )}

                </List>
              </Collapse>
            </div>
          ))}

        </Box>
      </List>
         {/* Модальное окно для выбора ингредиентов */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Выберите ингредиенты</DialogTitle>
        <DialogContent>
          {ingredients.map(ingredient => (
            <FormControlLabel
              key={ingredient.id}
              control={
                <Checkbox
                  checked={selectedIngredients.includes(ingredient.id)}
                  onChange={() => handleIngredientChange(ingredient.id)}
                />
              }
              label={ingredient.name}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Отмена</Button>
          <Button onClick={handleCreateCustomBurger} color="primary">
          {getIngredientButtonLabel(selectedMenuId)} {/* Название действия */}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MenuList;
