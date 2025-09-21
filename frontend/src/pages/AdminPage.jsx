import React, { useState } from 'react';
import { Plus, Image, Calendar, Users, X } from 'lucide-react';
import axios from 'axios';
import { BACKEND_API } from '../utils/config';
import { AddToken } from '../utils/auth';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('bookings');
    const [showHotelModal, setShowHotelModal] = useState(false);
    const [showTourModal, setShowTourModal] = useState(false);
    const [bookingType, setBookingType] = useState('hotels'); 
    
    const queryClient = useQueryClient();
    
    const [hotelForm, setHotelForm] = useState({
        title: '',
        location: '',
        price: '',
        description: '',
        image: null
    });

    const [tourForm, setTourForm] = useState({
        title: '',
        location: '',
        price: '',
        description: '',
        image: null,
        from_datetime: '',
        to_datetime: '',
        participents_limit: ''
    });

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

    const createHotelMutation = useMutation({
        mutationFn: (formData) => axios.post(`${BACKEND_API}/api/hotel/create`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }),
        onSuccess: () => {
            toast.success('Готель успішно додано!');
            setShowHotelModal(false);
            setHotelForm({
                title: '',
                location: '',
                price: '',
                description: '',
                image: null
            });
            queryClient.invalidateQueries(['hotels']);
        },
        onError: (error) => {
            console.error('Помилка:', error);
            toast.error('Сталася помилка при додаванні готелю');
        }
    });

    const createTourMutation = useMutation({
        mutationFn: (formData) => axios.post(`${BACKEND_API}/api/tour/create`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }),
        onSuccess: () => {
            toast.success('Тур успішно додано!');
            setShowTourModal(false);
            setTourForm({
                title: '',
                location: '',
                price: '',
                description: '',
                image: null,
                from_datetime: '',
                to_datetime: '',
                participents_limit: ''
            });
            queryClient.invalidateQueries(['tours']);
        },
        onError: (error) => {
            console.error('Помилка:', error);
            toast.error('Сталася помилка при додаванні туру');
        }
    });

    const handleHotelSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            const payload = AddToken({
                title: hotelForm.title,
                location: hotelForm.location,
                price: hotelForm.price,
                description: hotelForm.description
            });

            Object.keys(payload).forEach(key => {
                formData.append(key, payload[key]);
            });
            
            if (hotelForm.image) {
                formData.append('image', hotelForm.image);
            }

            createHotelMutation.mutate(formData);
        } catch (error) {
            console.error('Помилка:', error);
            toast.error('Сталася помилка при додаванні готелю');
        }
    };

    const handleTourSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            const payload = AddToken({
                title: tourForm.title,
                location: tourForm.location,
                price: tourForm.price,
                description: tourForm.description,
                from_datetime: tourForm.from_datetime,
                to_datetime: tourForm.to_datetime,
                participents_limit: tourForm.participents_limit
            });

            Object.keys(payload).forEach(key => {
                formData.append(key, payload[key]);
            });
            
            if (tourForm.image) {
                formData.append('image', tourForm.image);
            }

            createTourMutation.mutate(formData);
        } catch (error) {
            console.error('Помилка:', error);
            toast.error('Сталася помилка при додаванні туру');
        }
    };

    const handleFileChange = (e, setForm, form) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, image: file });
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <main className="min-h-screen bg-black text-white pt-20 p-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold mb-8 text-center">Адмін панель</h2>
                
                <div className="flex gap-4 mb-8 justify-center">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                            activeTab === 'bookings' 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        Бронювання
                    </button>
                    <button
                        onClick={() => setActiveTab('hotels')}
                        className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                            activeTab === 'hotels' 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        Готелі
                    </button>
                    <button
                        onClick={() => setActiveTab('tours')}
                        className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                            activeTab === 'tours' 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        Тури
                    </button>
                </div>

                {activeTab === 'bookings' && (
                    <section id="admin">
                        <div className="bg-gray-900 rounded-3xl p-6">
                            <div className="flex gap-4 mb-6 justify-center">
                                <button
                                    onClick={() => setBookingType('hotels')}
                                    className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                                        bookingType === 'hotels' 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                                >
                                    Бронювання готелів
                                </button>
                                <button
                                    onClick={() => setBookingType('tours')}
                                    className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                                        bookingType === 'tours' 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
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
                                    <table className="w-full booking-table" cellSpacing="0" cellPadding="0">
                                        <thead>
                                            <tr className="border-b border-gray-700">
                                                <th className="px-6 py-4 text-left">ID бронювання</th>
                                                <th className="px-6 py-4 text-left">{bookingType === 'hotels' ? 'ID готелю' : 'ID туру'}</th>
                                                <th className="px-6 py-4 text-left">ID користувача</th>
                                                {bookingType === 'hotels' ? (
                                                    <>
                                                        <th className="px-6 py-4 text-left">Дата заїзду</th>
                                                        <th className="px-6 py-4 text-left">Дата виїзду</th>
                                                    </>
                                                ) : (
                                                    <>
                                                        <th className="px-6 py-4 text-left">Кількість людей</th>
                                                    </>
                                                )}
                                                <th className="px-6 py-4 text-left">Дії</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookingsData && bookingsData.map(booking => (
                                                <tr key={booking.id} className="border-b border-gray-700 hover:bg-gray-800">
                                                    <td className="px-6 py-4">{booking.public_id}</td>
                                                    <td className="px-6 py-4">{bookingType === 'hotels' ? booking.hotel_id : booking.tour_id}</td>
                                                    <td className="px-6 py-4">{booking.user_id}</td>
                                                    {bookingType === 'hotels' ? (
                                                        <>
                                                            <td className="px-6 py-4">{formatDate(booking.from_date)}</td>
                                                            <td className="px-6 py-4">{formatDate(booking.to_date)}</td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td className="px-20 py-4">{booking.number_of_people}</td>
                                                        </>
                                                    )}
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2">
                                                            <button className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700">
                                                                👁️
                                                            </button>
                                                            <button className="p-2 bg-yellow-600 rounded-lg hover:bg-yellow-700">
                                                                ✏️
                                                            </button>
                                                            <button className="p-2 bg-red-600 rounded-lg hover:bg-red-700">
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </td>
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
                        <div className="bg-gray-900 rounded-3xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-semibold">Управління готелями</h3>
                                <button
                                    onClick={() => setShowHotelModal(true)}
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
                            ) : hotelsData && hotelsData.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full" cellSpacing="0" cellPadding="0">
                                        <thead>
                                            <tr className="border-b border-gray-700">
                                                <th className="px-6 py-4 text-left">Назва</th>
                                                <th className="px-6 py-4 text-left">Розташування</th>
                                                <th className="px-6 py-4 text-left">Ціна</th>
                                                <th className="px-6 py-4 text-left">Дії</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {hotelsData.map(hotel => (
                                                <tr key={hotel.id} className="border-b border-gray-700 hover:bg-gray-800">
                                                    <td className="px-6 py-4">{hotel.title}</td>
                                                    <td className="px-6 py-4">{hotel.location}</td>
                                                    <td className="px-6 py-4">{hotel.price} ₴</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2">
                                                            <button className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700">
                                                                👁️
                                                            </button>
                                                            <button className="p-2 bg-yellow-600 rounded-lg hover:bg-yellow-700">
                                                                ✏️
                                                            </button>
                                                            <button className="p-2 bg-red-600 rounded-lg hover:bg-red-700">
                                                                🗑️
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
                        <div className="bg-gray-900 rounded-3xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-semibold">Управління турами</h3>
                                <button
                                    onClick={() => setShowTourModal(true)}
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
                            ) : toursData && toursData.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full" cellSpacing="0" cellPadding="0">
                                        <thead>
                                            <tr className="border-b border-gray-700">
                                                <th className="px-6 py-4 text-left">Назва</th>
                                                <th className="px-6 py-4 text-left">Розташування</th>
                                                <th className="px-6 py-4 text-left">Ціна</th>
                                                <th className="px-6 py-4 text-left">Дії</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {toursData.map(tour => (
                                                <tr key={tour.id} className="border-b border-gray-700 hover:bg-gray-800">
                                                    <td className="px-6 py-4">{tour.title}</td>
                                                    <td className="px-6 py-4">{tour.location}</td>
                                                    <td className="px-6 py-4">{tour.price} ₴</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2">
                                                            <button className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700">
                                                                👁️
                                                            </button>
                                                            <button className="p-2 bg-yellow-600 rounded-lg hover:bg-yellow-700">
                                                                ✏️
                                                            </button>
                                                            <button className="p-2 bg-red-600 rounded-lg hover:bg-red-700">
                                                                🗑️
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
            
            {showHotelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-semibold">Додати готель</h3>
                            <button onClick={() => setShowHotelModal(false)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleHotelSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Назва готелю</label>
                                <input
                                    type="text"
                                    value={hotelForm.title}
                                    onChange={(e) => setHotelForm({...hotelForm, title: e.target.value})}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-2xl text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Місце розташування</label>
                                <input
                                    type="text"
                                    value={hotelForm.location}
                                    onChange={(e) => setHotelForm({...hotelForm, location: e.target.value})}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-2xl text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Ціна за ніч (₴)</label>
                                <input
                                    type="number"
                                    value={hotelForm.price}
                                    onChange={(e) => setHotelForm({...hotelForm, price: e.target.value})}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-2xl text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Опис</label>
                                <textarea
                                    value={hotelForm.description}
                                    onChange={(e) => setHotelForm({...hotelForm, description: e.target.value})}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-2xl text-white"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Зображення</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-2xl cursor-pointer">
                                        <Image className="w-5 h-5" />
                                        {hotelForm.image ? 'Змінити зображення' : 'Обрати зображення'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, setHotelForm, hotelForm)}
                                            className="hidden"
                                            required
                                        />
                                    </label>
                                    {hotelForm.image && (
                                        <span className="text-green-400">{hotelForm.image.name}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={createHotelMutation.isLoading}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-2xl disabled:opacity-50"
                                >
                                    {createHotelMutation.isLoading ? 'Додавання...' : 'Додати готель'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowHotelModal(false)}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-2xl"
                                >
                                    Скасувати
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showTourModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-semibold">Додати тур</h3>
                            <button onClick={() => setShowTourModal(false)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleTourSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Назва туру</label>
                                <input
                                    type="text"
                                    value={tourForm.title}
                                    onChange={(e) => setTourForm({...tourForm, title: e.target.value})}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-2xl text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Місце проведення</label>
                                <input
                                    type="text"
                                    value={tourForm.location}
                                    onChange={(e) => setTourForm({...tourForm, location: e.target.value})}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-2xl text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Ціна (₴)</label>
                                <input
                                    type="number"
                                    value={tourForm.price}
                                    onChange={(e) => setTourForm({...tourForm, price: e.target.value})}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-2xl text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Опис</label>
                                <textarea
                                    value={tourForm.description}
                                    onChange={(e) => setTourForm({...tourForm, description: e.target.value})}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-2xl text-white"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Початок</label>
                                    <input
                                        type="datetime-local"
                                        value={tourForm.from_datetime}
                                        onChange={(e) => setTourForm({...tourForm, from_datetime: e.target.value})}
                                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-2xl text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Кінець</label>
                                    <input
                                        type="datetime-local"
                                        value={tourForm.to_datetime}
                                        onChange={(e) => setTourForm({...tourForm, to_datetime: e.target.value})}
                                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-2xl text-white"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Ліміт учасників</label>
                                <input
                                    type="number"
                                    value={tourForm.participents_limit}
                                    onChange={(e) => setTourForm({...tourForm, participents_limit: e.target.value})}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-2xl text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Зображення</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-2xl cursor-pointer">
                                        <Image className="w-5 h-5" />
                                        {tourForm.image ? 'Змінити зображення' : 'Обрати зображення'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, setTourForm, tourForm)}
                                            className="hidden"
                                            required
                                        />
                                    </label>
                                    {tourForm.image && (
                                        <span className="text-green-400">{tourForm.image.name}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={createTourMutation.isLoading}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-2xl disabled:opacity-50"
                                >
                                    {createTourMutation.isLoading ? 'Додавання...' : 'Додати тур'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowTourModal(false)}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-2xl"
                                >
                                    Скасувати
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default AdminPage;