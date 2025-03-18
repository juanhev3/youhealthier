import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products' });
    }
});

// Add a new product
router.post('/', async (req, res) => {
    try {
        const { name, price, description, image } = req.body;
        const newProduct = new Product({ name, price, description, image });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error adding product' });
    }
});

export default router;
