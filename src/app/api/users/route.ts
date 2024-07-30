import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    // if (!session || !session.user) {
    //     return new Response(JSON.stringify({
    //         success: false,
    //         message: "Not Authenticated"
    //     }), { status: 401 });
    // }

    try {
        const users = await UserModel.find({}, 'username'); // Fetch all users, only return the username field

        return new Response(JSON.stringify({
            success: true,
            users: users
        }), { status: 200 });

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({
            success: false,
            message: "Error while getting users"
        }), { status: 500 });
    }
}