const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let messages = [];
let idCounter = 0;

app.post("/chat", (req, res) => {
    const { name, text } = req.body;

    if (!name || !text) {
        return res.status(400).send("Invalid message");
    }

    const msg = {
        id: ++idCounter,
        name: String(name).slice(0, 32),
        text: String(text).slice(0, 200),
        time: Date.now()
    };

    messages.push(msg);

    if (messages.length > 200) {
        messages.shift();
    }

    res.json({ success: true });
});

app.get("/chat", (req, res) => {
    const since = parseInt(req.query.since || "0");
    const newMessages = messages.filter(m => m.id > since);
    res.json(newMessages);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Chat server running on port", PORT);
});