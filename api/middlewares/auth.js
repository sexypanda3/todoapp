const jwt = require('jsonwebtoken')

const verifyAuth = (req, res, next) => {
    try {
        let token = req.headers?.authorization?.split(' ')[1]

        if (!token) {
            return res.sendStatus(401)
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);

        if (!user) {
            return res.sendStatus(401)
        }

        req.user = user

        next()
    } catch (e) {
        if (e.message === "jwt expired") {
            return res.status(401).json({ message: "EXPIRED" })
        }

        res.sendStatus(401)
    }
}


module.exports = {
    verifyAuth
}