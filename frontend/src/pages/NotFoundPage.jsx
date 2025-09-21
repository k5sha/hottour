import React from 'react';
import { Link } from 'react-router';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] bg-black text-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Сторінку не знайдено</h2>
        <p className="text-gray-400 mb-8">
          Вибачте, але сторінка, яку ви шукаєте, не існує.
        </p>
        <Link
          to="/"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
        >
          Повернутися на головну
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;