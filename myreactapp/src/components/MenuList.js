import React, { useEffect, useState } from 'react';
import AddToCartButton from './AddToCartButton';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MenuStyles.css';
import {
  Container,
  Modal,
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
  Typography,
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
        console.error('Error loading menu:', error);
      }
    };

    const fetchIngredients = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/ingredients/');
        setIngredients(response.data);
      } catch (error) {
        console.error('Error loading ingredients:', error);
      }
    };

    fetchMenuData();
    fetchIngredients();
    updateCart();
  }, []);

  const updateCart = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/get/');
      setCartItems(response.data.cart_items);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleMenuClick = (menuId) => {
    setSelectedMenuId((prev) => (prev === menuId ? null : menuId));
  };

  const handleIngredientChange = (ingredientId) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const handleCreateCustomDish = async () => {
    if (selectedIngredients.length === 0) {
      alert('Please select at least one ingredient!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/cart/add_custom_dish/', {
        ingredients: selectedIngredients,
        menu_id: selectedMenuId,
      });

      if (response.status === 201) {
        updateCart();
        navigate('/cart');
      }
    } catch (error) {
      console.error('Error creating custom dish:', error);
    } finally {
      setSelectedIngredients([]);
      handleCloseDialog();
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedIngredients([]);
  };

  return (
    <Container maxWidth="md" className="menu-container" style={{ marginTop: '7rem', maxWidth: '1200px' }}>
      <List component="nav">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {menuData.map((menu) => (
            <Box
              key={menu.id}
              onClick={() => handleMenuClick(menu.id)}
              sx={{
                padding: '1rem',
                backgroundColor: '#f57c00',
                borderRadius: '10px',
                color: 'white',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                '&:hover': { backgroundColor: '#ff9800', boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)' },
              }}
            >
              <RestaurantIcon fontSize="large" />
              <Typography variant="h6">{menu.dish_type}</Typography>
              {selectedMenuId === menu.id ? <ExpandLess /> : <ExpandMore />}
            </Box>
          ))}
        </Box>

        {menuData.map((menu) =>
          selectedMenuId === menu.id ? (
            <Collapse key={menu.id} in={selectedMenuId === menu.id}>
              <Grid container spacing={2}>
                {menu.dishes.map((dish) => (
                  <Grid item xs={12} sm={6} md={4} key={dish.id}>
                    <Card sx={{ borderRadius: '12px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
                      <CardContent>
                        <Typography variant="h6">{dish.name}</Typography>
                        <img
                          src={`http://localhost:8000/${dish.picture}`}
                          alt={dish.name}
                          style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '8px',
                            marginBottom: '0.5rem',
                          }}
                        />
                        <Typography variant="body2">{dish.description}</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          Price: ${dish.price}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <AddToCartButton dishId={dish.id} updateCart={updateCart} />
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Collapse>
          ) : null
        )}
      </List>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Select Ingredients</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            {ingredients.map((ingredient) => (
              <Grid item xs={6} sm={4} key={ingredient.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedIngredients.includes(ingredient.id)}
                      onChange={() => handleIngredientChange(ingredient.id)}
                    />
                  }
                  label={ingredient.name}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleCreateCustomDish} variant="contained" color="primary">
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MenuList;
