require("dotenv").config(); // Load environment variables
// Import the Express.js framework so we can build a web server
const express = require("express");

// Create an Express app (our web server)
const app = express();

// Set the port number (use the one from the environment or default to 3000)
const port = process.env.PORT || 3000;

// Import CORS (allows requests from other websites)
const cors = require("cors");

// Set CORS rules (only allow requests from this website)
const corsOptions = {   
    origin: "https://nysskosova.netlify.app", // Only allow this website to talk to our server
    methods: "GET,POST", // Only allow GET and POST requests
    allowedHeaders: "Content-Type", // Only allow Content-Type header
};

// Tell our app to use CORS with the above rules
app.use(cors(corsOptions)); 

// Tell our app to understand JSON data in requests
app.use(express.json()); 

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Define a schema for button states
const buttonSchema = new mongoose.Schema({
    name: String,
    color: String,
});

// Create a model for buttons
const Button = mongoose.model("Button", buttonSchema);

// When someone visits "/buttons", send them the button list
app.get("/buttons", async (req, res) => {
    try {
        const buttons = await Button.find();
        res.json(buttons);
    } catch (error) {
        res.status(500).json({ message: "Error fetching buttons" });
    }
});

// When someone sends data to "/buttons", update or add a button
app.post("/buttons", async(req, res) => {
    try {
        const { name, color } = req.body;
        let button = await Button.findOne({ name });

        if (button) {
            button.color = color;
            await button.save();
        } else {
            button = new Button({ name, color });
            await button.save();
        }

        res.status(200).send("Button state updated!");
    } catch (error) {
        res.status(500).json({ message: "Error updating button state" });
    }
});

// Start the server and listen for requests
app.listen(port, () => {
    console.log(`Server is running on port ${port}`); // Show a message when the server starts
});

