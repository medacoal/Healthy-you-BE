import { register, login } from "../controllers/auth.js";
import express from "express"
import { authCheck } from "../middlewares/auth.js";

const router = express.Router();

router.post('/register', register)
router.post('/login',authCheck, login);

export default router;