import { User } from "../models/userModel.js"
export const callbackAuth = async(req, res, next) =>{

    try {
        const {id, firstName, lastName, userImgUrl} = req.body
        let isFirstLogin = false;
        const user = await User.findOne({clerkId: id})
 
         if (!user) {
            isFirstLogin = true;
             await User.create({
                 clerkId: id,
                 userName: `${firstName || ""} ${lastName || ""}`.trim(),
                 userImgUrl: userImgUrl
             })
         }
         res.status(200).json({success: true, isFirstLogin})
    } catch (error) {
         console.log("Error in auth callback")
         next(error);
    }
}
