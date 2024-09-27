import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser';

export const verifyToken = (request, response, next)=>{
    const token = request.cookies.jwt;
    if(!token) return response.status(401).send("You are not authorized.");
    jwt.verify(token,process.env.JWT_KEY,async(err,payload)=>{
        if(err) return response.status(403).send("Token is not valid!");
        request.userId = payload.userId
        next();
    })
}
