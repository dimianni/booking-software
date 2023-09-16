import { jwtVerify } from "jose"

export function getJwtSecretKey(){
    const secret = process.env.JWT_SECRET_KEY
    if(!secret || secret.length === 0) throw new Error("JWT secret key is missing!")
    return secret
}

export async function verifyToken(token: string){
    try {
        const verifiedToken = await jwtVerify(token, new TextEncoder().encode(getJwtSecretKey()))
        return verifiedToken.payload
    } catch (error) {
        const errorMessage = error as Error
        if (errorMessage.name === 'JWTExpired') {
            throw new Error("Your token has expired!")
        } else {
            throw new Error("Your token is invalid!")
        }
    }
}