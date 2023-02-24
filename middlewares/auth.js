import { Jwt } from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {

    try {

        let token = req.header("Authorization");
        if (!token) {
            res.status(401).send("Access Denied")
        }

        if (token.startsWith("Bearer")) {
            token = token.slice(7, token.length).trimleft()
        }

        const verified = jwt.verify(token, process.env.JWT_SECERET);
        req.user = verified;
        next();

    } catch (err) {
        res.status(500).json({ message: err.message })
    }

}