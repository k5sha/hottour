import React, { useState } from 'react';
import { Link } from 'react-router';
import { UserPlus, Eye, EyeOff, Mail, Phone, Lock, User, Calendar, ArrowRight, Venus, Mars } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { BACKEND_API } from '../utils/config';
import { SetToken } from '../utils/auth';
import toast from 'react-hot-toast';

const initialFormData = {
    email: '', 
    phone: '+380', 
    password: '', 
    full_name: '', 
    sex: '', 
    birth_date: ''
};

const RegisterPage = () => {
    const mutation = useMutation({
        mutationFn: (newUser) => {
            return axios.post(`${BACKEND_API}/auth/register`, newUser);
        },
        onSuccess: (res) => {
            console.log(res);
            SetToken(res.data.auth_token);
            toast.success('Ура! Користувача успішно зареєстровано!');
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        },
        onError: (error) => {
            console.error('Помилка реєстрації:', error);
            
            if (error.response?.data?.error) {
                toast.error(`Помилка: ${error.response.data.error}`);
            } else if (error.response?.data?.message) {
                toast.error(`Помилка: ${error.response.data.message}`);
            } else if (error.code === 'NETWORK_ERROR') {
                toast.error('Помилка мережі. Перевірте підключення до інтернету.');
            } else {
                toast.error('Сталася невідома помилка при реєстрації!');
            }
        },
    });
  
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({});

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'email':
                if (!value) error = 'Це поле є обов\'язковим.';
                else if (!/\S+@\S+\.\S+/.test(value)) error = 'Будь ласка, введіть коректний email.';
                break;
            case 'phone':
                if (!value) error = 'Це поле є обов\'язковим.';
                else if (!isValidPhoneNumber(value)) error = 'Будь ласка, введіть коректний номер телефону.';
                break;
            case 'password':
                if (!value) error = 'Це поле є обов\'язковим.';
                else if (value.length < 6) error = 'Пароль має бути не менше 6 символів.';
                break;
            case 'full_name':
                if (!value.trim()) error = 'Це поле є обов\'язковим.';
                else if (value.trim().split(' ').length < 2) error = 'Будь ласка, введіть повне ім\'я (ім\'я та прізвище).';
                break;
            case 'sex':
                if (!value) error = 'Будь ласка, оберіть вашу стать.';
                break;
            case 'birth_date':
                if (!value) error = 'Будь ласка, оберіть дату народження.';
                else if (new Date(value) > new Date()) error = 'Дата народження не може бути у майбутньому.';
                else {
                    const birthDate = new Date(value);
                    const age = Math.floor((new Date() - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
                    if (age < 18) error = 'Вам має бути не менше 18 років.';
                }
                break;
            default:
                break;
        }
        return error;
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, formData[name]) }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (touched[name]) {
            setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
        }
    };

    const handlePhoneChange = (value) => {
        if (!value) return;
        setFormData(prev => ({ ...prev, phone: value }));
        
        if (touched.phone) {
            setErrors(prev => ({ ...prev, phone: validateField('phone', value) }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const allTouched = Object.keys(formData).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});
        setTouched(allTouched);
        
        let formIsValid = true;
        const newErrors = {};

        Object.keys(formData).forEach(name => {
            const error = validateField(name, formData[name]);
            if (error) {
                formIsValid = false;
                newErrors[name] = error;
            }
        });

        setErrors(newErrors);

        if (formIsValid) {
            toast.loading('Реєстрація...', { id: 'register' });
            mutation.mutate(formData);
        } else {
            toast.error('Будь ласка, виправте помилки в формі.');
        }
    };

    const getInputClassName = (fieldName) => {
        const baseClass = "w-full pl-12 pr-4 py-3 bg-gray-800 border rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300";
        
        if (errors[fieldName] && touched[fieldName]) {
            return `${baseClass} border-red-500`;
        } else if (touched[fieldName] && !errors[fieldName]) {
            return `${baseClass} border-green-500`;
        }
        return `${baseClass} border-gray-700`;
    };

    return (
        <div className="min-h-screen bg-black text-white pt-20">
            <main className="max-w-2xl mx-auto px-4 py-16">
                <div className="bg-gray-900 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 bg-indigo-900/30 px-6 py-3 rounded-full mb-4">
                            <UserPlus className="w-6 h-6" />
                            <h2 className="text-3xl font-bold">Реєстрація</h2>
                        </div>
                        <p className="text-gray-400">Створіть обліковий запис для доступу до всіх послуг</p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="space-y-6">
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-2">
                                ПІБ
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="full_name"
                                    id="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={getInputClassName('full_name')}
                                    placeholder="Євтушенко Юрій Олексійович"
                                />
                            </div>
                            {errors.full_name && touched.full_name && (
                                <p className="text-red-400 text-sm mt-1">{errors.full_name}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={getInputClassName('email')}
                                        placeholder="your@email.com"
                                    />
                                </div>
                                {errors.email && touched.email && (
                                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                                    Номер телефону
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                                    <PhoneInput
                                        name="phone"
                                        id="phone"
                                        defaultCountry="UA"
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                                        className={`${getInputClassName('phone')} pl-12`}
                                        placeholder="+380123456789"
                                    />
                                </div>
                                {errors.phone && touched.phone && (
                                    <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Пароль
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={getInputClassName('password')}
                                    placeholder="Мінімум 6 символів"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && touched.password && (
                                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Стать
                                </label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sex"
                                            value="male"
                                            checked={formData.sex === 'male'}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 focus:ring-indigo-500 cursor-pointer"
                                        />
                                        <Mars className="w-4 h-4 text-blue-400" />
                                        <span>Чоловік</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sex"
                                            value="female"
                                            checked={formData.sex === 'female'}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 focus:ring-indigo-500 cursor-pointer"
                                        />
                                        <Venus className="w-4 h-4 text-pink-400" />
                                        <span>Жінка</span>
                                    </label>
                                </div>
                                {errors.sex && touched.sex && (
                                    <p className="text-red-400 text-sm mt-1">{errors.sex}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="birth_date" className="block text-sm font-medium text-gray-300 mb-2">
                                    Дата народження
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="date"
                                        name="birth_date"
                                        id="birth_date"
                                        value={formData.birth_date}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={getInputClassName('birth_date')}
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                {errors.birth_date && touched.birth_date && (
                                    <p className="text-red-400 text-sm mt-1">{errors.birth_date}</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:gap-3 transform hover:scale-105 disabled:transform-none disabled:hover:gap-2 disabled:cursor-not-allowed"
                        >
                            {mutation.isPending ? 'Обробка...' : 'Зареєструватися'}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-gray-400">
                            Вже маєте акаунт?{' '}
                            <Link
                                to="/login"
                                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors duration-300"
                            >
                                Увійти
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RegisterPage;