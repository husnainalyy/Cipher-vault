import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

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

    const userId = new mongoose.Types.ObjectId(user._id);
    console.log(`User ID: ${userId}`); // Debugging statement

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $addFields: { messages: { $ifNull: ["$messages", []] } } },
            { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ]);

        if (!user || user.length === 0) {
            return new Response(JSON.stringify({
                success: false,
                message: "User not found"
            }), { status: 401 });
        }
        return new Response(JSON.stringify({
            success: true,
            messages: user[0].messages
        }), { status: 200 });

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({
            success: false,
            messages: "Error while getting messages"
        }), { status: 500 });
    }   
}