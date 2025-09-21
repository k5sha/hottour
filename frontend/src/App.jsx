import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FAQPage from './pages/FAQPage';
import NotFoundPage from './pages/NotFoundPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminPage from './pages/AdminPage';
import { AddToken } from './utils/auth';
import axios from 'axios';
import { BACKEND_API } from './utils/config';

const App = () => {
  const { pathname } = useLocation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const body = AddToken({});
        if (body.auth_token) {
          const response = await axios.post(`${BACKEND_API}/api/me`, body);
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Помилка отримання даних користувача:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <Header userData={userData} setUserData={setUserData} />
      <Routes>
        <Route path="/" element={<HomePage userData={userData} />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/regist" element={<RegisterPage/>} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage userData={userData} />} />
        <Route 
          path="/admin" 
          element={
            userData?.is_admin === 1 ? (
              <AdminPage userData={userData} />
            ) : (
              <NotFoundPage />
            )
          } 
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;