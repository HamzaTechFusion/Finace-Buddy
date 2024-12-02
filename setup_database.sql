CREATE DATABASE IF NOT EXISTS finance_buddy;
USE finance_buddy;

DROP TABLE IF EXISTS credit_scores;
DROP TABLE IF EXISTS credit_cards;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
    account_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    account_type ENUM('checking', 'savings') NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    from_account VARCHAR(50) NOT NULL,
    to_account VARCHAR(50),
    amount DECIMAL(10, 2) NOT NULL,
    type ENUM('deposit', 'withdrawal', 'transfer') NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE credit_cards (
    card_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    credit_limit DECIMAL(10, 2) DEFAULT 1000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE credit_scores (
    score_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    score INT NOT NULL,
    payment_history INT NOT NULL,
    credit_utilization INT NOT NULL,
    account_age INT NOT NULL,
    credit_types INT NOT NULL,
    credit_inquiries INT NOT NULL,
    score_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE INDEX idx_user_accounts ON accounts(user_id);
CREATE INDEX idx_user_transactions ON transactions(user_id);
CREATE INDEX idx_user_credit_cards ON credit_cards(user_id);
CREATE INDEX idx_user_credit_scores ON credit_scores(user_id); 