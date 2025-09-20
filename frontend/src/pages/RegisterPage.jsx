import React, { useState } from 'react';
import { Link } from 'react-router';
import { UserPlus, Eye, EyeOff, Mail, Phone, Lock, User, Calendar, ArrowRight, Venus, Mars } from 'lucide-react';
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const initialFormData = {
    email: '', 
    phone: '+380', 
    password: '', 
    lastName: '', 
    firstName: '',
    middleName: '', 
    sex: '', 
    birthDate: ''
};

const RegisterPage = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            case 'lastName':
            case 'firstName':
            case 'middleName':
                if (!value.trim()) error = 'Це поле є обов\'язковим.';
                break;
            case 'sex':
                if (!value) error = 'Будь ласка, оберіть вашу стать.';
                break;
            case 'birthDate':
                if (!value) error = 'Будь ласка, оберіть дату народження.';
                else if (new Date(value) > new Date()) error = 'Дата народження не може бути у майбутньому.';
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handlePhoneChange = (e) => {
        if (!e) return
        console.log(e)
        const value = e
        setFormData(prev => ({ ...prev, phone: value }));
        setErrors(prev => ({ ...prev, phone: validateField('phone', value) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
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
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert('Реєстрація успішна!');
            setFormData(initialFormData);
        }
        
        setIsSubmitting(false);
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                                    Прізвище
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="lastName"
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                        placeholder="Прізвище"
                                    />
                                </div>
                                {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                            </div>

                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                                    Ім'я
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                        placeholder="Ім'я"
                                    />
                                </div>
                                {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                            </div>

                            <div>
                                <label htmlFor="middleName" className="block text-sm font-medium text-gray-300 mb-2">
                                    По батькові
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="middleName"
                                        id="middleName"
                                        value={formData.middleName}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                        placeholder="По батькові"
                                    />
                                </div>
                                {errors.middleName && <p className="text-red-400 text-sm mt-1">{errors.middleName}</p>}
                            </div>
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
                                        className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                                    Номер телефону
                                </label>
                                <div className="relative">
                                    <PhoneInput
                                        name="phone"
                                        id="phone"
                                        defaultCountry="UA"
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        className="w-full pl-4 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                        placeholder="+380123456789"
                                    />
                                </div>
                                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
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
                                    className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
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
                            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Стать
                                </label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="sex"
                                            value="male"
                                            checked={formData.sex === 'male'}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 focus:ring-indigo-500"
                                        />
                                        <Mars className="w-4 h-4 text-blue-400" />
                                        Чоловік
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="sex"
                                            value="female"
                                            checked={formData.sex === 'female'}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 focus:ring-indigo-500"
                                        />
                                        <Venus className="w-4 h-4 text-pink-400" />
                                        Жінка
                                    </label>
                                </div>
                                {errors.sex && <p className="text-red-400 text-sm mt-1">{errors.sex}</p>}
                            </div>

                            <div>
                                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-300 mb-2">
                                    Дата народження
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="date"
                                        name="birthDate"
                                        id="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                    />
                                </div>
                                {errors.birthDate && <p className="text-red-400 text-sm mt-1">{errors.birthDate}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:gap-3 transform hover:scale-105 disabled:transform-none disabled:hover:gap-2"
                        >
                            {isSubmitting ? 'Обробка...' : 'Зареєструватися'}
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