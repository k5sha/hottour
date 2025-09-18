import React, { useState, useEffect, useRef } from 'react';
import Input from '../components/Input';

const initialFormData = {
    email: '', phone: '', password: '', lastName: '', firstName: '',
    middleName: '', sex: '', birthDate: '', group: '', fileUpload: null,
};

const serviceOptions = {
    groupA: 'Все-включено',
    groupB: 'Готель + екскурсії',
    groupC: 'Екскурсії',
};

const RegisterPage = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    // const [users, setUsers] = useState([]);
    // const [selectedRows, setSelectedRows] = useState(new Set());

    const phoneInputRef = useRef(null);
    const itiRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (phoneInputRef.current) {
            const iti = window.intlTelInput(phoneInputRef.current, {
                placeholderNumberType: "MOBILE",
                nationalMode: false,
                initialCountry: 'ua',
                utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js'
            });
            itiRef.current = iti;

            phoneInputRef.current.addEventListener('countrychange', handlePhoneInput);
        }

        return () => {
            if (phoneInputRef.current) {
                phoneInputRef.current.removeEventListener('countrychange', handlePhoneInput);
            }
            itiRef.current?.destroy();
        };
    }, []);

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'email':
                if (!value) error = 'Це поле є обов\'язковим.';
                else if (!/\S+@\S+\.\S+/.test(value)) error = 'Будь ласка, введіть коректний email.';
                break;
            case 'phone':
                { const prefix = `+${itiRef.current?.getSelectedCountryData().dialCode}`;
                if (!value || value === prefix) {
                    error = 'Будь ласка, введіть номер телефону.';
                } else if (!itiRef.current?.isValidNumber()) {
                    error = 'Будь ласка, введіть повний і коректний номер.';
                }
                break; }
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
            case 'group':
                if (!value) error = 'Будь ласка, оберіть пакет послуг.';
                break;
            case 'fileUpload':
                if (!value) error = 'Будь ласка, завантажте файл.';
                break;
            default:
                break;
        }
        return error;
    };

    // const validateAll = () => {
    //     const newErrors = {};

    //     const dataToValidate = {
    //          ...formData,
    //          phone: formData.phone,
    //     };

    //     Object.keys(dataToValidate).forEach(name => {
    //         const error = validateField(name, dataToValidate[name]);
    //         if (error) {
    //             newErrors[name] = error;
    //         }
    //     });

    //     setErrors(newErrors);
    // }

    // useEffect(validateAll, [formData])

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        const fieldValue = type === 'file' ? files[0] : value;
        setFormData(prev => ({ ...prev, [name]: fieldValue }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, fieldValue) }))
    };

    const handlePhoneInput = () => {
        const iti = itiRef.current;
        if (!iti) return;

        const prefix = `+${iti.getSelectedCountryData().dialCode}`;
        let currentValue = phoneInputRef.current.value;

        if (!currentValue.startsWith(prefix)) {
            currentValue = prefix;
        }

        const userNumbers = currentValue.substring(prefix.length).replace(/\D/g, '');
        const newValue = prefix + userNumbers;

        setFormData(prev => ({ ...prev, phone: newValue }));
        setErrors(prev => ({ ...prev, phone: validateField('phone', newValue) }))
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let formIsValid = true;
        const newErrors = {};

        const dataToValidate = {
            ...formData,
            phone: formData.phone,
        };

        Object.keys(dataToValidate).forEach(name => {
            const error = validateField(name, dataToValidate[name]);
            if (error) {
                formIsValid = false;
                newErrors[name] = error;
            }
        });

        setErrors(newErrors);

        // TODO: use API for registration (add some popup)
        if (formIsValid) {
            // const newUser = {
            //     id: Date.now(),
            //     ...dataToValidate,
            //     phone: itiRef.current.getNumber(),
            //     fullName: `${dataToValidate.lastName} ${dataToValidate.firstName} ${dataToValidate.middleName}`.trim(),
            // };
            // setUsers(prev => [...prev, newUser]);
            setFormData(initialFormData);
            fileInputRef.current.value = "";
        }
    };

    // TODO: clear it

    // const handleSelectRow = (userId) => {
    //     const newSelection = new Set(selectedRows);
    //     newSelection.has(userId) ? newSelection.delete(userId) : newSelection.add(userId);
    //     setSelectedRows(newSelection);
    // };

    // const handleSelectAll = (e) => {
    //     setSelectedRows(e.target.checked ? new Set(users.map(u => u.id)) : new Set());
    // };

    // const handleDeleteSelected = () => {
    //     if (window.confirm(`Ви впевнені, що хочете видалити ${selectedRows.size} рядок(ів)?`)) {
    //         setUsers(prev => prev.filter(user => !selectedRows.has(user.id)));
    //         setSelectedRows(new Set());
    //     }
    // };

    // const handleDuplicateSelected = () => {
    //     const duplicates = [];
    //     users.forEach(user => {
    //         if (selectedRows.has(user.id)) {
    //             duplicates.push({ ...user, id: Date.now() + Math.random() });
    //         }
    //     });
    //     setUsers(prev => [...prev, ...duplicates]);
    //     setSelectedRows(new Set());
    // };

    // const canManageRows = selectedRows.size > 0;

    return (
        <main>
            <section id="login">
                <h2>Реєстрація</h2>
                <form onSubmit={handleSubmit} noValidate>
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />

                    <Input
                        label="Номер телефону"
                        ref={phoneInputRef}
                        name="phone"
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onInput={handlePhoneInput}
                        onClick={handlePhoneInput}
                        error={errors.phone}
                    />

                    <Input
                        label="Пароль"
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                    />

                    <Input
                        label="Прізвище"
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={errors.lastName}
                    />

                    <Input
                        label="Ім’я"
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={errors.firstName}
                    />

                    <Input
                        label="По батькові"
                        type="text"
                        name="middleName"
                        id="middleName"
                        value={formData.middleName}
                        onChange={handleChange}
                        error={errors.middleName}
                    />

                    <fieldset>
                        <legend>Стать</legend>
                        <label><input type="radio" name="sex" value="male" checked={formData.sex === 'male'} onChange={handleChange} />Чоловік</label>
                        <label><input type="radio" name="sex" value="female" checked={formData.sex === 'female'} onChange={handleChange} />Жінка</label>
                        {errors.sex && <span className="error-message" style={{ display: 'block' }}>{errors.sex}</span>}
                    </fieldset>

                    <Input
                        label="Дата народження"
                        type="date"
                        name="birthDate"
                        id="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        error={errors.birthDate}
                    />

                    <label htmlFor="group">Вибір послуги зі списку</label>
                    <select
                        name="group"
                        id="group"
                        value={formData.group}
                        onChange={handleChange}
                    >
                        <option value="">Оберіть пакет послуг</option>
                        {Object.entries(serviceOptions).map(([value, text]) => (
                            <option key={value} value={value}>{text}</option>
                        ))}
                    </select>
                    {errors.group && <span className="error-message">{errors.group}</span>}

                    <Input
                        label="Завантажте фото ID-картки"
                        ref={fileInputRef}
                        type="file"
                        name="fileUpload"
                        id="fileUpload"
                        accept=".jpeg,.jpg,.png"
                        onChange={e => setFormData(prev => ({ ...prev, fileUpload: e.target.files[0] }))}
                        error={errors.fileUpload}
                    />

                    <input className="button" type="submit" value="Зареєструватися" />
                </form>
            </section>

            // TODO: clear it
            {/* <section id="table">
                <div style={{ display: 'flex', padding: '12px', gap: '8px' }}>
                    <button id="delete-selected" onClick={handleDeleteSelected} disabled={!canManageRows}>Видалити обрані</button>
                    <button id="duplicate-selected" onClick={handleDuplicateSelected} disabled={!canManageRows}>Дублювати обрані</button>
                </div>
                <div className="table-container">
                    <table cellPadding="0" cellSpacing="0">
                        <thead>
                            <tr>
                                <th><input type="checkbox" id="select-all" onChange={handleSelectAll} checked={users.length > 0 && selectedRows.size === users.length} /></th>
                                <th>Email</th>
                                <th>Телефон</th>
                                <th>ПІБ</th>
                                <th>Стать</th>
                                <th>Дата народження</th>
                                <th>Послуга</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td><input type="checkbox" className="row-checkbox" checked={selectedRows.has(user.id)} onChange={() => handleSelectRow(user.id)} /></td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.fullName}</td>
                                    <td>{user.sex === 'male' ? 'Чоловік' : 'Жінка'}</td>
                                    <td>{user.birthDate}</td>
                                    <td>{serviceOptions[user.group]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section> */}
        </main>
    );
};

export default RegisterPage;