import {React, useState} from 'react';
import { Link } from 'react-router';
import { useRef } from 'react';
import { Hotel, MapPin, Star, Globe, Heart, ArrowRight, Calendar, Users, Clock } from 'lucide-react';
import { AddToken, SetToken } from '../utils/auth';
import axios from 'axios';
import { BACKEND_API } from '../utils/config';
import { useQuery } from '@tanstack/react-query';
import HotelBookingModal from '../components/modals/HotelBookingModal';
import TourBookingModal from '../components/modals/TourBookingModal';

const scrollToSection = (elementRef) => {
  window.scrollTo({
    top: elementRef.current.offsetTop,
    behavior: "smooth",
  });
};

const HomePage = ({ userData }) => {
  const main_section = useRef(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const [selectedTour, setSelectedTour] = useState(null);
  const [isTourBookingModalOpen, setIsTourBookingModalOpen] = useState(false);

  const { data: hotelsData, isLoading: hotelsLoading, error: hotelsError } = useQuery({
    queryKey: ['hotels'],
    queryFn: () => axios.post(`${BACKEND_API}/public/api/hotel/get`).then(res => res.data),
  });

  const { data: toursData, isLoading: toursLoading, error: toursError } = useQuery({
    queryKey: ['tours'],
    queryFn: () => axios.post(`${BACKEND_API}/public/api/tour/get`).then(res => res.data),
  });

  const formatDuration = (fromDatetime, toDatetime) => {
    const from = new Date(fromDatetime);
    const to = new Date(toDatetime);
    const durationInHours = (to - from) / (1000 * 60 * 60);
    return `${Math.round(durationInHours)} годин`;
  };

  const formatDateFrequency = (fromDatetime, toDatetime) => {
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

  if (hotelsLoading || toursLoading) {
    return     (  
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (hotelsError || toursError) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Помилка завантаження даних</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-full h-screen flex items-center justify-center text-center relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200)',
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Турагенство "Вау"
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            Подорожуйте з нами - отримуйте незабутні враження
          </p>
          <button onClick={() => scrollToSection(main_section)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105">
            Почати подорож
          </button>
        </div>
      </div>

      <main ref={main_section} className="max-w-7xl mx-auto py-20 px-4">
        <section className="mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-indigo-900/30 px-8 py-4 rounded-full mb-6">
              <Hotel className="w-8 h-8" />
              <h2 className="text-4xl font-bold">Наші готелі</h2>
            </div>
            <p className="text-gray-400 text-xl">Виберіть ідеальний відпочинок для себе</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-10">
            {hotelsData && hotelsData.map((hotel) => (
              <div key={hotel.id} className="group relative bg-gray-900 rounded-3xl p-8 overflow-hidden hover:scale-[1.02] transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img 
                  src={`./uploads/${hotel.image}`} 
                  alt={hotel.title} 
                  className="rounded-2xl w-full h-80 object-cover mb-6 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-indigo-400" />
                    <span className="text-indigo-400 text-sm">{hotel.location}</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{hotel.title}</h3>
                  <p className="text-gray-300 mb-6">{hotel.description}</p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-400">₴{hotel.price}</div>
                      <div className="text-sm text-gray-400">за ніч</div>
                    </div>
                  </div>    
                  <button 
                    onClick={() => {
                      if (!userData) {
                        alert('Будь ласка, увійдіть в систему для бронювання');
                        return;
                      }
                      setSelectedHotel(hotel);
                      setIsBookingModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 group-hover:gap-3"
                  >
                    Забронювати
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-violet-900/30 px-8 py-4 rounded-full mb-6">
              <Globe className="w-8 h-8" />
              <h2 className="text-4xl font-bold">Наші екскурсії</h2>
            </div>
            <p className="text-gray-400 text-xl">Відкрийте для себе нові горизонти</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {toursData && toursData.map((tour) => (
              <div key={tour.id} className="group relative bg-gray-900 rounded-3xl p-6 hover:scale-[1.03] transition-all duration-300">
                <img 
                  src={`./uploads/${tour.image}`} 
                  alt={tour.title} 
                  className="rounded-2xl w-full h-56 object-cover mb-4 group-hover:scale-110 transition-transform duration-500"
                />
                
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-violet-400" />
                  <span className="text-violet-400 text-sm">{tour.location}</span>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 h-14 line-clamp-2">{tour.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(tour.from_datetime, tour.to_datetime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>до {tour.participents_limit} осіб</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="min-w-0">
                      {formatDateFrequency(tour.from_datetime, tour.to_datetime)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-violet-400">₴{tour.price}</div>
                    <div className="text-xs text-gray-400">з особи</div>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    if (!userData) {
                      alert('Будь ласка, увійдіть в систему для бронювання');
                      return;
                    }
                    setSelectedTour(tour); 
                    setIsTourBookingModalOpen(true); 
                  }}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-4 rounded-2xl transition-colors duration-300"
                >
                  Забронювати
                </button>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <div className="bg-gray-900 rounded-3xl p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
            <div className="relative">
              <h2 className="text-5xl font-bold mb-8">Про нас</h2>
              <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
                Ми віримо, що кожна подорож — це не просто зміна місця, а й можливість отримати незабутні емоції, 
                відкрити нові горизонти та створити спогади на все життя. Наша мета — перетворити ваші мрії про 
                ідеальний відпочинок на реальність.
              </p>
              <p className="text-2xl mb-12 font-semibold">
                Залишились питання?
              </p>
              <Link 
                to="/faq" 
                className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 hover:gap-4 text-xl"
              >
                Перегляньте FAQ
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      {selectedHotel && userData && (
        <HotelBookingModal
          hotel={selectedHotel}
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedHotel(null);
          }}
          userData={userData}
        />
      )}
      {selectedTour && userData && (
        <TourBookingModal
          tour={selectedTour}
          isOpen={isTourBookingModalOpen}
          onClose={() => {
            setIsTourBookingModalOpen(false);
            setSelectedTour(null);
          }}
          userData={userData}
        />
      )}
    </div>
  );
};

export default HomePage;