const jwt = require('jsonwebtoken'); 

const auth = (req, res, next) => { 
    try {
        const token = req.header("Authorization"); 
        if(!token){ 
            return res.status(400).json({msg: 'Invalid Authorization'}); 
        }
        jwt.verify(token, process.env.TOKEN_KEY, (err, user) => { //the jwt.verify will give back the user id; if it gives an error, token is invalid
            if(err){ 
                return res.status(400).json({msg: 'Authorization not valid'}); 
            }
            req.user = user; 
            next(); 
        })

    } catch (error) {
        return res.status(500).json({msg: error.message}); 
    }
}

module.exports = auth; 