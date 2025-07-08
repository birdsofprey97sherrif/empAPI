const express = require('express')
const router = express.Router()

const {Employee,Department} = require('../models/model')
const auth = require('../middleware/auth')
const { now } = require('mongoose')
router.post('/',auth,async(req,res)=>{
   
    try {
         const { email, departmentId } = req.body;
         // check if the Employee exist
         const existEmp = await Employee.findOne({ email });
         if (existEmp) {
           return res.status(400).json({ message: "Employee already exist" });
         }
         // check if the Department exist
         const existDept = await Department.findById(departmentId);
         console.log(existDept)
         if (!existDept) {
           return res
             .status(400).json({ message: "Department does not exist" });
         }
         // create a new Employee
         const employee = new Employee({...req.body, userId:req.user.id});
         const savedEmp = await employee.save();
         res.status(201).json(savedEmp);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// view all departments
router.get("/", auth, async (req, res) => {
  try {
    const emp = await Employee.find().populate('departmentId','name').populate('userId','name')
    res.json(emp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update department
router.put("/:id", auth, async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: Date.now() };

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const updatedEmp = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, } 
    )
      .populate("departmentId", "name")
      .populate("userId", "name");

    if (!updatedEmp) {
      return res.status(500).json({ message: "Update failed" });
    }

    res.json(updatedEmp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.delete("/:id", auth, async (req, res) => {
  try {
    const deleteEmp = await Employee.findByIdAndDelete(req.params.id);
    if (!deleteEmp) {
      return res.status(404).json({ message: "Employee does not exist" });
    }
    res.json({ message: "Employee successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports=router