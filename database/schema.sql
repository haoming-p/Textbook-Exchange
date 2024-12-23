CREATE DATABASE IF NOT EXISTS textbook_exchange;

USE textbook_exchange;
CREATE TABLE IF NOT EXISTS users(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(100) NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
    book_id INT PRIMARY KEY AUTO_INCREMENT,
    isbn VARCHAR(13) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    authors VARCHAR(255),
    publish_date VARCHAR(50),
    publisher VARCHAR(255),
    cover_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- seller&book
CREATE TABLE IF NOT EXISTS listings (
    listing_id INT PRIMARY KEY AUTO_INCREMENT,
    book_id INT NOT NULL,
    user_id INT NOT NULL,
    book_name VARCHAR(255) NOT NULL,
    user_name VARCHAR(100),
    price DECIMAL(10,2),
    condition_percent INT,
    deal_method VARCHAR(50) DEFAULT 'in-person',
    contact_info VARCHAR(255) NULL COMMENT 'User email or phone number',
    notes TEXT, 
    listing_photos TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);