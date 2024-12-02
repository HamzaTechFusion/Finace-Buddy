const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'finance_app'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
});

app.use(express.json());

app.get('/get-credit-card-balance', (req, res) => {
    const user_id = 1; // Hardcoded or dynamically pass based on the logged-in user
    db.query('SELECT balance FROM credit_card WHERE user_id = ?', [user_id], (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
});

app.post('/add-to-credit-card', (req, res) => {
    const { amount } = req.body;
    const user_id = 1; // Hardcoded or dynamically pass based on the logged-in user

    db.query('UPDATE credit_card SET balance = balance + ? WHERE user_id = ?', [amount, user_id], (err) => {
        if (err) throw err;

        db.query('INSERT INTO transactions (user_id, type, amount) VALUES (?, ?, ?)', [user_id, 'Add to Credit Card', amount], (err) => {
            if (err) throw err;
            res.json({ status: 'success' });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

