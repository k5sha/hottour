import React, { useState } from 'react';
import { X, Calendar, Users, Clock, MapPin, Star } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { AddToken } from '../../utils/auth';
import { BACKEND_API } from '../../utils/config';

const TourBookingModal = ({ tour, isOpen, onClose, userData }) => {
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDuration = (fromDatetime, toDatetime) => {
    const from = new Date(fromDatetime);
    const to = new Date(toDatetime);
    const durationInHours = (to - from) / (1000 * 60 * 60);
    
    const hours = Math.floor(durationInHours);
    const minutes = Math.round((durationInHours - hours) * 60);
    
    if (minutes > 0) {
      return `${hours} год ${minutes} хв`;
    }
    return `${hours} год`;
  };

  const [formData, setFormData] = useState({
    participants: 1
  });

  const bookingMutation = useMutation({
    mutationFn: (bookingData) => {
      bookingData = AddToken(bookingData)
      return axios.post(`${BACKEND_API}/api/booking/tour`, bookingData);
    },
    onSuccess: () => {
      alert('Бронювання успішне!');
      onClose();
    },
    onError: (error) => {
      console.error('Помилка бронювання:', error);
      alert('Сталася помилка при бронюванні. Спробуйте ще раз.');
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let participantsValue = parseInt(value) || 1;

    if (tour.participents_limit && participantsValue > tour.participents_limit) {
      participantsValue = tour.participents_limit;
    }
    if (participantsValue < 1) {
      participantsValue = 1;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: participantsValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (tour.participents_limit && formData.participants > tour.participents_limit) {
      alert(`Максимальна кількість учасників: ${tour.participents_limit}`);
      return;
    }

    const bookingData = {
      tour_id: tour.public_id,
      number_of_people: parseInt(formData.participants),
    };
    
    bookingMutation.mutate(bookingData);
  };

  const calculateTotal = () => {
    const participants = parseInt(formData.participants) || 1;
    return {
      participants: participants,
      total: formatPrice(tour.price * participants)
    };
  };

  const { participants, total } = calculateTotal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-99999 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-3xl w-full max-w-2xl overflow-hidden my-auto">
        <div className="relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          <div className="h-40 md:h-48 overflow-hidden">
            <img 
              src={`./uploads/${tour.image}`} 
              alt={tour.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
            <div className="absolute bottom-4 left-4 md:left-6">
              <h2 className="text-xl md:text-2xl font-bold line-clamp-1">{tour.title}</h2>
              <p className="text-gray-300 text-sm md:text-base flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{tour.location}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <div>
              <p className="text-gray-400 text-sm md:text-base">Ціна за особу</p>
              <p className="text-xl md:text-2xl font-bold text-indigo-400">₴{formatPrice(tour.price)}</p>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>

          <div className="bg-gray-800 p-3 md:p-4 rounded-2xl mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Дата та час туру</h3>
            <div className="flex flex-row space-y-2 md:space-y-3 gap-8">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-indigo-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-400">Дата початку</p>
                  <p className="font-medium text-sm md:text-base truncate">{formatDate(tour.from_datetime)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-indigo-400 flex-shrink-0" />
                <div>
                  <p className="text-xs md:text-sm text-gray-400">Тривалість</p>
                  <p className="font-medium text-sm md:text-base">{formatDuration(tour.from_datetime, tour.to_datetime)}</p>
                </div>
              </div>
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

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-3 md:space-y-4">
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <input
                  type="number"
                  name="participants"
                  value={formData.participants}
                  onChange={handleInputChange}
                  min="1"
                  max={tour.participents_limit || 50}
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl pl-10 pr-4 py-2 md:py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
                  required
                />
                <label className="absolute -top-2 left-3 bg-gray-800 px-1 text-xs text-gray-400">Кількість осіб</label>
              </div>
              
              {tour.participents_limit && (
                <p className="text-xs md:text-sm text-gray-400">
                  Максимальна кількість учасників: {tour.participents_limit} осіб
                </p>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center pt-3 md:pt-4 gap-4 md:gap-0">
              <div>
                <p className="text-gray-400 text-sm md:text-base">Всього до сплати:</p>
                <p className="text-xl md:text-2xl font-bold text-indigo-400">₴{total}</p>
                <p className="text-xs md:text-sm text-gray-400">
                  {participants} {participants === 1 ? 'особа' : participants < 5 ? 'особи' : 'осіб'}
                </p>
              </div>
              <button
                type="submit"
                disabled={bookingMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-2 md:py-3 px-6 md:px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:transform-none text-sm md:text-base"
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

export default TourBookingModal;