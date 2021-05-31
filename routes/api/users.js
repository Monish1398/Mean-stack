const express = require('express');
const router = express.Router();
const {body,validationResult, check} = require('express-validator');
const gravatar = require('gravatar');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User')


// @route POST api/users
// @desc Test route
//@access Public

//Create the POST routes for email,password,name
router.post('/', 
    check('name', 'name is required')
    .not()
    .isEmpty(),
    check('email', 'please include the valid email').isEmail(),
    check('password','please enter the password 6 chracter').isLength({min:6}), 
    async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {name,email,password} = req.body;
    try{
        // see if user exits 
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({errors :[{msg : 'User already exists'}]
        });
        }
        //get users encrypt [gravatar]
        const avatar = gravatar.url(email,{
            s: '200',
            r: 'pg',
            d: 'mm'
        })
        user = new User({
            name,
            email,
            avatar,
            password
        })
        //Encryped  password - bcrypt
        const salt = await bycrypt.genSalt(10);
        user.password = await bycrypt.hash(password,salt);
        await user.save();
        // Return jsonwebtoken
        //res.send('User Registered');
        // Create a payload

        const payload = {
            user:{
                id:user.id
            }
        };
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn:360000},
            (err,token) => {
                if(err) throw err;
                res.json({token});
            }
        );
    }catch(err) {
        console.log(err.message);
        res.status(500).send('server error')
    }
    //console.log(req.body);
    //res.send('users Routes')
}); 

module.exports = router;