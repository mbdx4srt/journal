const express = require("express");
const bcrypt = require("bcrypt");
const {User,journalRecord} = require("./db");
const {generateAccessToken, verifyToken, verifyUser} = require("./auth")
const {Counter} = require("./counter")
const app = express();


require("dotenv").config();

console.log(process.env.JWT_SECRET);
app.use(express.json());

const session = require("express-session");
const sessionSettings = {
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
};
app.use(session(sessionSettings));

app.use((req, res, next) => {
    Counter.lookup[req.session.id] =
        Counter.lookup[req.session.id] || new Counter(req.session.id);
    next();
});


app.post("/login", verifyUser, async (req, res) => {
    const authHeader = req.headers.authorization;
    const base64 = authHeader.split(" ")[1];
    const usernamePassword = String(Buffer.from(base64, "base64"));
    const [username, password] = usernamePassword.split(":");
    result = await generateAccessToken(username)
    console.log(result)
    res.send(result)
});

app.post("/users", async (req, res) => {
    const {username, password} = req.body;
    console.log(username, password)
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({username, passwordHash});
    res.sendStatus(201);
});

app.get("/greeting", verifyToken, (req, res) => {
    res.send("Hello " + req.userId)
    console.log(req.userId)
});



app.get("/counter", verifyToken, (req, res) => {
    res.send(Counter.lookup[req.session.id].inc());
});

app.post("/addentry", verifyToken, async (req, res) => {
    const {date, entry} = req.body;
    const username = req.userId
    const newRecord = await journalRecord.create({date,entry});
    const userRecord = await User.findOne({
        where: {
            username,
        },
    });
    console.log(userRecord.username)
    await newRecord.update({UserId: userRecord.id})
    res.sendStatus(201);
});




module.exports = app;