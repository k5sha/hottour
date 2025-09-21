import React, { useState } from 'react';
import { Link } from 'react-router'; 
import { Eye, EyeOff, LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import axios from "axios"
import { useMutation } from "@tanstack/react-query"
import { BACKEND_API } from '../utils/config';
import { SetToken } from '../utils/auth';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const mutation = useMutation({
        mutationFn: (newUser) => {
            return axios.post(`${BACKEND_API}/auth/login`, newUser)
        },
        onSuccess: (res) => {
            console.log(res)
            if (res.data.ok) {
                SetToken(res.data.auth_token)
                toast.success('Успішний вхід!');
                
                setTimeout(() => {
                     window.location.href = '/';
                }, 1000);
            } else {
                handleServerError(res.data.error);
            }
        },
        onError: (error) => {
            console.log(error)
            if (error.response?.data?.error) {
                handleServerError(error.response.data.error);
            } else {
                toast.error('Сталася якась помилка!');
            }
        },
    });

    const handleServerError = (errorCode) => {
        switch (errorCode) {
            case 'user_not_found':
                toast.error('Користувача з таким логіном не знайдено');
                break;
            case 'wrong_password':
                toast.error('Неправильний пароль');
                break;
            default:
                toast.error('Сталася невідома помилка. Спробуйте ще раз');
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Базовая валидация
        if (!formData.login.trim()) {
            toast.error('Будь ласка, введіть логін');
            return;
        }
        if (!formData.password.trim()) {
            toast.error('Будь ласка, введіть пароль');
            return;
        }
        
        mutation.mutate(formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-black text-white pt-20">
            <main className="max-w-md mx-auto px-4 py-16">
                <div className="bg-gray-900 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 bg-indigo-900/30 px-6 py-3 rounded-full mb-4">
                            <LogIn className="w-6 h-6" />
                            <h2 className="text-3xl font-bold">Вхід</h2>
                        </div>
                        <p className="text-gray-400">Увійдіть у свій акаунт для продовження</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="login" className="block text-sm font-medium text-gray-300">
                                Логін або Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="login"
                                    id="login"
                                    required
                                    value={formData.login}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Ваш логін або email"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Пароль
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    id="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Введіть ваш пароль"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-gray-300">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 rounded focus:ring-indigo-500"
                                />
                                Запам'ятати мене
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-300"
                            >
                                Забули пароль?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:gap-3 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                        >
                            {mutation.isPending ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    Увійти
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-gray-400">
                            Ще не маєте акаунту?{' '}
                            <Link
                                to="/regist"
                                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors duration-300"
                            >
                                Зареєструватися
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;