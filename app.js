const express = require("express");
const bodyParser = require("body-parser");
const { Template } = require("ejs");
const _ = require("lodash");
var nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static("public"));

const oxygen = "https://airtable.com/embed/shr3gJ3dds97hKeMz?backgroundColor=purple&layout=card&viewControls=on";
const medicine = "https://airtable.com/embed/shrFggQzZwiAeFhFw?backgroundColor=purple&layout=card&viewControls=on";
const hospitalbed = "https://airtable.com/embed/shrKJ6zBGgxpsGai2?backgroundColor=purple&layout=card&viewControls=on";
const plasma = "https://airtable.com/embed/shrXGF1YCYQWTQSg4?backgroundColor=purple&layout=card&viewControls=on";
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

app.get("/", function(req, res) {
    res.render('home', {
        heading: "Oxygen Cylinder/Refill",
        link: oxygen
    });
});

app.get("/:id", function(req, res) {

    if (req.params.id === "needhelp") {
        res.render('needhelp');
    } else if (req.params.id === "projectbreathe") {
        res.render('projectbreathe', {
            heading: "Project Breathe"
        });
    } else {
        let value;
        console.log(_.lowerCase(req.params.id));
        if (req.params.id === "medicine") {
            value = medicine;
        } else if (req.params.id === "hospitalbeds") {
            value = hospitalbed;
        } else if (req.params.id === "plasma")
            value = plasma;

        console.log(req.params.id);

        res.render('home', {
            heading: _.capitalize(req.params.id),
            link: value
        });
    }
});

app.post("/needhelp", function(req, res) {


    let subject = req.body.name + "  " + req.body.number;

    let message = req.body.email + "\n" + req.body.message;

    var mailOptions = {
        from: 'covidmail4@gmail.com',
        to: 'alamsarfraz422@gmail.com',
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            res.render('messagesent', {
                message: "Message Sent"
            });
            console.log('Email sent: ' + info.response);
        }
    });
});


app.post("/projectbreathe", function(req, res) {
    let subject = "Project Breathe";
    let message = req.body.name + "\n" + req.body.email + "\n" + req.body.contact + "\n" + req.body.city;
    var mailOptions = {
        from: 'covidmail4@gmail.com',
        to: 'alamsarfraz422@gmail.com',
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            res.render('messagesent', {
                message: "Form Filled"
            });
            console.log('Email sent: ' + info.response);
        }
    });

})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
});