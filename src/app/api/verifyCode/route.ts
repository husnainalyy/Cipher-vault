import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { Calistoga } from "next/font/google";
import {z} from "zod"

export async function POST(request:Request) {
    await dbConnect()
    try {
        const { username, code } = await request.json()
        console.log("Received Username:", username); // Log the received username
        console.log("Received Code:", code); // Log the received code
        
        const decodeUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodeUsername })
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        
        const isCodeValid = user.verifyCode === code
        const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date
        if (isCodeExpired && isCodeValid) {
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                message: "User verified successfully"
            }, { status: 200 })
        
        } else if (!isCodeExpired) {
            return Response.json({
                success: false,
                message: "verified code is expired please login to the account"
            }, { status: 200 })
        } else {
            return Response.json({
                success: false,
                message: "Incorrect verification code"
            }, { status: 200 })
        }
        
        
    } catch (error) {
        console.log(error)
        return Response.json({
            success: false,
            message:"Error while verifying user"
        },{status:400})
    }
    
}
