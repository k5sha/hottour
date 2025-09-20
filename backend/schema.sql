-- Видалення таблиць, якщо вже існують, щоб уникнути повторень
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS excursions;
DROP TABLE IF EXISTS hotels;
DROP TABLE IF EXISTS users;


-- Користувачі
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    public_id CHAR(36) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    sex ENUM('male','female','other') NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    birth_date DATE,
    password VARCHAR(255) NOT NULL,
    session_key VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE
);

-- Готелі
CREATE TABLE hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    public_id CHAR(36) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    description TEXT
);

-- Тури (екскурсії)
CREATE TABLE excursions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    public_id CHAR(36) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    duration VARCHAR(100),
    calendar JSON, -- [{ day: 'sunday', from, to },...]
    description TEXT
);

-- Бронювання
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    public_id CHAR(36) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    data JSON NOT NULL, -- [{ public_id, type, price, from, to, number_of_people }]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Відгуки
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    public_id CHAR(36) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    reference_id INT NOT NULL,
    reference_type ENUM('hotel','excursion') NOT NULL,
    rating TINYINT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
