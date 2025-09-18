import React from 'react';
import { Link, useLocation } from 'react-router';
import { LogIn, UserPlus } from 'lucide-react';

const Header = () => {
    const location = useLocation();
    const showNav = location.pathname === '/';

    return (
        <header className="w-full bg-gray-900 sticky top-0 flex p-4 items-center justify-between box-border z-50 border-b border-gray-800">
            <Link to="/" className="logo flex items-center">
                <img src="img/logo.png" alt="logo" className="font-bold h-7" />
            </Link>
            
            {showNav && (
                <nav className="flex items-center">
                    <ul className="flex gap-4 list-none m-0 p-0">
                        <li>
                            <Link 
                                to="/login" 
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-300"
                            >
                                <LogIn className="w-4 h-4" />
                                Вхід
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/regist" 
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-300"
                            >
                                <UserPlus className="w-4 h-4" />
                                Реєстрація
                            </Link>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default Header;