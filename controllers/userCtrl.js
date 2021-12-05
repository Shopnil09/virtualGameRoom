const Users = require('../models/userModel');
const jwt = require('jsonwebtoken'); 

const userCtrl = { 
    verifiedToken: (req, res) => { 
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
    }
}