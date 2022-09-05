import admin  from './config/firebase.congif.js'

export const isAuth = async(req, res, next) => {
    const authorization = req.headers.authorization;
    if(authorization) { 
        const token = authorization.slice(7, authorization.length); // Bearer xxxx
        // jwt.verify(token,process.env.JWT_SECRET, (err,decode) => {
        //     if(err) {
        //         res.status(401).send({ message: 'Invalid Token '})
        //     } else {
        //         req.user = decode;
        //         next();
        //     }
        // })
        try {
            const decodeValue = await admin.auth().verifyIdToken(token);
            if(decodeValue){
                req.user = decodeValue;
                next();
            } else {
                res.status(401).send({ message: 'Invalid Token '})
            }
        } catch(error) {
            return res.status(505).json({  message: error })
        }
    } else {
        res.status(401).send({ message:'No Token'})
    }
}; 