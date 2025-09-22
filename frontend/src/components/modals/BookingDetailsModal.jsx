import React from 'react';
import { X, User, Mail, Phone, Calendar, MapPin, Users, Home, Globe } from 'lucide-react';

const BookingDetailsModal = ({ 
    isOpen, 
    onClose, 
    booking, 
    user, 
    bookingType, 
    isLoading, 
    getHotelName, 
    getTourName, 
    formatDateTime, 
    formatBirthDate 
}) => {
    if (!isOpen || !booking) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h3 className="text-2xl font-semibold">Деталі бронювання</h3>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            {bookingType === 'hotels' ? <Home className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                            Інформація про бронювання
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-400 text-sm">ID бронювання</p>
                                <p className="font-mono">{booking.public_id}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">{bookingType === 'hotels' ? 'Готель' : 'Тур'}</p>
                                <p className="font-semibold">
                                    {bookingType === 'hotels' 
                                        ? getHotelName(booking.hotel_id)
                                        : getTourName(booking.tour_id)
                                    }
                                </p>
                            </div>
                            {bookingType === 'hotels' ? (
                                <>
                                    <div>
                                        <p className="text-gray-400 text-sm">Заїзд</p>
                                        <p>{formatDateTime(booking.from_date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Виїзд</p>
                                        <p>{formatDateTime(booking.to_date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Тривалість</p>
                                        <p>
                                            {booking.from_date && booking.to_date ? 
                                                `${Math.ceil((new Date(booking.to_date) - new Date(booking.from_date)) / (1000 * 60 * 60 * 24))} днів` 
                                                : '-'
                                            }
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <p className="text-gray-400 text-sm">Кількість учасників</p>
                                    <p className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        {booking.number_of_people}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Інформація про користувача
                        </h4>
                        {isLoading ? (
                            <div className="text-center py-4">
                                <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                                <p className="mt-2">Завантаження даних користувача...</p>
                            </div>
                        ) : user ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm">ID користувача</p>
                                    <p className="font-mono">{user.public_id}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Повне ім'я</p>
                                    <p className="font-semibold">{user.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Email</p>
                                    <p className="flex items-center gap-1">
                                        <Mail className="w-4 h-4" />
                                        {user.email}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Телефон</p>
                                    <p className="flex items-center gap-1">
                                        <Phone className="w-4 h-4" />
                                        {user.phone}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Стать</p>
                                    <p>{user.sex === 'male' ? 'Чоловік' : 'Жінка'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Дата народження</p>
                                    <p className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {formatBirthDate(user.birth_date)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Дата реєстрації</p>
                                    <p>{formatDateTime(user.join_date)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Роль</p>
                                    <p className={`px-2 py-1 rounded-full text-xs font-semibold ${user.is_admin ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                        {user.is_admin ? 'Адміністратор' : 'Користувач'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-4">Не вдалося завантажити дані користувача</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end p-6 border-t border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-2xl font-semibold transition-colors"
                    >
                        Закрити
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsModal;