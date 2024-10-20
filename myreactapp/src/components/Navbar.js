import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import './Navbar.css';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMobile = useMediaQuery('(max-width:768px)'); // Медиа-запрос для мобильных устройств

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="primary" sx={{ backgroundColor: 'grey' }}>
      <Toolbar>
        {/* Иконка меню только на мобильных устройствах */}
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuClick}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose} component={Link} to="/">Home</MenuItem>
              <MenuItem onClick={handleClose} component={Link} to="/menu">Menu</MenuItem>
              <MenuItem onClick={handleClose} component={Link} to="/about">About</MenuItem>
              <MenuItem onClick={handleClose} component={Link} to="/contact">Contact</MenuItem>
              <MenuItem onClick={handleClose} component={Link} to="/cart">Cart</MenuItem>
            </Menu>
          </>
        ) : (
          // Ссылки отображаются на больших экранах
          <>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1,color: 'orange' }} >
              ChikoWorldKitchen
            </Typography>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/menu">Menu</Button>
            <Button color="inherit" component={Link} to="/about">About</Button>
            <Button color="inherit" component={Link} to="/contact">Contact</Button>

          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
