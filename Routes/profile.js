const express = require('express');
const profile = require('../models/profile');
const postfile = require('../models/post');
const checkauthfile = require('../middleware/checkauth');
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require("path");
// const tokencleaning = require('../middleware/checkauth')
const router = express.Router();
// const MIME_TYPE_MAP = {
//     "image/png": "png",
//     "image/jpeg": "jpg",
//     "image/jpg": "jpg",
//     "image/gif": "gif"
// };

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const isValid = MIME_TYPE_MAP[file.mimetype];

//         let error = new Error("Invalid mime type");
//         if (isValid) {
//             error = null;
//         }
//         cb(error, "images");
//     },
//     filename: (req, file, cb) => {
//         const name = file.originalname
//             .toLowerCase()
//             .split(" ")
//             .join("-");

//         console.log(name)
//         const ext = MIME_TYPE_MAP[file.mimetype];
//         cb(null, name + "-" + Date.now() + "." + ext);
//     }
// });
const storage = multer.diskStorage({
    destination: "./public",
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
}).single("imagePath");
console.log(upload);
router.post('/createprofile', upload, (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization, decoded;
        decoded = jwt.verify(authorization.split(' ')[1], 'keep this key as secret');
        console.log(decoded);
        req.userData = { email: decoded.email, userId: decoded.userid };
        const cid = req.userData.userId;
        const cemail = req.userData.email;
        // const picsurl = req.protocol + "://" + req.get("host");
        const picsurl = req.file;
        const userprofile = new profile({
            username: req.body.username,
            bio: req.body.bio,
            creator: cid,
            useremail: cemail,
            imagePath: picsurl
        })
        profile.findOne({ creator: cid }).then(currentuser => {
            if (currentuser) {
                return res.status(401).json({
                    message: 'repeat',
                    toast: 'User name is aleready exist'
                })
            }
            if (!currentuser) {
                userprofile.save().then(profiledetails => {
                    if (!profiledetails) {
                        return res.status(500).json({
                            message: 'internal error',
                            toast: 'Error while creating profile'
                        })
                    } else {
                        res.status(200).json({
                            message: 'done',
                            toast: 'User profile created',
                            profile: profiledetails
                        })
                    }
                })
            }
        }).catch(err => {
            console.log(err);
            return res.status(500).json({
                message: err,
            })
        })
    }
})

router.post("/uploadprofile", upload, (req, res, err) => {
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization, decoded;
        decoded = jwt.verify(authorization.split(' ')[1], 'keep this key as secret');
        console.log(decoded);
        req.userData = { email: decoded.email, userId: decoded.userid };
        const cid = req.userData.userId;
        const cemail = req.userData.email;
        // console.log(cid);
        // console.log(req.body.username);
        // console.log(req.body.bio);
        const imagehostpath = req.protocol + "://" + req.get("host") + '/' + 'public/' + req.file.originalname;
        const userprofile = new profile({
            username: req.body.username,
            bio: req.body.bio,
            creator: cid,
            useremail: cemail,
            imagePath: imagehostpath
        })
        profile.findOne({ creator: cid }).then(currentuser => {
            if (currentuser) {
                return res.status(401).json({
                    message: 'repeat',
                    toast: 'Username already exist'
                })
            }
            if (!currentuser) {
                userprofile.save().then(datas => {
                    if (datas) {
                        return res.status(200).json({
                            message: 'done',
                            toast: 'Hello' + ' ' + cemail + ' ' + 'your Profile created successfully',
                            profiledetails: datas
                        })
                    } else {
                        return res.status(500).json({
                            message: 'error',
                            toast: 'Internal server error'
                        })
                    }
                })
            }
        })
    }
})

// editing user_profile code

router.put("/editprofiledetails/:id",
    checkauthfile,
    multer({ storage: storage }).single("image"),
    (req, res, next) => {
        let imagePath = req.body.imagePath;
        const url = req.protocol + "://" + req.get("host")
        if (req.file) {
            const url = req.protocol + "://" + req.get("host");
            imagePath = url + "/images/" + req.file.filename
        }

        const userprofile = new profile({
            _id: req.body.id,
            username: req.body.username,
            bio: req.body.bio,
            imagePath: imagePath,
            creator: req.userData.userId
        })

        profile.updateOne(
            { _id: req.params.id, creator: req.userData.userId },
            userprofile
        ).then(result => {
            if (result) {
                res.status(200).json({ message: "Profile Updated successful!" });
            }

            else {
                res.status(500).json({ message: "Error Upating Profile" });
            }
        })
            .catch(e => {
                res.status(500).json({ message: "Error Upating Profile ,Username taken" });
                console.log(e)
            });
    }
);

