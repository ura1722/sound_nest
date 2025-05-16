import { User } from "../models/userModel.js"
export const callbackAuth = async(req, res, next) =>{

    try {
         const {id, firstName, lastName, userImgUrl} = req.body
 
         const user = await User.findOne({clerkId: id})
 
         if (!user) {
             await User.create({
                 clerkId: id,
                 userName: `${firstName} ${lastName}`,
                 userImgUrl: userImgUrl
             })
         }
         res.status(200).json({success: true})
    } catch (error) {
         console.log("Error in auth callback")
         next(error);
    }
}
