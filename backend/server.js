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
const Ad = mongoose.model('Ad', new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}));


function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; 
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
    }
}


app.post('/create', authenticate, async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const userId = req.user.id; 

        console.log('Received data:', { title, description, price, userId });

        if (!title || !description || price == null || !userId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newAd = new Ad({
            title,
            description,
            price,
            userId
        });

        await newAd.save();
        res.status(201).json({ message: 'Ad created successfully', ad: newAd });
    } catch (err) {
        console.error('Error during ad creation:', err);
        res.status(500).json({ message: 'Error during ad creation', error: err });
    }
});

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

app.get('/ads', async (req, res) => {
    try {
        const ads = await Ad.find().populate('userId', 'username'); 
        res.status(200).json(ads);
    } catch (err) {
        console.error('Error fetching ads:', err);
        res.status(500).json({ message: 'Error fetching ads', error: err });
    }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
