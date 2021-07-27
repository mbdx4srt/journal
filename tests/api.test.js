const app = require("../app");
const request = require("supertest");
const testUsername = "SamTown"
const testPassword = "Badpassword2"
const {li} = require("../loremipsum")

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
        tx = "Culpa in non duis anim elit exercitation. Aliqua nisi sunt nisi tempor nostrud quis. Ex exercitation enim aute aliquip dolor cupidatat elit consequat do voluptate quis reprehenderit. Proident reprehenderit minim aliqua ea. Aliqua commodo excepteur incididunt ex elit exercitation excepteur ipsum nisi sunt ipsum mollit eu ullamco.\n" +
            "Ut nisi qui ut mollit. Aliquip dolore duis aliquip in ullamco commodo ex cupidatat duis qui eu cupidatat deserunt. Excepteur non Lorem exercitation cillum amet. Dolore dolore adipisicing tempor consectetur tempor mollit quis ex mollit officia in reprehenderit.\n" +
            "Esse id aute nisi sit. Fugiat nulla veniam ut pariatur laboris officia fugiat esse eiusmod tempor sunt. Labore aliqua sit quis cillum incididunt eiusmod esse fugiat amet dolore. Voluptate in nisi aliqua aute labore deserunt laboris aliquip tempor id. Sunt aute mollit deserunt culpa. Cillum voluptate exercitation qui incididunt cupidatat qui id eiusmod minim. Officia exercitation eiusmod qui commodo ea voluptate veniam velit ullamco non culpa.\n"
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
    });
});