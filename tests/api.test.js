const app = require("../app");
const request = require("supertest");

const testPassword = "Badpassword2"
const {li} = require("../loremipsum");
const {name} = require("../generate_names");
const testUsername = name()
console.log(name)

describe("Login", () => {
    var retToken;

    test("Can do intitial reg", (done) => {
        request(app)
            .post("/users")
            .send({
                'username': testUsername,
                'password': testPassword
            })
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }

                done();
            });
    });


    test("Can do intitial login", (done) => {
        testBase64 = Buffer.from(testUsername + ":" + testPassword).toString('base64')
        console.log(testUsername, testPassword, testBase64)
        request(app)
            .post("/login")
            .set("Authorization", "basic " + testBase64)
            .expect(200)
            .expect(function (res) {

            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                console.log(res.text)
                retToken = res.text
                console.log('Token' + retToken)
                done();
            });
    });

    test("Authorisation with token works", (done) => {
        console.log('lToken' + retToken)
        request(app)
            .get("/greeting")
            .set("Authorization", "Bearer " + retToken)
            .expect(200, "Hello "+testUsername)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                console.log(res.text)
                done();
            });
    });
});

describe("Journal", () => {
    var retToken;

    test("Can do intitial login", (done) => {
        testBase64 = Buffer.from(testUsername + ":" + testPassword).toString('base64')
        console.log(testUsername, testPassword, testBase64)
        request(app)
            .post("/login")
            .set("Authorization", "basic " + testBase64)
            .expect(200)
            .expect(function (res) {

            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                console.log(res.text)
                retToken = res.text
                console.log('Token' + retToken)
                done();
            });
    });


    test("Create journal entry", (done) => {
        function createEntry (tx) {
            console.log(tx)
            request(app)
                .post("/addentry")
                .set("Authorization", "Bearer " + retToken)
                .send({'date': Date.now(),
                    'entry': tx})
                .expect(201)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    console.log(res.text)
                    done();
                });
        }
        li(createEntry)
    });
});