const express = require("express")
const bcrypt = require("bcrypt")
const { validationResult } = require('express-validator')
const { loginDetailsChecker,checkUserDetails } = require("./middleware/validation")
const cors = require("cors")
const fs = require("fs")
const PORT = 5000
const SALT = 10
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


// POST sign_up ,must not contain username or email
app.post('/sign_up',checkUserDetails,async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors.array())
        return res.status(400).json({success:false})
    }
    const { name, email, password } = req.body
    try{
        const hashedPwd = bcrypt.hashSync(password,SALT)
        let obj = {
            name,
            email,
            password:hashedPwd
        }
        let data = JSON.stringify(obj)

        fs.writeFile('./db.JSON',data,(err)=>{
            if(err)
                return res.status(400).json({success:false})
            return res.status(201).json({success:true})
        })
    }catch(err){
        console.error('An error occured',err)
        return res.status(400).json({success:false})
    }
})

// POST sign_in
app.post('/sign_in',loginDetailsChecker,async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors.array())
        return res.status(400).json({success:false})
    }
    const { email, password } = req.body
    try{
        fs.readFile('./db.JSON',(err,data)=>{
            if(err)
                return res.status(400).json({success:false})
            const dataArr = JSON.parse(data)
            const entry = dataArr.filter(element => element.email === email)
            console.log(`entry`, entry)
            if(!entry[0])
                return res.status(400).json({success:false})
            else{
                let bool = bcrypt.compareSync(password,entry[0].password)
                if(!bool)
                    return res.status(400).json({success:false})
                return res.status(200).json({success:true})
            }
        })  
    }catch(err){
        console.error('An error occured',err)
        return res.status(400).json({success:false})
    }
})

// POST clean {sucess:true}
app.post('/clean',async (req,res)=>{
    try{
        fs.readFile('./db.JSON',(err,data)=>{
            const dataObj = JSON.parse(data)
            delete dataObj
        })
    }catch(err){
        console.error('An error occured',err)
        return res.json({success:false})
    }
})

app.listen(PORT,()=>{
    console.log(`Running on PORT: ${PORT}`)
})