// const express = require('express');
// const app = express();
// const PORT = 5000;
// const mongoose = require('mongoose');
// // Middleware за обработка на JSON
// app.use(express.json());

// // Примерен REST endpoint
// app.get('/api', (req, res) => {
//     res.json({ message: 'Здравей, React!' });
// });

// // Стартирай сървъра
// app.listen(PORT, () => {
//     console.log(`Сървърът работи на http://localhost:${PORT}`);
// });
// const mongoose = require('mongoose');

// // Свързване с MongoDB
// mongoose.connect('mongodb://localhost:27017/mydatabase', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log('Свързан с базата данни'))
// .catch(err => console.error('Грешка при свързване:', err));

// // Модел на данни
// const User = mongoose.model('User', new mongoose.Schema({
//     name: String,
//     email: String,
// }));

// // Endpoint за добавяне на потребител
// app.post('/api/users', async (req, res) => {
//     const user = new User(req.body);
//     await user.save();
//     res.json(user);
// });
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Разрешава заявки от Angular
app.use(bodyParser.json());

// Свързване с MongoDB
mongoose.connect('mongodb+srv://ivpuncheva:<db_password>@cluster0.uzsfx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Модел (пример)
const Item = mongoose.model('Item', { name: String });

// API Роутове
app.get('/api/items', async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

app.post('/api/items', async (req, res) => {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
});

// Стартиране на сървъра
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
