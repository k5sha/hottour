import React from 'react';
import { Routes, Route, useLocation } from 'react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FAQPage from './pages/FAQPage';
import AdminPage from './pages/AdminPage';
import { useEffect } from 'react';

const App = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/regist" element={<RegisterPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;