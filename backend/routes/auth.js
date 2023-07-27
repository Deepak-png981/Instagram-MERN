const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const USER = mongoose.model("USER");
const bcrypt = require('bcrypt');


router.get('/', (req, res) => {
    res.send("hello");
})
router.post('/signup', (req, res) => {
    const { name, userName, email, password } = req.body;
    if (!name || !userName || !email || !password) {
        return res.status(422).json({ error: "Please add all the fields" });
    }
    //if email id exist prior
    USER.findOne({ $or: [{ email: email }, { userName: userName }] }).then((saveduser) => {
        if (saveduser) {
            return res.status(422).json({ error: "User already exist" });
        }
        bcrypt.hash(password, 12).then((hashedPassword) => {
            const user = new USER({
                name,
                userName,
                email,
                password: hashedPassword
            });
            user.save()
                .then(user => { res.json({ message: "Registered successfully" }) })
                .catch(err => { console.log("An error occured") });
        })


    })

})

//route for signin
router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please add all the fields" });
    }
    USER.findOne({ email: email }).then((savedUser) => {
        //if user does not exist
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid email" });
        }
        //comparing the password
        bcrypt.compare(password, savedUser.password).then((match) => {
            if (match) {
                return res.status(200).json({ message: "Sign in successfully" });
            } else {
                return res.status(422).json({ error: "Please enter correct password" });
            }
        })
            .catch(err => { console.log(err) })
    })
})

module.exports = router;