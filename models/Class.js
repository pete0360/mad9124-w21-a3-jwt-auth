import mongoose from "mongoose"

const schema = new mongoose.Schema({
code : {type:String, Required: true, maxLength: 16},
title: {type: String, required: true, maxLength: 255},
description: {Type: String, maxLength: 2048}, 
url: {Type: String, maxLength: 512}, 
student: {type: Array }
})

const Model = mongoose.model('Class', schema)

export default Model