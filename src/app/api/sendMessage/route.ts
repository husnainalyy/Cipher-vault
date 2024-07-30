import { UserModel } from "@/models/user.model";
import { dbConnect } from "@/lib/dbConnect";
import { Message } from "@/models/user.model";

export async function POST(request: Request) {
    await dbConnect()
    const { username, message } = await request.json()
    console.log('Backend data:', { username, message }); // Debug backend data


    try {
        const user = await UserModel.findOne({username})
        if (!user) {
            return Response.json({
                success: false,
                message: "user not found"
            }, { status: 401 })
        }
        if (!message) {
            return new Response(JSON.stringify({
                success: false,
                message: "Message content is required"
            }), { status: 400 });
        }
        if (!user || !user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User is not accepting messages."
            }, { status: 403 })
        }
        
        const newMessage = { content:message, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json({
            success: true,
            message: "Message send successfully"
        }, { status: 200 })
        
    } catch (error) {
        console.log(error)
        return Response.json({
            success: false,
            message: "Error while sending messages"
        }, { status: 500 })
    }
    
}


