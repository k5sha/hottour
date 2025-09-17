import React from 'react';

const AdminPage = () => {
    const users = [
        { id: 1, package: 'Відпочинок у Карпатах', email: 'ivan.petrov@example.com', lastName: 'Петров', firstName: 'Іван', middleName: 'Олександрович', dob: '15.05.1990', idCard: '#' },
        { id: 2, package: 'Європейський тур', email: 'maria.ivanova@example.com', lastName: 'Іванова', firstName: 'Марія', middleName: 'Сергіївна', dob: '22.11.1988', idCard: '#' },
        { id: 3, package: 'Екзотичний відпочинок', email: 'oleg.sidorov@example.com', lastName: 'Сидоров', firstName: 'Олег', middleName: 'Віталійович', dob: '07.03.1995', idCard: '#' },
        { id: 4, package: 'Гірськолижний курорт', email: 'anna.kostenko@example.com', lastName: 'Костенко', firstName: 'Анна', middleName: 'Миколаївна', dob: '10.12.1992', idCard: '#' },
        { id: 5, package: 'Автобусний тур по Європі', email: 'yuriy.melnyk@example.com', lastName: 'Мельник', firstName: 'Юрій', middleName: 'Ігорович', dob: '03.09.1985', idCard: '#' },
    ];

    return (
        <main>
            <h2>Адмін панель</h2>
            <section id="admin">
                <div className="table-container">
                    <table className="booking-table" cellSpacing="0" cellPadding="0">
                        <thead>
                            <tr>
                                <th>Номер</th>
                                <th>Назва пакета послуг</th>
                                <th>Email</th>
                                <th>Прізвище</th>
                                <th>Ім'я</th>
                                <th>По батькові</th>
                                <th>Дата народження</th>
                                <th>Фото ID-картки</th>
                                <th>Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.package}</td>
                                    <td>{user.email}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.firstName}</td>
                                    <td>{user.middleName}</td>
                                    <td>{user.dob}</td>
                                    <td><a href={user.idCard} target="_blank" rel="noopener noreferrer">Переглянути</a></td>
                                    <td className="button-box">
                                        <button className="button-view"><span className="material-symbols-outlined">preview</span></button>
                                        <button className="button-edit"><span className="material-symbols-outlined">edit</span></button>
                                        <button className="button-delete"><span className="material-symbols-outlined">delete</span></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
};

export default AdminPage;