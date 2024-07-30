import { User } from '../../../../models/user.model';
import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
    const messageId = params.messageId;
    await dbConnect()
    console.log(`Deleting message with ID: ${messageId}`);

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User
    if (!session || !session.user) {
        console.log("Not authenticated");
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 400 })
    }
    try {
        console.log(`User ID: ${user._id}`);
        console.log(`Message ID: ${messageId}`);
        console.log("before the update")
        const updateResult = await UserModel.updateOne(
            { _id: user._id, 'messages._id': messageId },
            { $pull: { messages: { _id: messageId } } }
        );
        console.log(`User ID: ${user._id}`);
        console.log(`Message ID: ${messageId}`);
        console.log(`Update Result: ${JSON.stringify(updateResult)}`);

        if (updateResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted"
            }, { status: 404 });
        }
        return Response.json({
            success: true,
            message: "Message deleted successfully"
        }, { status: 200 })
            
    } catch (error) {
        console.error("Error deleting message:", error);
        return Response.json({
            success: false,
            message: "Error while deleting the message"
        }, { status: 500 })
    }


}

