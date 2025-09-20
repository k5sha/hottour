-- Видалення таблиць, якщо вже існують, щоб уникнути повторень
DROP TABLE IF EXISTS reviews;
-- DROP TABLE IF EXISTS tour_bookings;
-- DROP TABLE IF EXISTS hotel_bookings;
-- DROP TABLE IF EXISTS tours;
-- DROP TABLE IF EXISTS hotels;
-- DROP TABLE IF EXISTS users;


-- -- Користувачі
-- CREATE TABLE users (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     public_id VARCHAR(150) NOT NULL,
--     full_name VARCHAR(300) NOT NULL,
--     sex VARCHAR(50) NOT NULL,
--     email VARCHAR(255) NOT NULL,
--     phone VARCHAR(40) NOT NULL,
--     birth_date DATE NULL,
--     password VARCHAR(500) NOT NULL,
--     session_key VARCHAR(300) NULL,
--     is_admin BOOLEAN DEFAULT FALSE NOT NULL,
--     join_date TIMESTAMP NULL
-- );

-- -- Готелі
-- CREATE TABLE hotels (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     public_id VARCHAR(150) NOT NULL,
--     title VARCHAR(300) NOT NULL,
--     location VARCHAR(255) NOT NULL,
--     image VARCHAR(255),
--     price DOUBLE NOT NULL,
--     description TEXT NULL
-- );

-- -- Тури
-- CREATE TABLE tour (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     public_id VARCHAR(150) NOT NULL,
--     title VARCHAR(300) NOT NULL,
--     location VARCHAR(255) NOT NULL,
--     image VARCHAR(255),
--     price DOUBLE NOT NULL,
--     from_datetime DATETIME NOT NULL,
--     to_datetime DATETIME NOT NULL,
--     description TEXT NULL,
--     participents_limit INT NOT NULL
-- );

-- -- Бронювання готелів
-- CREATE TABLE hotel_bookings (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     public_id VARCHAR(150) NOT NULL,
--     user_id VARCHAR(150) NOT NULL,
--     hotel_id VARCHAR(150) NOT NULL,
--     from_date DATE NOT NULL,
--     to_date DATE NOT NULL
-- );

-- -- Бронювання турів
-- CREATE TABLE tour_bookings (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     public_id VARCHAR(150) NOT NULL,
--     user_id VARCHAR(150) NOT NULL,
--     tour_id VARCHAR(150) NOT NULL,
--     number_of_people INT NOT NULL
-- );

-- Відгуки
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    public_id VARCHAR(150) NOT NULL,
    user_id VARCHAR(150) NOT NULL,
    reference_id VARCHAR(150) NOT NULL,
    reference_type VARCHAR(50) NOT NULL,
    rating INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP NULL
);
