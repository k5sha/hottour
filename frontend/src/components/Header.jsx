import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router'; 
import { LogIn, UserPlus, User, LogOut, Crown, Settings, Ticket } from 'lucide-react';
import axios from 'axios';
import { BACKEND_API } from '../utils/config';
import { AddToken } from '../utils/auth';

const Header = ({ userData, setUserData }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const showNav = location.pathname === '/';

    const handleLogout = async () => {
        try {
            const payload = AddToken({ public_id: userData?.public_id });
            await axios.post(`${BACKEND_API}/api/logout`, payload);
            
            localStorage.removeItem('auth_token');
            setUserData(null);
            
            navigate('/');
            
        } catch (error) {
            console.error('Помилка при виході:', error);
            localStorage.removeItem('auth_token');
            setUserData(null);
        }
    };

    return (
        <header className="w-full bg-indigo-950/90 backdrop-blur-sm sticky top-0 flex p-4 items-center justify-between box-border z-50 border-b border-indigo-800/50">
            <Link to="/" className="logo flex items-center group">
                <img src="img/logo.png" alt="logo" className="font-bold h-8 transition-transform duration-300 group-hover:scale-105" />
            </Link>
            
            {showNav && (
                <nav className="flex items-center">
                    <ul className="flex gap-3 list-none m-0 p-0 items-center">
                        {userData ? (
                            <li className="flex items-center gap-3">
                                {userData.is_admin === 1 ? (
                                    <Link 
                                        to="/admin"
                                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/20"
                                        title="Адміністративна панель"
                                    >
                                        <Settings className="w-4 h-4" />
                                        <span className="hidden sm:inline">Адмін-панель</span>
                                    </Link>
                                ) : (
                                    <Link 
                                        to="/my-bookings"
                                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/20"
                                        title="Мої бронювання"
                                    >
                                        <Ticket className="w-4 h-4" />
                                        <span className="hidden sm:inline">Мої бронювання</span>
                                    </Link>
                                )}
                                
                                <Link to='/profile' className="flex items-center gap-2 text-white bg-indigo-900/50 rounded-xl px-4 py-2 border border-indigo-700/30">
                                    <User className="w-5 h-5 text-indigo-300" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{userData.full_name}</span>
                                        <div className="flex items-center gap-1">
                                            {userData.is_admin === 1 ? (
                                                <Crown className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            ) : null}
                                            <span className="text-xs text-indigo-300/80">
                                                {userData.is_admin === 1 ? 'Адміністратор' : 'Користувач'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-600/20"
                                    title="Вийти з системи"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Вийти</span>
                                </button>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <Link 
                                        to="/login" 
                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-600/20"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        <span>Вхід</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        to="/regist" 
                                        className="flex items-center gap-2 bg-indigo-800 hover:bg-indigo-900 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-800/20"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        <span>Реєстрація</span>
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default Header;