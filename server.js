const exp = require('constants');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path'); // для работы с путями файлов

const app = express();
const port = 3000;

app.use(express.static('./pavo/'))

// Подключение к базе данных SQLite
const db = new sqlite3.Database('./db.db', (err) => {
    if (err) {
        console.error('Ошибка при открытии базы данных', err.message);
    } else {
        console.log('Подключение к базе данных успешно');
    }
});

// Пример маршрута для получения всех пользователей
app.get('/getSeasons', (req, res) => {
    db.all('SELECT * FROM seasons', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
