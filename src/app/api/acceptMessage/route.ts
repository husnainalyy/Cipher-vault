import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";



export async function POST(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    const userId = user._id
    const { acceptMessage } = await request.json()
    try {
        const updateUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessage: acceptMessage }, { new: true })
        if (!updateUser) {
            return Response.json({
                success: false,
                message: "failed to update status of accepting message",
                updateUser
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            message: "Update status of accepting message successfully"
        }, { status: 200 })



    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "Error while updating status of accepting message"
        }, { status: 404 })
    }



}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return new Response(JSON.stringify({
            success: false,
            message: "Not Authenticated"
        }), { status: 401 });
    }

    const userId = user._id;
    try {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return new Response(JSON.stringify({
                success: false,
                message: "User not found"
            }), { status: 404 });
        }
        return new Response(JSON.stringify({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage
        }), { status: 200 }); // Changed status code to 200

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({
            success: false,
            message: "Error while fetching user status"
        }), { status: 500 }); // Changed status code to 500 for internal server errors
    }
}
