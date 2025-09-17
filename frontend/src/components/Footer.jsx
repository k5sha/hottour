import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div>
                <div className="footer-title">Контакти</div>
                <div className="footer-links">
                    <a href="tel:+380123456789">
                        <span className="material-symbols-outlined">phone_in_talk</span>
                        +380123456789
                    </a>
                    <a href="mailto:email@email.com">
                        <span className="material-symbols-outlined">alternate_email</span>
                        email@email.com
                    </a>
                    <a href="https://t.me/telegram" target="_blank" rel="noopener noreferrer">
                        <span className="material-symbols-outlined">chat</span>
                        Telegram
                    </a>
                    <a href="https://wa.me/380123456789" target="_blank" rel="noopener noreferrer">
                        <span className="material-symbols-outlined">chat</span>
                        WhatsApp
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;