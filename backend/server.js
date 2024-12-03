const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');  

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

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';



app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ 
            token, 
            message: 'Login successful'
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Error during login', error: err });
    }
});

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    registrationDate: { type: Date, default: Date.now }
}));


app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword, 
            registrationDate: new Date() 
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'Error during registration', error: err });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
