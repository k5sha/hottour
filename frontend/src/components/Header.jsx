import React from 'react';
import { Link, useLocation } from 'react-router';

const Header = () => {
    const location = useLocation();
    const showNav = location.pathname === '/';

    return (
        <header>
            <Link to="/" className="logo">
                <img src="img/logo.png" alt="logo" />
            </Link>
            {showNav && (
                <nav>
                    <ul>
                        <li><Link to="/login">Вхід</Link></li>
                        <li><Link to="/regist">Реєстрація</Link></li>
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default Header;