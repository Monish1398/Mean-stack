const express = require ('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const  {check,validationResult} = require('express-validator');

// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Public
router.get('/me',auth,async(req,res) => {
    try{
        const profile = await Profile.findOne({user:req.user.id}).populate('user',
        ['name','avatar']);

        if(!profile){
            return res.status(400).json({msg: 'There is no profile for the user'});
        }
        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
    
// @route   POST api/profile
// @desc    create or update user profile
// @access  Private

router.post('/', [
    auth, [
        check('status', 'name is required')
        .not()
        .isEmpty(),
        check('skills','skills is required')
        .not()
        .isEmpty()
    ]
],
    async(req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array()
            });    
        }
        
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        //build the project object 

        const profileFields = {};
        profileFields.user = req.user.id;
        if(company) profileFields.company = company;
        if(website) profileFields.company = website;
        if(location) profileFields.company = location;
        if(bio) profileFields.company = bio;
        if(status) profileFields.company = status;
        if(githubusername) profileFields.company = githubusername;
        if(skills){
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }
        //console.log(profileFields.skills);
        //build social object
        profileFields.social = {};
        if(twitter) profileFields.social.twitter = twitter;
        if(youtube) profileFields.social.youtube = youtube;
        if(facebook) profileFields.social.facebook = facebook;
        if(linkedin) profileFields.social.linkedin = linkedin;
        if(instagram) profileFields.social.instagram = instagram;

        try{
            let profile = await Profile.findOne({user : req.user.id});

            if(profile){
                //update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id},
                    { $set : profileFields},
                    { new: true }
                );
                return res.json(profile);
            }
            //create the profile
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);

        }catch(err){
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    }
);

//@route  GET api/profile
//@desc   Get all profiles
//@access public

router.get('/', async (req,res) => {
    try{
        const profiles = await Profile.find().populate('user', ['name' , 'avatar']);
        res.json(profiles);
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error')
    }
})

//@route GET api/profiles
//@desc Get all user ID
//@access public

router.get('/user/:user_id', async(req,res) => {
    try{
        const profile = await Profile.findOne({
            user:req.params.user_id
        }).populate('user',['name', 'avatar']);
        if(!profile) 
        return res.status(400).json({msg:'Profile not found'});
        res.json(profile);
    }catch(err){
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Profile not found'});
        }
        res.status(500).send('server error')
    }
})
module.exports = router;