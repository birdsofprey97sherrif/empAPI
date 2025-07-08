const express = require('express')
const mongoose = require('mongoose')
//we need the dot env which has our configuration info
require("dotenv").config()
const app =express()

app.use(express.json())

app.use('uploads',express.static('uploads'))

const auth = require('./routes/auth')
app.use('/api/emp',auth)

const user = require('./routes/user')
app.use('/api/user',user)

const department = require('./routes/dept')
app.use('/api/department',department)

const employees = require('./routes/employees')
app.use('/api/employees',employees)
// connecting to mongo db 
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("MongoDB Connected")
    })
    .catch(err=>console.log("MongoDB Connection error",err))
const PORT=3000
app.listen(PORT,()=>{
    console.log("server is running on port ",PORT)
})