import jwt from "jsonwebtoken";

import User from "../models/User";

import  { checkPassword } from "../services/auth";

import authConfig from "../config/auth";


class SessionController {
    async create (req,res){
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "User / Password invalid."});
        }

        const passwordChecked = await checkPassword(user, password);

        if (!passwordChecked) return res.status(401).json({ message: "User / Password Invalid." });

        const { id } = user;

        return res.json({
            user: {
                id,
                email
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expires,
            })
        });
    }
}

export default new SessionController();