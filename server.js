const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");

const corsOptions = {
    origin: "https://nysskosova.netlify.app", // Allow only Netlify frontend
    methods: "GET,POST",
    allowedHeaders: "Content-Type",
};

app.use(cors(corsOptions)); // Use CORS with custom options

app.use(express.json()); // Parse JSON data from requests

// Temporary storage for button states (replace with a database in production)
let buttonStates = [
    { name: "hi", color: "blue" },
    { name: "bye", color: "blue" }
];

// Get button states
app.get("/buttons", (req, res) => {
    res.json(buttonStates); // Send button states as JSON
});

// Save button state
app.post("/buttons", (req, res) => {
    const { name, color } = req.body;
    const button = buttonStates.find(btn => btn.name === name);
    
    if (button) {
        button.color = color; // Update the color of the button
    } else {
        buttonStates.push({ name, color }); // Add new button state if not found
    }

    res.status(200).send("Button state updated!");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
