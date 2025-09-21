import React, { useState, useEffect } from 'react';
import { X, Image } from 'lucide-react';
import axios from 'axios';
import { BACKEND_API } from '../../utils/config';
import { AddToken } from '../../utils/auth';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const AddHotelModal = ({ isOpen, onClose, editingHotel }) => {
    const queryClient = useQueryClient();
    
    const [hotelForm, setHotelForm] = useState({
        title: '',
        location: '',
        price: '',
        description: '',
        image: null
    });

    useEffect(() => {
        if (editingHotel) {
            setHotelForm({
                title: editingHotel.title || '',
                location: editingHotel.location || '',
                price: editingHotel.price || '',
                description: editingHotel.description || '',
                image: null
            });
        } else {
            setHotelForm({
                title: '',
                location: '',
                price: '',
                description: '',
                image: null
            });
        }
    }, [editingHotel, isOpen]);

    const createHotelMutation = useMutation({
        mutationFn: (formData) => {
            const url = editingHotel 
                ? `${BACKEND_API}/api/hotel/edit` 
                : `${BACKEND_API}/api/hotel/create`;
            return axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
        },
        onSuccess: () => {
            toast.success(editingHotel ? 'Готель успішно оновлено!' : 'Готель успішно додано!');
            onClose();
            queryClient.invalidateQueries(['hotels']);
        },
        onError: (error) => {
            console.error('Помилка:', error);
            toast.error(editingHotel ? 'Помилка при оновленні готелю' : 'Помилка при додаванні готелю');
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

            if (editingHotel) {
                payload.public_id = editingHotel.public_id;
            }

            Object.keys(payload).forEach(key => {
                formData.append(key, payload[key]);
            });
            
            if (hotelForm.image) {
                formData.append('image', hotelForm.image);
            }

            createHotelMutation.mutate(formData);
        } catch (error) {
            console.error('Помилка:', error);
            toast.error('Сталася помилка');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setHotelForm({ ...hotelForm, image: file });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold">
                        {editingHotel ? 'Редагувати готель' : 'Додати готель'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
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
                                    onChange={handleFileChange}
                                    className="hidden"
                                    required={!editingHotel}
                                />
                            </label>
                            {hotelForm.image && (
                                <span className="text-green-400">{hotelForm.image.name}</span>
                            )}
                            {editingHotel && !hotelForm.image && (
                                <span className="text-gray-400">Поточне зображення буде збережено</span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={createHotelMutation.isLoading}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-2xl disabled:opacity-50"
                        >
                            {createHotelMutation.isLoading 
                                ? (editingHotel ? 'Оновлення...' : 'Додавання...') 
                                : (editingHotel ? 'Оновити готель' : 'Додати готель')
                            }
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-2xl"
                        >
                            Скасувати
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHotelModal;