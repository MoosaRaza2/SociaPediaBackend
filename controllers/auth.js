import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'

export const Register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName, lastName, email, password: passwordHash,
            picturePath, friends, location,
            occupation, viewedProfile: Math.floor(Math.random() * 10000),
            impression: Math.floor(Math.random() * 1000)
        })

        const savedUser = await newUser.save();

        res.status(201).json(savedUser)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }

}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: 'user doesnt exist' })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'invalid crendentials' });

        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECERET)
        delete user.password;

        res.status(2000).json({ token, user })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }

}

