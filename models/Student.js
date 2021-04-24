import mongoose from "mongoose"

const schema = new mongoose.Schema({
    firstName: {Type: String, Required: true, maxLength: 64},
    lastName: {Type: String, Required: true, maxLength: 64}, 
    nickName: {Type: String, Required: true, maxLength: 64}, 
    email: {Type: String, Required: true, maxLength: 512}
})

const Model = mongoose.model('Student', schema)
export default Model