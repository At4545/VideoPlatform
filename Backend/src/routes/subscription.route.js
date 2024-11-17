import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels} from "../controllers/subscription.controller.js"
const router= Router()
router.use(verifyJWT)
router.route("/toogle-subscription/:channelId").post(toggleSubscription)
router.route("/get-subscriber/:channelId").post(getUserChannelSubscribers)
router.route("/get-subscribed/:subscriberId").post(getSubscribedChannels)
export default router
