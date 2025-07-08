const express = require('express')
const router = express.Router()
const {Department,Employee} = require('../models/model')
const auth = require('../middleware/auth')
//creating a new department

router.post('/',auth,async(req,res)=>{
    const {name,description} = req.body
    try {
        const department = new Department({name,description})
        await department.save()
        res.status(201).json(department)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// get all the departments
router.get('/',async(req,res)=>{
    
    try {
        const departments = await Department.find().populate('managerId','firstName lastName')
        res.status(200).json(departments);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// get a single department
router.get('/:id',async(req,res)=>{
        try {
             const department = await Department.findById(req.params.id).populate('managerId','firstName lastName')
        if(!department){
            return res.status(404).json({ message: "Department not found" });
        }
        res.status(200).json(department);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    
})


// update a department
router.put('/:id',auth,async(req,res)=>{
    try {
        const {name,description,managerId} = req.body
        
        // const managerExist = await Employee.findById(managerId)
        // if(!managerExist){
        //     return res.status(404).json({ message: "Manager not found" });
        // }
        const department = await Department.findByIdAndUpdate(
          req.params.id,
          { name, description, managerId,updatedAt:Date.now() },
          { new: true }
        );
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// deleting a department 
router.delete('/:id',auth,async(req,res)=>{
    try {
        const department = await Department.findByIdAndDelete(req.params.id);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.status(200).json({ message: "Department deleted successfully" });
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
})

module.exports = router