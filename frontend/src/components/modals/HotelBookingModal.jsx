import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { AddToken } from '../../utils/auth';
import { BACKEND_API } from '../../utils/config';
import toast from 'react-hot-toast';

const HotelBookingModal = ({ hotel, isOpen, onClose, userData }) => {
  const getFormattedDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  const [formData, setFormData] = useState({
    checkIn: getFormattedDate(tomorrow),
    checkOut: getFormattedDate(dayAfterTomorrow),
    guests: 1
  });

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  const bookingMutation = useMutation({
    mutationFn: (bookingData) => {
      bookingData = AddToken(bookingData)
      return axios.post(`${BACKEND_API}/api/booking/hotel`, bookingData);
    },
    onSuccess: () => {
      toast.success('Бронювання успішне! 🎉');
      onClose();
    },
    onError: (error) => {
      console.error('Помилка бронювання:', error);
      const errorMessage = error.response?.data?.message || 'Сталася помилка при бронюванні. Спробуйте ще раз.';
      toast.error(errorMessage);
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const today = new Date();
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    
    if (checkInDate < today || checkOutDate < today) {
      toast.error('Дата не може бути раніше за сьогодні');
      return;
    }
    
    if (checkOutDate <= checkInDate) {
      toast.error('Дата виїзду повинна бути пізніше за дату заїзду');
      return;
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    const bookingData = {
      hotel_id: hotel.public_id || hotel.id,
      from_date: formData.checkIn,
      to_date: formData.checkOut,
      guests: formData.guests,
      user_id: userData.public_id,
      total_price: formatPrice(hotel.price * nights)
    };
    
    bookingMutation.mutate(bookingData);
  };

  const calculateTotal = () => {
    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      
      if (checkOutDate <= checkInDate) {
        return {
          nights: 1,
          total: formatPrice(hotel.price)
        };
      }
      
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      return {
        nights: nights,
        total: formatPrice(hotel.price * nights)
      };
    }
    
    return {
      nights: 1,
      total: formatPrice(hotel.price)
    };
  };

  const { nights, total } = calculateTotal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-99999 p-4">
      <div className="bg-gray-900 rounded-3xl w-full max-w-2xl overflow-hidden">
        <div className="relative">
          <button 
            onClick={() => {
              onClose();
              toast('Бронювання скасовано', { icon: '❌' });
            }}
            className="absolute top-4 right-4 z-10 bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="h-48 overflow-hidden">
            <img 
              src={`./uploads/${hotel.image}`} 
              alt={hotel.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
                toast.error('Помилка завантаження зображення готелю');
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
            <div className="absolute bottom-4 left-6">
              <h2 className="text-2xl font-bold">{hotel.title}</h2>
              <p className="text-gray-300 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {hotel.location}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-gray-400">Ціна за ніч</p>
              <p className="text-2xl font-bold text-indigo-400">₴{formatPrice(hotel.price)}</p>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-2xl mb-6">
            <h3 className="text-lg font-semibold mb-2">Ваші дані</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p><span className="text-gray-400">Повне ім'я:</span> {userData.full_name}</p>
              <p><span className="text-gray-400">Email:</span> {userData.email}</p>
              <p><span className="text-gray-400">Телефон:</span> {userData.phone}</p>
              <p><span className="text-gray-400">Стать:</span> {userData.sex === 'male' ? 'Чоловік' : 'Жінка'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  min={getFormattedDate(tomorrow)}
                />
                <label className="absolute -top-2 left-3 bg-gray-800 px-1 text-xs text-gray-400">Заїзд</label>
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  min={formData.checkIn || getFormattedDate(dayAfterTomorrow)}
                />
                <label className="absolute -top-2 left-3 bg-gray-800 px-1 text-xs text-gray-400">Виїзд</label>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div>
                <p className="text-gray-400">Всього до сплати:</p>
                <p className="text-2xl font-bold text-indigo-400">₴{total}</p>
                <p className="text-sm text-gray-400">{nights} {nights === 1 ? 'ніч' : nights < 5 ? 'ночі' : 'ночей'}</p>
              </div>
              <button
                type="submit"
                disabled={bookingMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
              >
                {bookingMutation.isPending ? 'Обробка...' : 'Забронювати'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const MapPin = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const Star = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default HotelBookingModal;