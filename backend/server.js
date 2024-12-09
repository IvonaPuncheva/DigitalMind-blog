const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');  

const app = express();


app.use(cors({
    origin: 'http://localhost:4200', 
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type']
}));
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

    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: { type: Number, default: 0 }, 
    likedUsers: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] } 
}));
const Comment = mongoose.model('Comment', new mongoose.Schema({
    adId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ad', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}));
function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.error('No token provided');
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log('Token verified successfully:', decoded);
        req.user = decoded; 
        next();
    } catch (err) {
        console.error('Token error:', err.message);
        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Token expired. Please login again.' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token. Please login again.' });
        }
        res.status(500).json({ message: 'Token verification error', error: err });
    }
}



app.post('/ads/:id/comments', authenticate, async (req, res) => {
    try {
        const adId = req.params.id;
        const userId = req.user.id; 
        const { text } = req.body;

       
        if (!text || text.trim() === '') {
            return res.status(400).json({ message: 'Comment text is required' });
        }

       
        if (!mongoose.Types.ObjectId.isValid(adId)) {
            return res.status(400).json({ message: 'Invalid ad ID' });
        }

       
        const newComment = new Comment({
            adId: new mongoose.Types.ObjectId(adId),
            userId: new mongoose.Types.ObjectId(userId),
            text,
        });

        await newComment.save();
        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (err) {
        console.error('Error adding comment:', err.message);
        res.status(500).json({ message: 'Failed to add comment', error: err });
    }
});



app.get('/ads/:id/comments', async (req, res) => {
    try {
        const adId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(adId)) {
            return res.status(400).json({ message: 'Invalid ad ID' });
        }

        const comments = await Comment.find({ adId })
            .populate('userId', 'username')  
            .sort({ createdAt: -1 });

        console.log('Comments fetched:', comments); 
        res.status(200).json(comments);
    } catch (err) {
        console.error('Error fetching comments:', err.message);
        res.status(500).json({ message: 'Failed to fetch comments', error: err });
    }
});



const likedAds = new Map(); 


app.post('/ads/:id/like', authenticate, async (req, res) => {
    try {
        const adId = req.params.id;  
        const userId = req.user.id;  

      
        const ad = await Ad.findById(adId);
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

    
        if (ad.likedUsers.map(id => id.toString()).includes(userId.toString())) {
            return res.status(400).json({ message: 'You have already liked this ad.' });
        }
        
     
        ad.likes += 1;
        ad.likedUsers.push(userId);

       
        await ad.save();

        res.status(200).json({ likes: ad.likes, message: 'Ad liked successfully' });
    } catch (err) {
        console.error('Error liking ad:', err);
        res.status(500).json({ message: 'Error liking ad', error: err });
    }
});





app.post('/create', authenticate, async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.id; 

        console.log('Received data:', { title, description, userId });

        if (!title || !description  || !userId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newAd = new Ad({
            title,
            description,
        
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
app.get('/ads/:id', async (req, res) => {
    try {
      const ad = await Ad.findById(req.params.id).populate('userId', 'username');
      if (!ad) {
        return res.status(404).json({ message: 'Ad not found' });
      }
      res.status(200).json(ad);
    } catch (err) {
      console.error('Error fetching ad details:', err);
      res.status(500).json({ message: 'Error fetching ad details', error: err });
    }
  });
  
  app.put('/ads/:id', authenticate, async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);

        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        if (ad.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to edit this ad' });
        }

        ad.title = req.body.title || ad.title;
        ad.description = req.body.description || ad.description;

        await ad.save();

        res.status(200).json({ message: 'Ad updated successfully', ad });
    } catch (err) {
        console.error('Error updating ad:', err);
        res.status(500).json({ message: 'Error updating ad', error: err });
    }
});

app.delete('/ads/:id', authenticate, async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);

        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        if (ad.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this ad' });
        }

        await Ad.findByIdAndDelete(req.params.id); 
        res.status(200).json({ message: 'Ad deleted successfully' });
    } catch (err) {
        console.error('Error deleting ad:', err);
        res.status(500).json({ message: 'Error deleting ad', error: err });
    }
});
const generateTokens = (user) => {
    const accessToken = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};
app.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, SECRET_KEY);
        const newTokens = generateTokens(decoded);
        res.status(200).json(newTokens);
    } catch (err) {
        console.error('Error with refresh token:', err.message);
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
});


app.post('/verify-token', authenticate, (req, res) => {
    try {
        res.status(200).json({ message: 'Token is valid' });
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
