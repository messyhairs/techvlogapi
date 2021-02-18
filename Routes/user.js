const express = require('express');
const appusers = require('../models/user');
const jwt = require('jsonwebtoken');
const cryptcode = require('bcrypt');
const router = express.Router();
const passwordStrength = require('check-password-strength')
const localStorage = require('localStorage')


// code for create account

router.post('/createaccount', (req, res, next) => {
    cryptcode.hash(req.body.password, 10).then(hash => {
        const users = new appusers({
            useremail: req.body.useremail,
            password: hash,
            // UserPassword: req.body.UserPassword,
            username: req.body.username,
            userage: req.body.userage,
            useraddress: req.body.useraddress,
            expoPushToken: req.body.expoPushToken,
            tagline: req.body.tagline,
            role: req.body.role,
            contactnumber: req.body.contactnumber,
            noofex: req.body.noofex
        });
        appusers.findOne({ useremail: req.body.useremail }).then(userfound => {
            if (userfound) {
                console.log('user email alreadt exist');
                return res.status(401).json({
                    message: 'already',
                    toast: 'User email is already exist'
                })
            }
            // console.log(passwordStrength(req.body.UserEmail).value)
            // Strong
            users.save().then(result => {
                if (!result) {
                    return res.status(500).json({
                        message: 'internal error',
                        toast: 'error occured while creating a account'
                    })
                }
                res.status(200).json({
                    message: 'success',
                    toast: 'Your account created successfully',
                    result: result
                });
            }).catch(err => {
                res.status(500).json({
                    error: err
                })
            })
        })
    })
});

// code for login

router.post('/login', (req, res, next) => {
    let fetchedUser;
    appusers.findOne({ useremail: req.body.useremail }).then(logindetails => {
        if (!logindetails) {
            return res.status(401).json({
                message: 'emailissues',
                toast: 'Login process failed please check entered email'
            })
        }
        fetchedUser = logindetails;
        return cryptcode.compare(req.body.password, fetchedUser.password);
    }).then(result => {
        console.log(fetchedUser);
        if (!result) {
            return res.status(401).json({
                message: 'crederror',
                toast: 'Login process failed please check entered password'
            })
        }
        const token = jwt.sign({
            useremail: fetchedUser.useremail, userid: fetchedUser._id
        }, "keep this key as secret",
            // { expiresIn: '1hr' }
        );
        const decodedToken = jwt.verify(token, "keep this key as secret");
        console.log(decodedToken);
        res.status(200).json({
            token: token,
            // expiresIn: 3600,
            userid: fetchedUser._id,
            toast: 'hello user logged in successfully',
            message: 'success'
        })
    }).catch(err => {
        console.log(err);
    })
})



// get profile by ID

router.get("/getuserdetails/:id", (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization, decoded;
        decoded = jwt.verify(authorization.split(' ')[1], 'keep this key as secret');
        // console.log(decoded);
        req.userData = { email: decoded.email, userId: decoded.userid };
        const cid = req.userData.userId;
        console.log(cid);
        console.log(req.params.id);
        // const cemail = req.userData.email;
        if (cid === req.params.id) {
            // console.log(req.params.creator);
            // appusers.findOne({ creator: cid }).then(prof => {
            appusers.findById(cid).then(prof => {
                if (prof) {
                    console.log('*********', prof);
                    // console.log(req.params.creator);
                    // res.status(200).json({
                    //     message: "Profile fetched successfully!",
                    //     profile: prof
                    // });
                    res.status(200).send({
                        message: "Profile fetched successfully",
                        profile: prof
                    })
                } else {
                    console.log('failed');
                    res.status(404).json({ message: "Profile not found!*********" });
                }
            });
        }
    }
});

// get profiles

router.get("/profiledetails/:id", (req, res, next) => {
    appusers.findById(req.params.id).then(prof => {
        if (prof) {
            console.log('*********', prof);
            res.status(200).send({
                message: "Profile fetched successfully",
                profile: prof
            })
        } else {
            console.log('failed');
            res.status(404).json({ message: "Profile not found!*********" });
        }
    });
});

module.exports = router