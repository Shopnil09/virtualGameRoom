const router = require('express').Router(); 
const Users = require('../model/Users');
const bcrypt = require('bcryptjs');  
const jwt = require('jsonwebtoken'); 
const authMiddleware = require('../middleware/auth'); 

//register
router.post('/register', async (req, res) => { 
    try {
        //res.json(req.body); 
        const {username, email, password} = req.body; 
        const user = await Users.findOne({email: email}); 
        
        if(user){   
            return res.status(400).json({msg: 'The email already exists'}); 
        }

        const passwordHash = await bcrypt.hash(password, 10); 
        const newUser = new Users({ 
            username: username, 
            email: email, 
            password: passwordHash
        })

        await newUser.save(); 
        res.json({msg: 'User successfully registered'}); 
    } catch (error) {
        return res.status(500).json({msg: error.message}); 
    }
}); 

//login
router.post('/login', async (req, res) => { 
    try {
        const {email, password} = req.body; 
        const user = await Users.findOne({email: email}); 
        if(!user) { 
            return res.status(400).json({msg: 'User does not exist'}); 
        }

        const isMatch = await bcrypt.compare(password, user.password); 
        if(!isMatch){ 
            return res.status(400).json({msg: 'Incorrect Password'}); 
        }

        //if login is successful 
        const payload = {id: user._id, name: user.username}
        const token = jwt.sign(payload, process.env.TOKEN_KEY, {expiresIn: '15s'}); 
        res.json({token}); 

    } catch (error) {
        return res.status(500).json({msg: error.message}); 
    }
});  

//update-password 
/*router.post('/update-password', async (req, res) => { 
    const {error} = schemaUpdatePassword.validate(req.body); //sends an object with the validation
    if(error) { 
        console.log(error.details[0].message); 
        return res.status(400).send(error.details[0].message); //code to retrieve the error message from the validation
    } 

    //checking if the user is in the database
    const user = await User.findOne({email: req.body.email}); //.findOne is a built in function in Mongoose
    if(!user) { 
        console.log('Email is not found.'); 
        return res.status(400).send('Email is not found.');
    } 

    const validPassword = await bcrypt.compare(req.body.password, user.password); //compare hashed password using bcrypt
    if(!validPassword) { 
        console.log('Password is incorrect'); 
        return res.status(400).send('Password is incorrect'); 
    } 

    const salt = await bcrypt.genSalt(10); //generate a salt 
    const hashPassword = await bcrypt.hash(req.body.newPassword, salt); //hash password using bcrypt and salt

    try { 
        const updated = await User.updateOne({email: req.body.email}, {password: hashPassword}); 
        const userTemp = await User.findOne({email: req.body.email}); 
        console.log(updated); 
        console.log(userTemp); 
        console.log("Password Updated"); 
    } catch(err) { 
        return res.status(400).send(err); 
    }

}); */

router.get('/verify', authMiddleware, async(req, res) => { 
    try {
        const token = req.header("Authorization"); 
        if(!token) { 
            return res.send(false); 
        }

        jwt.verify(token, process.env.TOKEN_KEY, async (err, verified) => { 
            if(err){ 
                return res.send(false); 
            }

            const user = await Users.findById(verified.id); 
            if(!user){ 
                return res.send(false)
            }

            return res.send(true); 
        })
    } catch (error) {
        return res.status(500).json({msg: error.message}); 
    }
})

module.exports = router; 