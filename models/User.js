import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'
import uniqueValidator from 'mongoose-unique-validator'
import mongoose from 'mongoose'
import config from 'config'

const saltRounds = 14
const secretKey = 'secretKey'

const schema = new mongoose.Schema({
    firstName: {type: String, required: true, maxLength: 64},
    lastName: {type: String, required: true, maxLength: 64},
    email: {
        type: String,
        required: true, 
        maxLength: 512, 
        unique: true,
        set: (value) => value.toLowerCase(),
        validate: {
            validator: (value) => validator.isEmail(value),
            message: (props) => `${props.value} is not a email address.`
        }
    },
    password: {type: String, required: true, maxLength: 70},
    isAdmin: {type: Boolean, Required: true, default: false}
})

schema.methods.generateAuthToken = function () {
    const payload = { uid: this._id }
    return jwt.sign(payload, secretKey, {
        expiresIn: '1h',
        algorithm: 'HS256'
    })
}

schema.methods.toJSON = function () {
    const obj = this.toObject()
    delete obj.password
    delete obj.__v
    return obj
}

schema.statics.authenticate = async function (email, password) {
    const user = await this.findOne({email: email})
    const badHash = `$2b${saltRounds}$invalidusernaaaaaaaaaaa`
    const hashedPassword = user ? user.password : badHash
    const passwordDidMatch = await bcrypt.compare(password, hashedPassword)
    return passwordDidMatch ? user : null
}

schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, saltRounds)
    next()
})

schema.plugin(uniqueValidator, {
    message: (props) => {
        if (props.path === 'email') {
            return `The email address ${props.value} is already in use.`
        } else {
            return `The ${props.path} must be unique. '${props.value}' is already registered.`
        }
    },
})

const Model = mongoose.model('User', schema)

export default Model