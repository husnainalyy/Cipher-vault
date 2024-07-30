import mongoose, { Connection } from 'mongoose'


type connectionObject = {
    isConnected?:Number
}

const connection: connectionObject = {}


export async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("The mongo db is already connected");
        return 
    }
    
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {
        });
        connection.isConnected = db.connection.readyState
        console.log("Connected Successfully");
        
        
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1)
    }
}

