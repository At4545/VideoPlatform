import { Router } from "express";
import {  userRegister,userLogin, userLogout,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,updateUserAvatar,updateUserCoverImage,  getUserChannelProfile,
    getWatchHistory,
    validateEmailOrUserName} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    userRegister)
 
router.route("/login").post(userLogin)


router.route("/logout").post(verifyJWT,userLogout)
router.route("/refresh-token").get(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/update-cover").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
//TODO:TEST 
//to be tested it later when subscription is ready
router.route("/c/:userName").get(verifyJWT,getUserChannelProfile)
// to be tested it later when user will watch some constent
router.route("/history").get(verifyJWT,getWatchHistory)
router.route("/check/:id").get(validateEmailOrUserName)



export default router
