import React from 'react';
import { X } from 'lucide-react';

const DeleteConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message,
    isLoading = false 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-3xl p-8 max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-red-600">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <p className="text-gray-300 mb-8">{message}</p>
                
                <div className="flex gap-4">
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-2xl disabled:opacity-50"
                    >
                        {isLoading ? 'Видалення...' : 'Так, видалити'}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-2xl"
                    >
                        Скасувати
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;