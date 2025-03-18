const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());  // Allows parsing JSON data
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Error connecting to MongoDB:", err));

// Product Schema
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String
});

const Product = mongoose.model('Product', productSchema);

// ✅ FIX: Ensure the API route is correctly set
const router = express.Router();

router.post('/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ message: "Product added successfully!", product: newProduct });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.use('/api', router);  // ✅ This ensures /api/products exists

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }

    router.delete('/products/:id', async (req, res) => {
        try {
            const deletedProduct = await Product.findByIdAndDelete(req.params.id);
            if (!deletedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    });
    
});
