import React, { useState, useEffect } from 'react';
import { X, Image } from 'lucide-react';
import axios from 'axios';
import { BACKEND_API } from '../../utils/config';
import { AddToken } from '../../utils/auth';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const AddTourModal = ({ isOpen, onClose, editingTour }) => {
    const queryClient = useQueryClient();
    
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

    const convertToLocalDatetime = (dateString) => {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        return localDate.toISOString().slice(0, 16);
    };

    useEffect(() => {
        if (editingTour) {
            setTourForm({
                title: editingTour.title || '',
                location: editingTour.location || '',
                price: editingTour.price || '',
                description: editingTour.description || '',
                image: null,
                from_datetime: convertToLocalDatetime(editingTour.from_datetime),
                to_datetime: convertToLocalDatetime(editingTour.to_datetime),
                participents_limit: editingTour.participents_limit || ''
            });
        } else {
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
        }
    }, [editingTour, isOpen]);

    const createTourMutation = useMutation({
        mutationFn: (formData) => {
            const url = editingTour 
                ? `${BACKEND_API}/api/tour/edit` 
                : `${BACKEND_API}/api/tour/create`;
            return axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
        },
        onSuccess: () => {
            toast.success(editingTour ? 'Тур успішно оновлено!' : 'Тур успішно додано!');
            onClose();
            queryClient.invalidateQueries(['tours']);
        },
        onError: (error) => {
            console.error('Помилка:', error);
            toast.error(editingTour ? 'Помилка при оновленні туру' : 'Помилка при додаванні туру');
        }
    });

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

            if (editingTour) {
                payload.public_id = editingTour.public_id;
            }

            Object.keys(payload).forEach(key => {
                formData.append(key, payload[key]);
            });
            
            if (tourForm.image) {
                formData.append('image', tourForm.image);
            }

            createTourMutation.mutate(formData);
        } catch (error) {
            console.error('Помилка:', error);
            toast.error('Сталася помилка');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTourForm({ ...tourForm, image: file });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold">
                        {editingTour ? 'Редагувати тур' : 'Додати тур'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
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
                                    onChange={handleFileChange}
                                    className="hidden"
                                    required={!editingTour}
                                />
                            </label>
                            {tourForm.image && (
                                <span className="text-green-400">{tourForm.image.name}</span>
                            )}
                            {editingTour && !tourForm.image && (
                                <span className="text-gray-400">Поточне зображення буде збережено</span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={createTourMutation.isLoading}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-2xl disabled:opacity-50"
                        >
                            {createTourMutation.isLoading 
                                ? (editingTour ? 'Оновлення...' : 'Додавання...') 
                                : (editingTour ? 'Оновити тур' : 'Додати тур')
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

export default AddTourModal;