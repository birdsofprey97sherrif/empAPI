const jwt = require('jsonwebtoken')
// load the secret key used to verify tokens 
const JWT_SECRET = process.env.JWT_SECRET

// middle ware function 
function auth(req,res,next){
    // we get the authorization header from the incoming request 
    const authHeader = req.headers.authorization
    // console.log("authHeader",authHeader)

    // this extracts the token from the authHeader 
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) return res.status(401).json({message:"No Token Provided"})
        try {
            // verify the token using the secret key
            // if token is valid decode it and store user info in req.user
            const decode = jwt.verify(token,JWT_SECRET)
            // console.log("decode",decode)
            req.user = decode
            //allow the request to proceed to the next route handler
            next()
        } catch (error) {
            res.status(403).json({message:"Invalid Token"})
        }
}
module.exports = auth