import React, { useState, useMemo } from 'react';
import { Plus, Edit3, Trash2, Home, Globe, BookOpen, Search, Star, Users, Calendar, Clock, MapPin } from 'lucide-react';
import axios from 'axios';
import { BACKEND_API } from '../utils/config';
import { AddToken } from '../utils/auth';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AddHotelModal from '../components/modals/AddHotelModal';
import AddTourModal from '../components/modals/AddTourModal';
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('bookings');
    const [showHotelModal, setShowHotelModal] = useState(false);
    const [showTourModal, setShowTourModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bookingType, setBookingType] = useState('hotels');
    const [editingHotel, setEditingHotel] = useState(null);
    const [editingTour, setEditingTour] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('created_at');
    const [sortDirection, setSortDirection] = useState('desc');
    
    const queryClient = useQueryClient();
    
    const { data: hotelsData, isLoading: hotelsLoading, error: hotelsError } = useQuery({
        queryKey: ['hotels'],
        queryFn: () => axios.post(`${BACKEND_API}/public/api/hotel/get`).then(res => res.data),
    });

    const { data: toursData, isLoading: toursLoading, error: toursError } = useQuery({
        queryKey: ['tours'],
        queryFn: () => axios.post(`${BACKEND_API}/public/api/tour/get`).then(res => res.data),
    });

    const { data: bookingsData, isLoading: bookingsLoading, error: bookingsError } = useQuery({
        queryKey: ['bookings', bookingType],
        queryFn: () => {
            var bookingData = { type: bookingType }
            bookingData = AddToken(bookingData)
            return axios.post(`${BACKEND_API}/api/bookings`, bookingData).then(res => res.data)
        }
    });

    const filteredAndSortedBookings = useMemo(() => {
        if (!bookingsData) return [];
        
        let filtered = bookingsData.filter(booking => 
            booking.public_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (bookingType === 'hotels' ? booking.hotel_id : booking.tour_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (booking.from_date && new Date(booking.from_date).toISOString().split("T")[0].toLowerCase().includes(searchTerm.toLowerCase())) ||
            (booking.to_date &&  new Date(booking.to_date).toISOString().split("T")[0].toLowerCase().includes(searchTerm.toLowerCase())) ||
            (booking.number_of_people && booking.number_of_people.toString().includes(searchTerm))
        );

        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortField) {
                case 'from_date':
                    aValue = new Date(a.from_date || 0);
                    bValue = new Date(b.from_date || 0);
                    break;
                case 'to_date':
                    aValue = new Date(a.to_date || 0);
                    bValue = new Date(b.to_date || 0);
                    break;
                case 'public_id':
                    aValue = a.public_id;
                    bValue = b.public_id;
                    break;
                case 'user_id':
                    aValue = a.user_id;
                    bValue = b.user_id;
                    break;
                default:
                    aValue = a[sortField];
                    bValue = b[sortField];
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            } else {
                return sortDirection === 'asc'
                    ? aValue - bValue
                    : bValue - aValue;
            }
        });

        return filtered;
    }, [bookingsData, searchTerm, bookingType, sortField, sortDirection]);

    const filteredHotels = useMemo(() => {
        if (!hotelsData) return [];
        
        return hotelsData.filter(hotel => 
            hotel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hotel.public_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hotel.price.toString().includes(searchTerm) ||
            (hotel.rating && hotel.rating.toString().includes(searchTerm))
        );
    }, [hotelsData, searchTerm]);

    const filteredTours = useMemo(() => {
        if (!toursData) return [];
        
        return toursData.filter(tour => 
            tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tour.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tour.public_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tour.price.toString().includes(searchTerm) ||
            tour.participents_limit.toString().includes(searchTerm) ||
            (tour.enrolled_count && tour.enrolled_count.toString().includes(searchTerm))
        );
    }, [toursData, searchTerm]);

    const deleteHotelMutation = useMutation({
        mutationFn: (hotelId) => {
            const payload = AddToken({ public_id: hotelId });
            return axios.post(`${BACKEND_API}/api/hotel/delete`, payload);
        },
        onSuccess: () => {
            toast.success('Готель успішно видалено!');
            queryClient.invalidateQueries(['hotels']);
            setShowDeleteModal(false);
        },
        onError: (error) => {
            console.error('Помилка:', error);
            toast.error('Помилка при видаленні готелю');
        }
    });

    const deleteTourMutation = useMutation({
        mutationFn: (tourId) => {
            const payload = AddToken({ public_id: tourId });
            return axios.post(`${BACKEND_API}/api/tour/delete`, payload);
        },
        onSuccess: () => {
            toast.success('Тур успішно видалено!');
            queryClient.invalidateQueries(['tours']);
            setShowDeleteModal(false);
        },
        onError: (error) => {
            console.error('Помилка:', error);
            toast.error('Помилка при видаленні туру');
        }
    });

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const handleEditHotel = (hotel) => {
        setEditingHotel(hotel);
        setShowHotelModal(true);
    };

    const handleEditTour = (tour) => {
        setEditingTour(tour);
        setShowTourModal(true);
    };

    const handleDeleteHotel = (hotel) => {
        setItemToDelete(hotel);
        setDeleteType('hotel');
        setShowDeleteModal(true);
    };

    const handleDeleteTour = (tour) => {
        setItemToDelete(tour);
        setDeleteType('tour');
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (deleteType === 'hotel' && itemToDelete) {
            deleteHotelMutation.mutate(itemToDelete.public_id);
        } else if (deleteType === 'tour' && itemToDelete) {
            deleteTourMutation.mutate(itemToDelete.public_id);
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatDuration = (fromDatetime, toDatetime) => {
        if (!fromDatetime || !toDatetime) return '-';
        const from = new Date(fromDatetime);
        const to = new Date(toDatetime);
        const durationInHours = (to - from) / (1000 * 60 * 60);
        return `${Math.round(durationInHours)} годин`;
    };

    const getStats = () => {
        return {
            totalHotels: hotelsData?.length || 0,
            totalTours: toursData?.length || 0,
            totalBookings: bookingsData?.length || 0,
        };
    };

    const stats = getStats();

    const getDeleteModalTitle = () => {
        if (deleteType === 'hotel') {
            return 'Видалити готель';
        } else if (deleteType === 'tour') {
            return 'Видалити тур';
        }
        return 'Видалити';
    };

    const getDeleteModalMessage = () => {
        if (deleteType === 'hotel' && itemToDelete) {
            return `Ви впевнені, що хочете видалити готель "${itemToDelete.title}"? Цю дію неможливо скасувати.`;
        } else if (deleteType === 'tour' && itemToDelete) {
            return `Ви впевнені, що хочете видалити тур "${itemToDelete.title}"? Цю дію неможливо скасувати.`;
        }
        return 'Ви впевнені, що хочете видалити цей елемент?';
    };

    const SortableHeader = ({ field, children }) => (
        <th 
            className="px-4 py-3 text-left cursor-pointer hover:bg-gray-700/50 transition-colors"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center gap-1">
                {children}
                <span className="text-xs">
                    {sortField === field ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                </span>
            </div>
        </th>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <main className="pt-20 pb-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-white mb-2">
                            Адмін панель
                        </h2>
                        <p className="text-gray-400">Керування системою бронювання</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gray-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Готелі</p>
                                    <p className="text-3xl font-bold text-blue-400">{stats.totalHotels}</p>
                                </div>
                                <Home className="w-8 h-8 text-blue-400" />
                            </div>
                        </div>
                        
                        <div className="bg-gray-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Тури</p>
                                    <p className="text-3xl font-bold text-purple-400">{stats.totalTours}</p>
                                </div>
                                <Globe className="w-8 h-8 text-purple-400" />
                            </div>
                        </div>
                        
                        <div className="bg-gray-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Бронювання</p>
                                    <p className="text-3xl font-bold text-green-400">{stats.totalBookings}</p>
                                </div>
                                <BookOpen className="w-8 h-8 text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-6">
                        <button
                            onClick={() => setActiveTab('bookings')}
                            className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                                activeTab === 'bookings' 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            Бронювання
                        </button>
                        <button
                            onClick={() => setActiveTab('hotels')}
                            className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                                activeTab === 'hotels' 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            Готелі
                        </button>
                        <button
                            onClick={() => setActiveTab('tours')}
                            className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                                activeTab === 'tours' 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            Тури
                        </button>
                    </div>

                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Пошук..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {activeTab === 'bookings' && (
                        <section>
                            <div className="bg-gray-800 rounded-2xl p-6">
                                <div className="flex flex-wrap gap-4 mb-6">
                                    <button
                                        onClick={() => setBookingType('hotels')}
                                        className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                                            bookingType === 'hotels' 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        Бронювання готелів
                                    </button>
                                    <button
                                        onClick={() => setBookingType('tours')}
                                        className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                                            bookingType === 'tours' 
                                                ? 'bg-purple-600 text-white' 
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        Бронювання турів
                                    </button>
                                </div>
                                
                                {bookingsLoading ? (
                                    <div className="text-center py-12">
                                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                                        <p className="mt-4">Завантаження бронювань...</p>
                                    </div>
                                ) : bookingsError ? (
                                    <div className="text-center text-red-400 py-12">
                                        <p>Помилка при завантаженні бронювань</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-700">
                                                    <SortableHeader field="public_id">ID</SortableHeader>
                                                    <SortableHeader field="user_id">Користувач</SortableHeader>
                                                    <th className="px-4 py-3 text-left">{bookingType === 'hotels' ? 'Готель' : 'Тур'}</th>
                                                    {bookingType === 'hotels' ? (
                                                        <>
                                                            <SortableHeader field="from_date">Заїзд</SortableHeader>
                                                            <SortableHeader field="to_date">Виїзд</SortableHeader>
                                                            <th className="px-4 py-3 text-left">Тривалість</th>
                                                        </>
                                                    ) : (
                                                        <SortableHeader field="number_of_people">Учасники</SortableHeader>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredAndSortedBookings.map(booking => (
                                                    <tr key={booking.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                                        <td className="px-4 py-3 font-mono text-sm">{booking.public_id}</td>
                                                        <td className="px-4 py-3 font-mono text-sm">{booking.user_id}</td>
                                                        <td className="px-4 py-3 font-mono text-sm">
                                                            {bookingType === 'hotels' ? booking.hotel_id : booking.tour_id}
                                                        </td>
                                                        {bookingType === 'hotels' ? (
                                                            <>
                                                                <td className="px-4 py-3">{formatDateTime(booking.from_date)}</td>
                                                                <td className="px-4 py-3">{formatDateTime(booking.to_date)}</td>
                                                                <td className="px-4 py-3">
                                                                    {booking.from_date && booking.to_date ? 
                                                                        `${Math.ceil((new Date(booking.to_date) - new Date(booking.from_date)) / (1000 * 60 * 60 * 24))} днів` 
                                                                        : '-'
                                                                    }
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <td className="px-4 py-3 text-center">{booking.number_of_people}</td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {activeTab === 'hotels' && (
                        <section>
                            <div className="bg-gray-800 rounded-2xl p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-semibold">Управління готелями</h3>
                                    <button
                                        onClick={() => {
                                            setEditingHotel(null);
                                            setShowHotelModal(true);
                                        }}
                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-2xl"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Додати готель
                                    </button>
                                </div>
                                
                                {hotelsLoading ? (
                                    <div className="text-center py-12">
                                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                                        <p className="mt-4">Завантаження готелів...</p>
                                    </div>
                                ) : hotelsError ? (
                                    <div className="text-center text-red-400 py-12">
                                        <p>Помилка при завантаженні готелів</p>
                                    </div>
                                ) : filteredHotels && filteredHotels.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-700">
                                                    <th className="px-4 py-3 text-left">ID</th>
                                                    <th className="px-4 py-3 text-left">Фото</th>
                                                    <th className="px-4 py-3 text-left">Назва</th>
                                                    <th className="px-4 py-3 text-left">Локація</th>
                                                    <th className="px-4 py-3 text-left">Ціна</th>
                                                    <th className="px-4 py-3 text-left">Рейтинг</th>
                                                    <th className="px-4 py-3 text-left">Опис</th>
                                                    <th className="px-4 py-3 text-left">Дії</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredHotels.map(hotel => (
                                                    <tr key={hotel.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                                        <td className="px-4 py-3 font-mono text-sm">{hotel.public_id}</td>
                                                        <td className="px-4 py-3">
                                                            <img 
                                                                className="h-16 w-16 object-cover rounded-lg" 
                                                                src={`/uploads/${hotel.image}`} 
                                                                alt={hotel.title}
                                                                onError={(e) => {
                                                                    e.target.src = 'https://via.placeholder.com/64';
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3 font-semibold">{hotel.title}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="w-4 h-4 text-blue-400" />
                                                                {hotel.location}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 font-bold text-green-400">{hotel.price} ₴</td>
                                                        <td className="px-4 py-3">
                                                            {hotel.rating ? (
                                                                <div className="flex items-center gap-1">
                                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                                    {hotel.rating}/5
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400">Немає</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 max-w-xs">
                                                            <p className="text-sm text-gray-300 line-clamp-2">
                                                                {hotel.description}
                                                            </p>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    onClick={() => handleEditHotel(hotel)}
                                                                    className="p-2 bg-yellow-600 rounded-lg hover:bg-yellow-700"
                                                                >
                                                                    <Edit3 className="w-4 h-4" />
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteHotel(hotel)}
                                                                    className="p-2 bg-red-600 rounded-lg hover:bg-red-700"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-400 py-12">
                                        <p>Готелів не знайдено</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {activeTab === 'tours' && (
                        <section>
                            <div className="bg-gray-800 rounded-2xl p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-semibold">Управління турами</h3>
                                    <button
                                        onClick={() => {
                                            setEditingTour(null);
                                            setShowTourModal(true);
                                        }}
                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-2xl"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Додати тур
                                    </button>
                                </div>
                                
                                {toursLoading ? (
                                    <div className="text-center py-12">
                                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                                        <p className="mt-4">Завантаження турів...</p>
                                    </div>
                                ) : toursError ? (
                                    <div className="text-center text-red-400 py-12">
                                        <p>Помилка при завантаженні турів</p>
                                    </div>
                                ) : filteredTours && filteredTours.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-700">
                                                    <th className="px-4 py-3 text-left">ID</th>
                                                    <th className="px-4 py-3 text-left">Фото</th>
                                                    <th className="px-4 py-3 text-left">Назва</th>
                                                    <th className="px-4 py-3 text-left">Локація</th>
                                                    <th className="px-4 py-3 text-left">Ціна</th>
                                                    <th className="px-4 py-3 text-left">Дата</th>
                                                    <th className="px-4 py-3 text-left">Тривалість</th>
                                                    <th className="px-4 py-3 text-left">Учасники</th>
                                                    <th className="px-4 py-3 text-left">Записано</th>
                                                    <th className="px-4 py-3 text-left">Дії</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredTours.map(tour => (
                                                    <tr key={tour.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                                        <td className="px-4 py-3 font-mono text-sm">{tour.public_id}</td>
                                                        <td className="px-4 py-3">
                                                            <img 
                                                                className="h-16 w-16 object-cover rounded-lg" 
                                                                src={`/uploads/${tour.image}`} 
                                                                alt={tour.title}
                                                                onError={(e) => {
                                                                    e.target.src = 'https://via.placeholder.com/64';
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3 font-semibold">{tour.title}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="w-4 h-4 text-purple-400" />
                                                                {tour.location}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 font-bold text-green-400">{tour.price} ₴</td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4 text-blue-400" />
                                                                {formatDate(tour.from_datetime)}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-4 h-4 text-yellow-400" />
                                                                {formatDuration(tour.from_datetime, tour.to_datetime)}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <div className="flex items-center gap-1 justify-center">
                                                                <Users className="w-4 h-4 text-green-400" />
                                                                {tour.participents_limit}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            {tour.enrolled_count || 0}/{tour.participents_limit}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    onClick={() => handleEditTour(tour)}
                                                                    className="p-2 bg-yellow-600 rounded-lg hover:bg-yellow-700"
                                                                >
                                                                    <Edit3 className="w-4 h-4" />
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteTour(tour)}
                                                                    className="p-2 bg-red-600 rounded-lg hover:bg-red-700"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-400 py-12">
                                        <p>Турів не знайдено</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </main>
            
            <AddHotelModal
                isOpen={showHotelModal}
                onClose={() => {
                    setShowHotelModal(false);
                    setEditingHotel(null);
                }}
                editingHotel={editingHotel}
            />

            <AddTourModal
                isOpen={showTourModal}
                onClose={() => {
                    setShowTourModal(false);
                    setEditingTour(null);
                }}
                editingTour={editingTour}
            />

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                    setDeleteType('');
                }}
                onConfirm={confirmDelete}
                title={getDeleteModalTitle()}
                message={getDeleteModalMessage()}
                isLoading={deleteHotelMutation.isLoading || deleteTourMutation.isLoading}
            />
        </div>
    );
};

export default AdminPage;