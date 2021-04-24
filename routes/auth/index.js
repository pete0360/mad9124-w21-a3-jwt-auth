import User from '../../models/User.js'
import sanitizeBody from '../../middleware/sanitizeBody.js'
import authUser from '../../middleware/authUser.js'
import express from 'express'

const router = express.Router()

router.post('/users', sanitizeBody, async (req, res, next) => {
    new User(req.sanitizedBody)
    .save()
    .then((newUser) => res.status(201).send({data: newUser}))
    .catch(next)
})

router.get('/users/me', authUser, async (req, res) => {
    const user = await User.findById(req.user._id)
    res.send({ data: user })
})

router.patch('/users/me', authUser, sanitizeBody, async (req, res) => {
    const user = await User.findById(req.user._id)
    user.password = req.sanitizedBody.password
    user.save()
    res.send({ data: user })
})

router.post('/tokens', sanitizeBody, async (req, res) => {
    const { email, password } = req.sanitizedBody
    const authenticatedUser = await User.authenticate(email, password)

    if (!authenticatedUser) {
        return res.status(401).send({
        errors: [
            {
                status: '401',
                title: 'Incorrect username or password',
            },
        ],
        })
    }

    res
    .status(201)
    .send({ data: { token: authenticatedUser.generateAuthToken() } })
})




export default router