// code to get your profiles

// router.get('/profiles', (req, res, next) => {
//     profile.find().then(appuserdetails => {
//         if (!appuserdetails) {
//             res.status(404).json({
//                 message: "user profile not found"
//             })
//         } else {
//             res.status(200).json({
//                 message: "We got your profile",
//                 profiledetails: appuserdetails
//             })
//         }
//     }).catch(err => {
//         console.log('we got some error while get profiles');
//         res.status(500).json({
//             message: 'we got some issues' + err
//         })
//     })
// })

// code to get viewprofile

router.get('/viewprofile', checkauthfile, (req, res, next) => {
    profile.findOne({ creator: req.userData.userId }).then(userprofile => {
        if (!userprofile) {
            return res.status(404).json({
                message: 'user not found'
            });
        } else {
            res.status(200).json({
                message: 'we got the profile you want',
                profiles: userprofile
            })
        }
    })
})

// code to get profile by ID

router.get('/getprofilebyid/:id', checkauthfile, (req, res, next) => {
    profile.findOne({
        userid: req.params.id
    }).then(userprofiles => {
        if (userprofiles) {
            return res.status(200).json({
                message: 'we got your profile based on your id',
                userdetails: userprofiles
            })
        } else {
            res.status(404).json({
                message: 'we could not able to get your profile'
            })
        }
    })
})


// Profile with Id

// code to get my_post if i loggedIN

router.get('/mypost/:id', checkauthfile, (req, res, next) => {
    let user
    let creatorId
    profile.findById({
        userid: req.params.id
    }).then(mypost => {
        if (mypost) {
            user = mypost
            return postfile.find({ creator: user.creator })
        }
    }).then(mypost => {
        res.status(200).json({
            message: 'we got your post successfully',
            post: mypost
        })
    }).catch(err => {
        return res.status(404).json({
            message: 'we got some issues while getting your Post',
            error: err
        })
    })
})

// Get Profile by Id...
router.get("/yourprofile/:creator", (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization, decoded;
        decoded = jwt.verify(authorization.split(' ')[1], 'keep this key as secret');
        // console.log(decoded);
        req.userData = { email: decoded.email, userId: decoded.userid };
        const cid = req.userData.userId;
        const cemail = req.userData.email;
        if (cid === req.params.creator) {
            // console.log(req.params.creator);
            profile.findOne({ creator: cid }).then(prof => {
                if (prof) {
                    // console.log('*********');
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
                    res.status(404).json({ message: "Profile not found!*********" });
                }
            });
        }
    }
});




// Editin yur profiles



router.put("/profileupdate/:id", (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization, decoded;
        decoded = jwt.verify(authorization.split(' ')[1], 'keep this key as secret');
        // console.log(decoded);
        req.userData = { email: decoded.email, userId: decoded.userid };
        const cid = req.userData.userId;
        const cemail = req.userData.email;
        // if (cid === req.params._id) {
        const userprofile = new profile({
            _id: req.body.id,
            username: req.body.username,
            bio: req.body.bio,
            creator: cid,
            useremail: cemail,
            // imagePath: imagehostpath
        })
        profile.updateOne({ _id: req.params.id, creator: cid }, userprofile).then(results => {
            console.log(datas);
        })
        // profile.updateOne(
        //     { _id: req.params.id, creator: cid },
        //     userprofile
        // ).then(result => {
        //     if (result) {
        //         res.status(200).json({ message: "Profile Updated successful!" });
        //     }

        //     else {
        //         res.status(500).json({ message: "Error Upating Profile" });
        //     }
        // })
        //     .catch(e => {
        //         res.status(500).json({ message: "Error Upating Profile ,Username taken" });
        //         console.log(e)
        //     });
    }
}
    // }
);


// router.get('/api/logout', auth, function (req, res) {
//     req.user.deleteToken(req.token, (err, user) => {
//         if (err) return res.status(400).send(err);
//         res.sendStatus(200);
//     });

// });

module.exports = router