const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://new_user_2:imhim@cluster0.iok5y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define a Schema and Model for usersdetails collection
const accountSchema = new mongoose.Schema({
    accountNumber: { type: Number, required: true, unique: true },
    mobileNumber: { type: String, required: true },
    branch: { type: String, required: true },
});

const Account = mongoose.model('Account', accountSchema, 'usersdetails');

// API Endpoint to get account details by account number
app.get('/api/accounts/:accountNumber', async (req, res) => {
    try {
        const accountNumber = Number(req.params.accountNumber); // Convert to Number
        console.log('Querying for account number:', accountNumber); // Log the queried account number
        const account = await Account.find({ accountNumber }); // Use shorthand for object property
        console.log('Retrieved account:', account); // Log the retrieved account
        if (!account) return res.status(404).send('Account not found');
        res.status(200).send(account); // Use status 200 for successful retrieval
    } catch (error) {
        res.status(500).send(error.message);
    }
});
// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});