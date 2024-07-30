import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { SendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        console.log(`Received data - Username: ${username}, Email: ${email}, Password: ${password}`);

        if (!username || !email || !password) {
            return Response.json({
                success: false,
                message: "All fields are required",
            }, { status: 400 });
        }

        if (typeof username !== 'string' || username.trim() === '') {
            return new Response(JSON.stringify({
                success: false,
                message: "Invalid username"
            }), { status: 400 });
        }

        
        const existingUserByUsername = await UserModel.findOne({ username });
        console.log("Existing user by username:", existingUserByUsername);
        if (existingUserByUsername) {
            return new Response(JSON.stringify({
                success: false,
                message: "Username is already taken"
            }), { status: 400 });
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(Math.random() * 90000000 + 10000000).toString();
        console.log("Existing user by email:", existingUserByEmail);

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: 'User already exists with this email',
                }, { status: 400 });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        } else {
            const hashPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            });
            await newUser.save();
        }

        const emailResponse = await SendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 });
        }

        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your email."
        }, { status: 201 });

    } catch (error) {
        console.error("Error while registering user", error);
        return new Response(JSON.stringify({
            success: false,
            message: "Error while registering user"
        }), { status: 500 });
    }
}
