import Class from '../models/Class.js'
import User from '../models/User.js'
import sanitizeBody from '../middleware/sanitizeBody.js'
import ResourceNotFound from '../exceptions/ResourceNotFound.js'
import authUser from '../middleware/authUser.js'
import mongoose from 'mongoose'
import express from 'express'
import requireAdmin from "../middleware/requireAdmin.js"

const router = express.Router()

router.get('/',authUser, requireAdmin, async (req, res) => {
    const collection = await Person.find()
    res.send({ data: collection })
})


router.post('/', authUser, sanitizeBody, requireAdmin, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        const newPerson = new Class(req.sanitizedBody)
        newPerson.owner = user._id
        await newPerson.save()
        res.status(201).send({ data: newPerson })
    } catch (err) {
        next(err)
    }

})

router.get('/:id', authUser, requireAdmin, async (req, res, next) => {
    try {
        await validateId(req.params.id)
        
        const person = await Class.findById(req.params.id).populate('gifts')
        res.send({ data: person })
    } catch (err) {
        next(err)
    }
})

const update = (overwrite = false) => async (req, res, next) => {
    try {
        await validateId(req.params.id)
        const person = await Class.findByIdAndUpdate(
        req.params.id,
        req.sanitizedBody,
        {
            new: true,
            overwrite,
            runValidators: true,
        }
        )
        res.send({ data: person })
    } catch (err) {
        next(err)
    }
    }

router.put('/:id', authUser, sanitizeBody, requireAdmin, update(true))
router.patch('/:id', authUser, sanitizeBody, update(false))

router.delete('/:id', authUser, requireAdmin, async (req, res, next) => {
    try {
        await validateId(req.params.id)
        const person = await Class.findByIdAndRemove(req.params.id)
        res.send({ data: person })
    } catch (err) {
        next(err)
    }
})

const validateId = async id => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        if (await Person.countDocuments({_id: id})) return true
    }
    throw new ResourceNotFound(`Could not find a person with id ${id}`)
}

export default router