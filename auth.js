const jwt = require("jsonwebtoken");
const {User} = require("./db");
const bcrypt = require("bcrypt");
async function generateAccessToken(userId) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            {
                userId,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
            (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            }
        );
    });
}

async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1]; // "Bearer kjhkf9s979fshjfa..."
        console.log(authHeader);
        jwt.verify(token, process.env.JWT_SECRET, (err, token) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.userId = token.userId;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}


async function verifyUser(req, res, next) {
    const authHeader = req.headers.authorization;
    const base64 = authHeader.split(" ")[1];
    const usernamePassword = String(Buffer.from(base64, "base64"));
    const [username, password] = usernamePassword.split(":");
    const userRecord = await User.findOne({
        where: {
            username,
        },
    });
    if (!userRecord) {
        return res.sendStatus(404);
    }
    const passwordIsCorrect = await bcrypt.compare(
        password,
        userRecord.passwordHash
    );
    if (passwordIsCorrect) {
        next();
    } else {
        return res.sendStatus(403);
    }
}

module.exports = { generateAccessToken, verifyToken, verifyUser };