require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(express.json());
app.use(cors());

// checkout api
app.post("/api/create-checkout-session", async(req,res)=>{
    try{
        const {products}= req.body;

        // Validate products array
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Products array is required and must not be empty." });
        }

        let totalAmount = 0;  // Track total in paise for validation

        // Validate each product and calculate total
        for (const product of products) {
            if (!product.dish || typeof product.dish !== 'string') {
                return res.status(400).json({ error: `Invalid or missing dish name for product: ${JSON.stringify(product)}` });
            }
            if (!product.price || typeof product.price !== 'number' || product.price <= 0 || !Number.isInteger(product.price)) {
                return res.status(400).json({ error: `Price must be a positive integer greater than 0 (in INR). Invalid price for product: ${JSON.stringify(product)}` });
            }
            if (!product.qnty || typeof product.qnty !== 'number' || product.qnty <= 0 || !Number.isInteger(product.qnty)) {
                return res.status(400).json({ error: `Quantity must be a positive integer greater than 0. Invalid quantity for product: ${JSON.stringify(product)}` });
            }
            totalAmount += (product.price * 100) * product.qnty;  // Convert to paise and add to total
        }

        // Stripe minimum: Total must be at least ~$0.50 USD
        if (totalAmount < 5000) {
            return res.status(400).json({ error: `Total amount must be at least 50 INR (5000 paise) to meet Stripe's minimum. Current total: ₹${(totalAmount / 100).toFixed(2)}.` });
        }
    
        const lineItems = products.map((product)=>({
            price_data:{
                currency: "inr",
                product_data:{
                    name:product.dish
                },
                unit_amount: product.price*100,
            },
            quantity:product.qnty
        }));

        // --- PRODUCTION FIX: Dynamic Client URL ---
        // Grabs the live URL from the hosting provider, falls back to local for testing
        const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${CLIENT_URL}/success`,
            cancel_url: `${CLIENT_URL}/cart?canceled=true`
        });

        res.json({url:session.url})
    }
    catch(error){
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: error.message });
    }
})

// --- PRODUCTION FIX: Dynamic Port ---
// Cloud hosts (like Render/Heroku) dynamically assign a port. You MUST listen to process.env.PORT.
const PORT = process.env.PORT || 7000;

app.listen(PORT, ()=>{
    console.log(`======== SERVER STARTED ON PORT ${PORT} ========`);
});