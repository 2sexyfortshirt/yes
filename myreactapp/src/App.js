import React, { useState } from 'react';  // Удаляем лишний импорт React
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import MenuList from './components/MenuList';
import About from './components/About';
import Contact from './components/Contact';
import Cart from './components/Cart';
import Header from './components/Header';

const App = () => {
  const [cartData, setCartData] = useState([]);



  return (
    <Router>
      {/* Шапка сайта с корзиной */}

      <Header cartData={cartData} setCartData={setCartData} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuList />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
 <Route path="/cart" element={<Cart cartData={cartData} setCartData={setCartData} />} /> {/* Обновленная передача */}
      </Routes>

    </Router>


  );
};



export default App;
