import React from 'react';
import { Typography, Button } from '@mui/material'; // Import Button from MUI
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Slider from "react-slick"; // Import Slider
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ShoppingCart } from '@mui/icons-material';
const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
};

// Images for the slider
const images = [
    { id: 1, src: '/images/image1.jpg', alt: 'Dish 1' },
    { id: 2, src: '/images/image2.jpeg', alt: 'Dish 2' },
    { id: 3, src: '/images/image3.jpg', alt: 'Dish 3' },
    { id: 4, src: '', alt: 'Dish 4'},
    // Add more images if needed
];


const Home = () => {
    return (
        <div>
            <Typography variant="h2" align="center"  sx={{
                    padding: '20px',
                    wordBreak: 'break-word', // Добавлено свойство
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, // Адаптивный размер шрифта
                }}>
                Welcome to ChikoWorldKitchen
            </Typography>
            <Typography variant="h5" align="center" sx={{ marginBottom: '40px' }}>
                Fresh, Delicious, Delivered to Your Door
            </Typography>

            {/* Call to Action Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button
    variant="outlined"

    sx={{
        borderColor: '#ff5722', // Цвет рамки
        color: '#ff5722', // Цвет текста
        padding: '10px 20px',
        borderRadius: '8px',

        '&:hover': {
            backgroundColor: '#ff5722',
            color: '#fff',
        },
    }}
    component={Link}
    to="/menu"
>
    <ShoppingCart sx={{ marginRight: '8px' }} /> {/* Иконка перед текстом */}
    <Typography variant="button">Order Now</Typography>
</Button>
</div>
              {/* Slider Section */}
            <div style={{ margin: '40px 0' }}>
                <Slider {...settings}>
                    {images.map(image => (
                        <div key={image.id}>
                            <img src={image.src} alt={image.alt} style={{ width: '100%' }} />
                        </div>
                    ))}
                </Slider>
            </div>

            {/* Map Section */}
            <Typography variant="h5" align="center" sx={{ marginTop: '50px' }}>
                Find Us
            </Typography>
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <iframe
                    title="Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3200.8044321523753!2d31.67192437554203!3d36.655155175862916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14dcade6fff64a69%3A0x4df6004946205b1e!2sChiko%20World%20Kitchen!5e0!3m2!1sru!2str!4v1695163685907!5m2!1sru!2str"
                    width="600"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>
        </div>
    );
};

export default Home;
