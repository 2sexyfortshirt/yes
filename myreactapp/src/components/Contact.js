import React from 'react';
import './Contact.css';
const Contact = () => {
    return (
        <div className="contact-container">
            <h4>Связаться с нами</h4>
            <p>Вы можете найти нас в следующих социальных сетях:</p>
            <div className="social-links">
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                    <img src="/path-to-facebook-icon.png" alt="Facebook" />
                </a>
                <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
                    <img src="/path-to-whatsapp-icon.png" alt="WhatsApp" />
                </a>
                <a href="https://www.instagram.com/yourpage" target="_blank" rel="noopener noreferrer">
                    <img src="/path-to-instagram-icon.png" alt="Instagram" />
                </a>
            </div>
        </div>
    );
};

export default Contact;