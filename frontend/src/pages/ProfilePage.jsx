import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { AddToken } from '../utils/auth';
import axios from 'axios';
import { Edit, Mail, Phone, User, Save, X, Calendar, Venus, Mars, Lock, Eye, EyeOff } from 'lucide-react';
import { BACKEND_API } from '../utils/config';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const ProfilePage = ({ userData, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '+380',
    sex: '',
    birth_date: '',
    new_password: '',
    confirm_password: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (userData) {
      setFormData({
        full_name: userData?.full_name || '',
        email: userData?.email || '',
        phone: userData?.phone || '+380',
        sex: userData?.sex || '',
        birth_date: userData?.birth_date || '',
        new_password: '',
        confirm_password: ''
      });
    }
  }, [userData]);

  const updateSettingsMutation = useMutation({
    mutationFn: (settingsData) => {
      const payload = AddToken({
        public_id: userData.public_id,
        ...settingsData
      });
      return axios.post(`${BACKEND_API}/api/settings`, payload);
    },
    onSuccess: (response) => {
      if (response.data.ok) {
        if (isChangingPassword) {
          toast.success('Пароль успішно змінено!');
        } else {
          toast.success('Профіль успішно оновлено!');
        }
        
        setIsEditing(false);
        setIsChangingPassword(false);
        queryClient.invalidateQueries(['user']);
        setFormData(prev => ({
          ...prev,
          new_password: '',
          confirm_password: ''
        }));
        
        queryClient.setQueryData(['user'], (oldData) => ({
          ...oldData,
          ...response.data.user
        }));
        
        if (onUpdateUser) {
          onUpdateUser(response.data.user);
        }

        window.location.reload();
      }
    },
    onError: (error) => {
      console.error('Помилка оновлення:', error);
      if (error.response?.data?.error) {
        toast.error(`Помилка: ${error.response.data.error}`);
      } else if (error.response?.data?.message) {
        toast.error(`Помилка: ${error.response.data.message}`);
      } else {
        toast.error(`Помилка при ${isChangingPassword ? 'зміні пароля' : 'оновленні профілю'}`);
      }
    }
  });

  const validateField = (name, value, allData = formData) => {
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
      case 'new_password':
        if (isChangingPassword && !value) error = 'Це поле є обов\'язковим.';
        else if (isChangingPassword && value.length < 6) error = 'Пароль має бути не менше 6 символів.';
        break;
      case 'confirm_password':
        if (isChangingPassword && !value) error = 'Це поле є обов\'язковим.';
        else if (isChangingPassword && value !== allData.new_password) error = 'Паролі не співпадають.';
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, formData[name]) }));
  };

  const getInputClassName = (fieldName) => {
    const baseClass = "w-full bg-gray-800 border rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300";
    
    if (errors[fieldName] && touched[fieldName]) {
      return `${baseClass} border-red-500`;
    } else if (touched[fieldName] && !errors[fieldName]) {
      return `${baseClass} border-green-500`;
    }
    return `${baseClass} border-gray-700`;
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = () => {
    if (!userData) return;

    const fieldsToValidate = isChangingPassword 
      ? ['new_password', 'confirm_password']
      : ['full_name', 'email', 'phone', 'sex', 'birth_date'];

    const allTouched = fieldsToValidate.reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    let formIsValid = true;
    const newErrors = {};

    fieldsToValidate.forEach(name => {
      const error = validateField(name, formData[name]);
      if (error) {
        formIsValid = false;
        newErrors[name] = error;
      }
    });

    setErrors(newErrors);

    if (formIsValid) {
      const dataToSend = {};
      
      if (isChangingPassword) {
        dataToSend.password = formData.new_password;
      } else {
        const profileFields = ['full_name', 'email', 'phone', 'sex', 'birth_date'];
        profileFields.forEach(field => {
          if (formData[field] !== userData[field]) {
            dataToSend[field] = formData[field];
          }
        });
      }

      if (Object.keys(dataToSend).length > 0) {
        updateSettingsMutation.mutate(dataToSend);
      } else {
        toast.info('Немає змін для збереження');
        handleCancel();
      }
    } else {
      toast.error('Будь ласка, виправте помилки в формі.');
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: userData?.full_name || '',
      email: userData?.email || '',
      phone: userData?.phone || '+380',
      sex: userData?.sex || '',
      birth_date: userData?.birth_date || '',
      new_password: '',
      confirm_password: ''
    });
    setErrors({});
    setTouched({});
    setIsEditing(false);
    setIsChangingPassword(false);
  };

  const startPasswordChange = () => {
    setIsChangingPassword(true);
    setIsEditing(false);
    // Очищаємо поля паролів при початку зміни
    setFormData(prev => ({
      ...prev,
      new_password: '',
      confirm_password: ''
    }));
  };

  const startProfileEdit = () => {
    setIsEditing(true);
    setIsChangingPassword(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не вказано';
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-400">Будь ласка, увійдіть в систему для перегляду профілю</p>
          <Link 
            to="/login" 
            className="inline-block mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl transition-colors"
          >
            Увійти
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gray-900 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Мій профіль</h1>
            {!isEditing && !isChangingPassword ? (
              <div className="flex gap-3">
                <button
                  onClick={startProfileEdit}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-2xl transition-colors"
                >
                  <Edit className="w-5 h-5" />
                  Редагувати профіль
                </button>
                <button
                  onClick={startPasswordChange}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-2xl transition-colors"
                >
                  <Lock className="w-5 h-5" />
                  Змінити пароль
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={updateSettingsMutation.isPending}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-2xl transition-colors disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {updateSettingsMutation.isPending ? 'Збереження...' : 'Зберегти'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-2xl transition-colors"
                >
                  <X className="w-5 h-5" />
                  Скасувати
                </button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold">
                  {userData.full_name ? userData.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-2">{userData.full_name || 'Користувач'}</h2>
              <p className="text-gray-400">{userData.is_admin === 1 ? 'Адміністратор' : 'Користувач'}</p>
            </div>

            <div className="md:col-span-2 space-y-6">
              {/* Поля профілю */}
              {!isChangingPassword && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">ПІБ</label>
                      {isEditing ? (
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={getInputClassName('full_name') + ' pl-12'}
                            placeholder="Євтушенко Юрій Олексійович"
                          />
                        </div>
                      ) : (
                        <p className="text-white text-lg">{userData.full_name || 'Не вказано'}</p>
                      )}
                      {errors.full_name && touched.full_name && (
                        <p className="text-red-400 text-sm mt-1">{errors.full_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Телефон</label>
                      {isEditing ? (
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                          <PhoneInput
                            name="phone"
                            defaultCountry="UA"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                            className={getInputClassName('phone') + ' pl-12'}
                            placeholder="+380123456789"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-white text-lg">{userData.phone || 'Не вказано'}</span>
                        </div>
                      )}
                      {errors.phone && touched.phone && (
                        <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    {isEditing ? (
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={getInputClassName('email') + ' pl-12'}
                          placeholder="your@email.com"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-white text-lg">{userData.email}</span>
                      </div>
                    )}
                    {errors.email && touched.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Стать</label>
                      {isEditing ? (
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="sex"
                              value="male"
                              checked={formData.sex === 'male'}
                              onChange={handleInputChange}
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
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                              className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 focus:ring-indigo-500 cursor-pointer"
                            />
                            <Venus className="w-4 h-4 text-pink-400" />
                            <span>Жінка</span>
                          </label>
                        </div>
                      ) : (
                        <p className="text-white text-lg">
                          {userData.sex === 'male' ? 'Чоловік' : 
                           userData.sex === 'female' ? 'Жінка' : 'Не вказано'}
                        </p>
                      )}
                      {errors.sex && touched.sex && (
                        <p className="text-red-400 text-sm mt-1">{errors.sex}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Дата народження</label>
                      {isEditing ? (
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            name="birth_date"
                            value={formData.birth_date}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={getInputClassName('birth_date') + ' pl-12'}
                            max={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      ) : (
                        <p className="text-white text-lg">{formatDate(userData.birth_date)}</p>
                      )}
                      {errors.birth_date && touched.birth_date && (
                        <p className="text-red-400 text-sm mt-1">{errors.birth_date}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Розділ зміни пароля */}
              {isChangingPassword && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Новий пароль</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={getInputClassName('new_password') + ' pl-12 pr-12'}
                        placeholder="Мінімум 6 символів"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.new_password && touched.new_password && (
                      <p className="text-red-400 text-sm mt-1">{errors.new_password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Підтвердіть новий пароль</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={getInputClassName('confirm_password') + ' pl-12 pr-12'}
                        placeholder="Повторіть новий пароль"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirm_password && touched.confirm_password && (
                      <p className="text-red-400 text-sm mt-1">{errors.confirm_password}</p>
                    )}
                  </div>
                </div>
              )}

              {!isEditing && !isChangingPassword && (
                <div className="pt-6 border-t border-gray-800">
                  <h3 className="text-lg font-semibold mb-4">Статистика</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-800 rounded-2xl">
                      <div className="text-2xl font-bold text-indigo-400">0</div>
                      <div className="text-sm text-gray-400">Бронювань</div>
                    </div>
                    <div className="text-center p-4 bg-gray-800 rounded-2xl">
                      <div className="text-2xl font-bold text-green-400">0</div>
                      <div className="text-sm text-gray-400">Подорожей</div>
                    </div>
                    <div className="text-center p-4 bg-gray-800 rounded-2xl">
                      <div className="text-2xl font-bold text-yellow-400">0</div>
                      <div className="text-sm text-gray-400">Відгуків</div>
                    </div>
                    <div className="text-center p-4 bg-gray-800 rounded-2xl">
                      <div className="text-2xl font-bold text-purple-400">0</div>
                      <div className="text-sm text-gray-400">Знижок</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;