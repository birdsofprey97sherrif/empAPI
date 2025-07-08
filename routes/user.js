const express = require("express")
const router = express.Router()
const {User} = require("../models/model")
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')
// view all users
router.get("/",auth,async(req,res)=>{
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// getting a single user

router.get('/:id',async (req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// update 
router.put("/:id",async (req,res)=>{
    try {
        const {name,email,password}=req.body
        const user = await User.findById(req.params.id)
        console.log(user)
        if (!user) {
            return res.status(404).json("user does not exist/not found");
        }
        //prepare the data that we will update with
        let updatedData = {name,email}
        if (password){
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password,salt)
        }
        //update user
        const updateUser = await User.findByIdAndUpdate(req.params.id,updatedData,{new:true})

        res.status(201).json(updateUser)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//delete user

router.delete("/:id",auth,async (req,res)=>{
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        //check the person you are deleting exist
        if (!deleteUser) {
          return res.status(404).json({ message: "User not found" });
        }
        //if user is found 
        res.json({message:"User successfully deleted"})
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
})

// export router 
module.exports = router