const express = require('express');
const storycreator = require('../models/story');
const jwt = require('jsonwebtoken');
const checkauth = require('../middleware/checkauth');
const router = express.Router();


// code for story create

router.post('/createstory', (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization, decoded;
        decoded = jwt.verify(authorization.split(' ')[1], 'keep this key as secret');
        console.log(decoded);
        req.userData = { email: decoded.useremail, userId: decoded.userid };
        const cid = req.userData.userId;
        const cemail = req.userData.email;
        // const picsurl = req.protocol + "://" + req.get("host");
        // console.log(req.body.username);
        const story = new storycreator({
            username: req.body.username,
            title: req.body.title,
            storypara: req.body.storypara,
            creatorid: cid,
            useremail: cemail,
        })
        story.save().then(storydetails => {
            if (!storydetails) {
                return res.status(500).json({
                    message: 'internal error',
                    toast: 'Error while creating profile'
                })
            } else {
                res.status(200).json({
                    message: 'done',
                    toast: 'User story created',
                    stories: storydetails
                })
            }
        })

    }
})


// get all stories

router.get("/allstories", (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization, decoded;
        decoded = jwt.verify(authorization.split(' ')[1], 'keep this key as secret');
        // console.log(decoded);
        req.userData = { userId: decoded.userid };
        const creatorid = req.userData.userId;
        if (creatorid) {
            storycreator.find().then(datas => {
                if (datas) {
                    datas.forEach(element => {
                        console.log(element.creatorid, '****************')
                    })
                    res.status(200).json({
                        message: 'got',
                        stories: datas
                    })
                } else {
                    res.status(400).json({
                        message: 'notfound'
                    })
                }

            })

        }
    }

});

router.post("/storiesupdate/:id", (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization, decoded;
        decoded = jwt.verify(authorization.split(' ')[1], 'keep this key as secret');
        // console.log(decoded);
        req.userData = { email: decoded.useremail, userId: decoded.userid };
        const cid = req.userData.userId;
        const cemail = req.userData.email;
        // if (cid === req.params._id) {
        const userstory = new storycreator({
            _id: req.body.id,
            username: req.body.username,
            title: req.body.title,
            storypara: req.body.storypara,
            creator: cid,
            useremail: cemail,
            // imagePath: imagehostpath
        })
        storycreator.updateOne({ _id: req.params.id }, userstory).then(results => {
            console.log(results);
            if (!results) {
                console.log('err')
                res.status(400).json({
                    messgae: results,
                    toast: 'err'
                })
            } else {
                res.status(200).json({
                    message: results,
                    toast: 'done'
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }
    // }
}
);

router.route('/edit/:id').get(function (req, res) {
    let id = req.params.id;
    storycreator.findById(id, function (err, stories) {
        res.json(stories);
    });
});

router.route('/update/:id').post(function (req, res, next) {
    // storycreator.findById(req.params.id, function (err, next, stories) {
    //     if (!stories)
    //         return next(new err('Could not load Document'));
    //     else {
    //         stories.title = req.body.title;
    //         stories.storypara = req.body.storypara;
    //         stories.useremail = req.body.useremail;
    //         stories.username = req.body.username
    //         // stories.business_gst_number = req.body.business_gst_number;

    //         stories.save().then(business => {
    //             res.json('Update complete');
    //         })
    //             .catch(err => {
    //                 res.status(400).send("unable to update the database");
    //             });
    //     }
    // });
    storycreator.findById(req.params.id).then(stories => {
        if (!stories) {
            res.status(500).json({
                message: 'internal error'
            })
        }
        else {
            stories.title = req.body.title;
            stories.storypara = req.body.storypara;
            stories.useremail = req.body.useremail;
            stories.username = req.body.username
            // stories.business_gst_number = req.body.business_gst_number;

            stories.updateOne(stories).then(storydetails => {
                // res.json('Update complete');
                console.log(stories);
                res.status(200).json({
                    messgae: 'update',
                    details: stories
                })
            })
                .catch(err => {
                    // res.status(400).send("unable to update the database");
                    console.log(err)
                    console.log(req.param.id)
                    res.status(400).json({
                        message: 'error',
                        toast: err
                    })
                });
        }
    })

});
// router.route('/delete/:id').post(function (req, res) {
//     // storycreator.findByIdAndRemove({ _id: req.params.id }, function (err, stories) {
//     //     if (err) res.json(err);
//     //     else res.json('Successfully removed');
//     // });
//     storycreator.findByIdAndRemove(req.params.id).then(stories => {
//         if (err) {
//             res.json(err)
//         } else {
//             res.json('removed')
//         }
//     });
// });

router.route('/delete/:id').post(function (req, res, next) {
    storycreator.findById(req.params.id).then(stories => {
        if (!stories) {
            res.status(500).json({
                message: 'internal error'
            })
        }
        else {
            stories.remove(req.params.id).then(storydetails => {
                // res.json('Update complete');
                console.log(stories);
                res.status(200).json({
                    messgae: 'delete done',
                    details: stories
                })
            })
                .catch(err => {
                    // res.status(400).send("unable to update the database");
                    console.log(err)
                    console.log(req.param.id)
                    res.status(400).json({
                        message: 'error',
                        toast: err
                    })
                });
        }
    })

});
module.exports = router