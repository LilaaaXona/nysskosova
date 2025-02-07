const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://shabaniedlira2:edlira12345@cluster0.yhyia.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define Schema & Model
const buttonSchema = new mongoose.Schema({
    name: String,
    color: String
});

const Button = mongoose.model("Button", buttonSchema);

// Initialize Buttons if Not Exists
const initializeButtons = async () => {
    const buttons = await Button.find();
    if (buttons.length === 0) {
        await Button.insertMany([
            { name: "hi", color: "blue" },
            { name: "bye", color: "blue" }
        ]);
    }
};

initializeButtons();

// Get Button State
app.get("/buttons", async (req, res) => {
    const buttons = await Button.find();
    res.json(buttons);
});

// Update Button State
app.post("/buttons", async (req, res) => {
    const { name, color } = req.body;
    await Button.findOneAndUpdate({ name }, { color });
    res.json({ message: "Button updated!" });
});

// Start Server
app.listen(3000, () => console.log("Server running on port 3000"));
