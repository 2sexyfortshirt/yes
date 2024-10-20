import React from 'react';
import { Typography, Button } from '@mui/material';
import './About.css';
const About = () => {
  return (
    <div className="about-container">
      <Typography variant="h4" align="center" sx={{ margin: '20px 0' }}>
        About Us
      </Typography>
      <Typography variant="body1" sx={{ margin: '20px' }}>
        Welcome to ChikoWorldKitchen! Founded in [Year], we strive to bring the best culinary experience to our customers.
        Our mission is to provide delicious food using the freshest ingredients while ensuring excellent service.
      </Typography>

      <Typography variant="h6" align="center" sx={{ margin: '20px 0' }}>
        Meet Our Team
      </Typography>
      <Typography variant="body1" sx={{ margin: '20px' }}>
        Our chef, [Chef's Name], has over [X years] of experience in the culinary world and is passionate about creating
        mouthwatering dishes that our guests love.
      </Typography>

      <Typography variant="h6" align="center" sx={{ margin: '20px 0' }}>
        Our Menu
      </Typography>
      <Typography variant="body1" sx={{ margin: '20px' }}>
        Check out our menu to explore our variety of delicious dishes, including [mention a few dishes].
      </Typography>

      <div className="about-buttons" style={{ textAlign: 'center', margin: '20px' }}>
        <Button variant="contained" color="primary" href="/menu">
          View Menu
        </Button>
        <Button variant="outlined" color="secondary" href="/contact" style={{ marginLeft: '10px' }}>
          Contact Us
        </Button>
      </div>

      <Typography variant="h6" align="center" sx={{ margin: '20px 0' }}>
        Find Us
      </Typography>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <iframe
          title="Location Map"
          src="https://www.google.com/maps/embed?pb=...your-map-url..."
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

export default About;



