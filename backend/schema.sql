-- Видалення таблиць, якщо вже існують, щоб уникнути повторень
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS excursions;
DROP TABLE IF EXISTS hotels;
DROP TABLE IF EXISTS users;


-- Користувачі
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    public_id VARCHAR(150) NOT NULL,
    full_name VARCHAR(300) NOT NULL,
    sex VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(40) NOT NULL,
    birth_date DATE NOT NULL,
    password VARCHAR(500) NOT NULL,
    session_key VARCHAR(300) NULL,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    join_date TIMESTAMP NOT NULL
);

-- Готелі
CREATE TABLE hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    public_id VARCHAR(150) NOT NULL,
    title VARCHAR(300) NOT NULL,
    location VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    price INT NOT NULL,
    description TEXT NULL
);

-- Тури (екскурсії)
CREATE TABLE excursions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    public_id VARCHAR(150) NOT NULL,
    title VARCHAR(300) NOT NULL,
    location VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    price INT NOT NULL,
    duration INT NOT NULL,
    calendar JSON NOT NULL, -- [{ day: 'sunday', from, to },...]
    description TEXT NULL
);

-- Бронювання
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    public_id VARCHAR(150) NOT NULL,
    user_id VARCHAR(150) NOT NULL,
    data JSON NOT NULL, -- [{ public_id, type, price, from, to, number_of_people }]
    created_at TIMESTAMP NOT NULL
);

-- Відгуки
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    public_id VARCHAR(150) NOT NULL,
    user_id VARCHAR(150) NOT NULL,
    reference_id INT NOT NULL,
    reference_type VARCHAR(50) NOT NULL,
    rating INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL
);
