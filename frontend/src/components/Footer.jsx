import React from 'react';
import { Phone, Mail, MessageCircle, MapPin, Clock, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 p-10 border-t border-gray-800">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                    <div className="text-xl font-bold text-white mb-6">Контакти</div>
                    <div className="space-y-4">
                        <a href="tel:+380123456789" className="flex items-center gap-3 text-gray-300 hover:text-indigo-400 transition-colors duration-300">
                            <Phone className="w-5 h-5 text-indigo-400" />
                            +38 (012) 345-67-89
                        </a>
                        <a href="mailto:info@wow-travel.com" className="flex items-center gap-3 text-gray-300 hover:text-indigo-400 transition-colors duration-300">
                            <Mail className="w-5 h-5 text-indigo-400" />
                            info@wow-travel.com
                        </a>
                        <a href="https://t.me/wow_travel" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-indigo-400 transition-colors duration-300">
                            <MessageCircle className="w-5 h-5 text-indigo-400" />
                            Telegram
                        </a>
                        <a href="https://wa.me/380123456789" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-indigo-400 transition-colors duration-300">
                            <MessageCircle className="w-5 h-5 text-indigo-400" />
                            WhatsApp
                        </a>
                    </div>
                </div>

                <div>
                    <div className="text-xl font-bold text-white mb-6">Адреса</div>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 text-gray-300">
                            <MapPin className="w-5 h-5 text-green-400 mt-1" />
                            <span>м. Київ,<br />вул. Хрещатик, 25<br />офіс 304</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <Clock className="w-5 h-5 text-yellow-400" />
                            <span>Пн-Пт: 9:00-18:00<br />Сб-Нд: 10:00-16:00</span>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="text-xl font-bold text-white mb-6">Послуги</div>
                    <div className="space-y-3">
                        <a href="#" className="block text-gray-300 hover:text-indigo-400 transition-colors duration-300">Готелі та курорти</a>
                        <a href="#" className="block text-gray-300 hover:text-indigo-400 transition-colors duration-300">Екскурсії та тури</a>
                        <a href="#" className="block text-gray-300 hover:text-indigo-400 transition-colors duration-300">Авіаквитки</a>
                        <a href="#" className="block text-gray-300 hover:text-indigo-400 transition-colors duration-300">Візи та страхування</a>
                        <a href="#" className="block text-gray-300 hover:text-indigo-400 transition-colors duration-300">Групові тури</a>
                    </div>
                </div>

                <div>
                    <div className="text-xl font-bold text-white mb-6">Слідкуйте за нами</div>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-indigo-600 transition-colors duration-300">
                                <span className="text-white">FB</span>
                            </a>
                            <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-pink-600 transition-colors duration-300">
                                <span className="text-white">IG</span>
                            </a>
                            <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-blue-400 transition-colors duration-300">
                                <span className="text-white">TW</span>
                            </a>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                            <span>Подорожуйте з любов'ю</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-800">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} Турагенство "Вау". Всі права захищені.
                    </div>
                    <div className="flex gap-6 text-sm text-gray-400">
                        <a href="#" className="hover:text-indigo-400 transition-colors duration-300">Політика конфіденційності</a>
                        <a href="#" className="hover:text-indigo-400 transition-colors duration-300">Умови використання</a>
                        <a href="#" className="hover:text-indigo-400 transition-colors duration-300">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;