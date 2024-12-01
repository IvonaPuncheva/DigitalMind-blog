
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors()); 
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://iv:oNPRxvikFTn4rzPY@cluster0.uzsfx.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);  
    });

const Item = mongoose.model('Item', new mongoose.Schema({ name: String }));

app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ message: 'Failed to fetch items', error: err });
    }
});


app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

app.post('/api/items', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ message: 'Failed to save item', error: err });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
