import { React, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { BACKEND_API } from '../utils/config';
import { AddToken } from '../utils/auth';
import { Calendar, MapPin, Star, Hotel, Globe, MessageCircle, X, Users, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const MyBookingsPage = ({ userData }) => {
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [activeTab, setActiveTab] = useState('hotels'); 

  const { data: hotelBookingsData, isLoading: hotelBookingsLoading, error: hotelBookingsError } = useQuery({
    queryKey: ['hotelBookings'],
    queryFn: () => {
      const payload = AddToken({ type: 'hotels' });
      return axios.post(`${BACKEND_API}/api/bookings`, payload).then(res => res.data);
    },
    enabled: !!userData && activeTab === 'hotels',
  });

  const { data: tourBookingsData, isLoading: tourBookingsLoading, error: tourBookingsError } = useQuery({
    queryKey: ['tourBookings'],
    queryFn: () => {
      const payload = AddToken({ type: 'tours' });
      return axios.post(`${BACKEND_API}/api/bookings`, payload).then(res => res.data);
    },
    enabled: !!userData && activeTab === 'tours',
  });

  const { data: hotelsData, isLoading: hotelsLoading } = useQuery({
    queryKey: ['hotels'],
    queryFn: () => axios.post(`${BACKEND_API}/public/api/hotel/get`).then(res => res.data),
  });

  const { data: toursData, isLoading: toursLoading } = useQuery({
    queryKey: ['tours'],
    queryFn: () => axios.post(`${BACKEND_API}/public/api/tour/get`).then(res => res.data),
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => axios.post(`${BACKEND_API}/public/api/review/get`).then(res => res.data),
  });

  const createReviewMutation = useMutation({
    mutationFn: (reviewData) => {
      const payload = AddToken(reviewData);
      return axios.post(`${BACKEND_API}/api/review/create`, payload);
    },
    onSuccess: () => {
      toast.success('Відгук успішно додано!');
      setIsReviewModalOpen(false);
      setReviewRating(5);
      setReviewComment('');
      setSelectedBooking(null);
      queryClient.invalidateQueries(['reviews']);
    },
    onError: (error) => {
      console.error('Помилка:', error);
      toast.error('Помилка при додаванні відгуку');
    }
  });

  const openReviewModal = (booking, type) => {
    setSelectedBooking({ ...booking, type });
    setIsReviewModalOpen(true);
  };

  const submitReview = () => {
    if (!selectedBooking) return;

    const reviewData = {
      reference_id: selectedBooking.hotel_id || selectedBooking.tour_id,
      reference_type: selectedBooking.type === 'hotels' ? 'hotel' : 'tour',
      rating: reviewRating,
      comment: reviewComment
    };

    createReviewMutation.mutate(reviewData);
  };

  const hasReviewForBooking = (booking, type) => {
    if (!reviewsData) return false;
    
    const referenceId = type === 'hotels' ? booking.hotel_id : booking.tour_id;
    const referenceType = type === 'hotels' ? 'hotel' : 'tour';
    
    return reviewsData.some(review => 
      review.reference_id === referenceId && 
      review.reference_type === referenceType &&
      review.user_id === userData.public_id
    );
  };

  const getBookingInfo = (booking, type) => {
    if (type === 'hotels' && hotelsData) {
      return hotelsData.find(hotel => hotel.public_id === booking.hotel_id);
    } else if (type === 'tours' && toursData) {
      return toursData.find(tour => tour.public_id === booking.tour_id);
    }
    return null;
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
    return `${Math.round(durationInHours)} годин`;
  };

  const formatTourDateTime = (fromDatetime, toDatetime) => {
    try {
      const fromDate = new Date(fromDatetime);
      const toDate = new Date(toDatetime);
      
      const formatDate = (date) => date.toLocaleDateString('uk-UA', { 
        day: 'numeric', 
        month: 'short' 
      });
      
      const formatTime = (date) => date.toLocaleTimeString('uk-UA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      if (fromDate.toDateString() === toDate.toDateString()) {
        return `${formatDate(fromDate)}, ${formatTime(fromDate)}-${formatTime(toDate)}`;
      } else {
        return `${formatDate(fromDate)} ${formatTime(fromDate)} - ${formatDate(toDate)} ${formatTime(toDate)}`;
      }
    } catch {
      return "За розкладом";
    }
  };

  const isLoading = (activeTab === 'hotels' ? hotelBookingsLoading : tourBookingsLoading) || hotelsLoading || toursLoading;
  const hasError = activeTab === 'hotels' ? hotelBookingsError : tourBookingsError;
  const currentBookings = activeTab === 'hotels' ? hotelBookingsData : tourBookingsData;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Помилка завантаження бронювань</h2>
          <p className="text-gray-400">Спробуйте оновити сторінку</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Мої бронювання</h1>
          <p className="text-gray-400 text-xl">Керуйте своїми замовленнями та залишайте відгуки</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('hotels')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'hotels' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Hotel className="w-4 h-4" />
                Готелі
              </div>
            </button>
            <button
              onClick={() => setActiveTab('tours')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'tours' 
                  ? 'bg-violet-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Тури
              </div>
            </button>
          </div>
        </div>

        {!currentBookings || currentBookings.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {activeTab === 'hotels' ? 'Немає бронювань готелів' : 'Немає бронювань турів'}
            </h2>
            <p className="text-gray-400">
              {activeTab === 'hotels' 
                ? 'У вас ще немає активних бронювань готелів' 
                : 'У вас ще немає активних бронювань турів'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {currentBookings.map((booking) => {
              const bookingInfo = getBookingInfo(booking, activeTab);
              const hasReview = hasReviewForBooking(booking, activeTab);
              
              if (!bookingInfo) return null;

              return (
                <div key={booking.public_id} className="bg-gray-900 rounded-2xl p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <img 
                      src={`./uploads/${bookingInfo.image}`} 
                      alt={bookingInfo.title}
                      className="w-full md:w-48 h-48 object-cover rounded-xl"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {activeTab === 'hotels' && <Hotel className="w-5 h-5 text-indigo-400" />}
                            {activeTab === 'tours' && <Globe className="w-5 h-5 text-violet-400" />}
                            <h3 className="text-xl font-semibold">{bookingInfo.title}</h3>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <MapPin className="w-4 h-4" />
                            <span>{bookingInfo.location}</span>
                          </div>

                          {activeTab === 'hotels' && (
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Заїзд: {formatDate(booking.from_date)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Виїзд: {formatDate(booking.to_date)}</span>
                              </div>
                            </div>
                          )}

                          {activeTab === 'tours' && (
                            <div className="space-y-1 text-sm text-gray-400">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{formatTourDateTime(bookingInfo.from_datetime, bookingInfo.to_datetime)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{formatDuration(bookingInfo.from_datetime, bookingInfo.to_datetime)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>до {bookingInfo.participents_limit} осіб</span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < (bookingInfo.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-700 text-gray-700'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-4 line-clamp-2">{bookingInfo.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-indigo-400">
                          ₴{bookingInfo.price}
                          <span className="text-sm text-gray-400 ml-2">
                            {activeTab === 'hotels' ? 'за ніч' : 'з особи'}
                          </span>
                        </div>
                        
                        {!hasReview ? (
                          <button
                            onClick={() => openReviewModal(booking, activeTab)}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Залишити відгук
                          </button>
                        ) : (
                          <span className="text-green-400 font-semibold">Відгук залишено</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isReviewModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Залишити відгук</h2>
              <button
                onClick={() => {
                  setIsReviewModalOpen(false);
                  setSelectedBooking(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-300 text-sm">
                {selectedBooking.type === 'hotels' ? 'Готель: ' : 'Тур: '}
                <span className="font-semibold">
                  {getBookingInfo(selectedBooking, selectedBooking.type)?.title}
                </span>
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Оцінка
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="focus:outline-none"
                  >
                    <Star 
                      className={`w-8 h-8 ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Коментар
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Розкажіть про ваш досвід..."
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsReviewModalOpen(false);
                  setSelectedBooking(null);
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Скасувати
              </button>
              <button
                onClick={submitReview}
                disabled={createReviewMutation.isLoading || !reviewComment.trim()}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {createReviewMutation.isLoading ? 'Відправка...' : 'Відправити'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;