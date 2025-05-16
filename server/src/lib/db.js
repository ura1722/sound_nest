import mongoose from "mongoose"

export const connDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.DB_URI)
        console.log("Conneted")
    }catch(error)
    {
        
        console.log("Failed to connect to db")
        process.exit(1)
    }

}
