const express = require("express");
const bcrypt = require("bcrypt");
const {User,journalRecord} = require("./db");
const {generateAccessToken, verifyToken, verifyUser} = require("./auth")

const app = express();


require("dotenv").config();

//console.log(process.env.JWT_SECRET);
app.use(express.json());

const session = require("express-session");
const sessionSettings = {
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
};
app.use(session(sessionSettings));


app.post("/login", verifyUser, async (req, res) => {
    const authHeader = req.headers.authorization;
    const base64 = authHeader.split(" ")[1];
    const usernamePassword = String(Buffer.from(base64, "base64"));
    const [username, password] = usernamePassword.split(":");
    result = await generateAccessToken(username)
    //console.log(result)
    res.send(result)
});

app.post("/users", async (req, res) => {
    const {username, password} = req.body;
    //console.log(username, password)
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({username, passwordHash});
    res.sendStatus(201);
});

app.get("/greeting", verifyToken, (req, res) => {
    res.send("Hello " + req.userId)
    //console.log(req.userId)
});



app.post("/entry", verifyToken, async (req, res) => {
    const {date, entry} = req.body;
    const username = req.userId
    const newRecord = await journalRecord.create({date,entry});
    const userRecord = await User.findOne({
        where: {
            username,
        },
    });
    //console.log(userRecord.username)
    await newRecord.update({UserId: userRecord.id})
    res.send(201,{id:newRecord.id})
    //res.sendStatus(201);
});


app.get("/entry", verifyToken, async (req, res) => {
    const username = req.userId
    const userRecord = await User.findOne({where: {username},});
    const entries = await journalRecord.findAll({where: {UserId: userRecord.id}, raw:true});
    res.send(200, entries);
});

app.get("/entry/:id", verifyToken, async (req, res) => {
    const username = req.userId
    rid = req.params.id
    const userRecord = await User.findOne({where: {username},});
    const entries = await journalRecord.findOne({where: {UserId: userRecord.id, id:rid}, raw:true});
    res.send(200, entries);
});


app.put("/entry/:id", verifyToken, async (req, res) => {
    const username = req.userId
    rid = req.params.id
    const userRecord = await User.findOne({where: {username},});
    const entries = await journalRecord.findOne({where: {UserId: userRecord.id, id:rid}});
    console.log(entries)
    entries.date =req.body.date;
    entries.entry=  req.body.entry;
    await entries.save();
    res.send(200, entries.toJSON());
});


app.delete("/entry/:id", verifyToken, async (req, res) => {
    const username = req.userId
    rid = req.params.id
    const userRecord = await User.findOne({where: {username},});
    const entries = await journalRecord.findOne({where: {UserId: userRecord.id, id:rid}});
    await entries.destroy();
    res.send(200, entries.toJSON());
});



app.delete("/users", verifyToken, async (req, res) => {
    const username = req.userId
    const userRecord = await User.findOne({where: {username},});
    await userRecord.destroy();
    res.send(200);
});



module.exports = app;