const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        const exist = await User.findOne({ email })
        if (exist) {
            return res.status(400).json({ message: "Email already exist" })
        }

        const hash = await bcrypt.hash(password, 10)

        let user = await User.create({ fullname, email, password: hash })
        user =  user.toJSON()
        delete user.password

        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '72h' })

        return res.status(200).json({ token, user })
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "Server Error" })
    }
})


router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Email or password is incorrect" })
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.status(400).json({ message: "Email or password is incorrect" })
        }

        user =  user.toJSON()
        delete user.password

        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '72h' })

        return res.status(200).json({ token, user })
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "Server Error" })
    }
})



module.exports = router;