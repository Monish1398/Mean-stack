const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const {check,validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route
//@access   Public

//router.get('/',(req,res) => res.send('auth Route'));

//Middleware to jwt verify 
router.get('/', auth, async (req,res) => {
    try{
        const user = await User.findById(req.user.id).select('-password')
        res.json(user);
    }catch (err){
        console.log(err.message);
        res.status(500).send('Server Error')
    }
});
// @route POST api/auth
// @desc Authenticate the user router 
//@access Public

//Create the POST routes for email,password,name
router.post('/', 
    check('email', 'please include the valid email').isEmail(),
    check('password','password is required').exists(), 
    async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    // In that we have email and password 
    const {email,password} = req.body;
    try{
        // see if email
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({errors :[{msg : 'Invaild Credentials'}]
        });
        }
            // see if it is password
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                errors:[{msg : 'Invalid Credentials'}]
            });
        }
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