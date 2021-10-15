const express = require("express") 
const bcrypt = require("bcrypt") 
// const cors = require("cors") 
const fs = require("fs") 
const PORT = 5000 
const SALT = 10 
const app = express() 
 
// app.use(cors()) 
app.use(express.json()) 
app.use(express.urlencoded({extended:true})) 
 
 
// POST sign_up ,must not contain username or email 
app.post('/api/sign_up',async (req,res)=>{ 
    const { name, email, password } = req.body 
    try{ 
        if(name==="" || name === null || name ===undefined) 
            return res.status(400).json({success:false}) 
        let emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ 
        let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/ 
 
        let emailParts = email.split("@"); 
        if((password.indexOf(emailParts[0]) > -1 || password.indexOf(emailParts[1].split(".")[0]) > -1) || password.indexOf(name) >-1) 
            return res.status(400).json({success:false}) 
        if(!emailRegex.test(email) || !passwordRegex.test(password)) 
            return res.status(400).json({success:false}) 
        const hashedPwd = bcrypt.hashSync(password,SALT) 
        let obj = [{ 
            name, 
            email, 
            password:hashedPwd 
        }] 
        let data = JSON.stringify(obj) 
 
        console.log(`data`, data) 
 
         
        fs.writeFile('./db.JSON',data, {'flag':'a'},(err)=>{ 
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
app.post('/api/sign_in',async (req,res)=>{ 
    const { email, password } = req.body 
    try{ 
        let emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ 
        let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/ 
        if(!emailRegex.test(email) || !passwordRegex.test(password)) 
            return res.status(400).json({success:false}) 
        let emailParts = email.split("@"); 
        if(password.indexOf(emailParts[0]) > -1 || password.indexOf(emailParts[1]) > -1) 
            return res.status(400).json({success:false}) 
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
 
// POST clean 
app.post('/api/clean',async (req,res)=>{ 
    try{ 
        fs.writeFile('./db.JSON',"",(err,)=>{ 
            if(err) 
                console.log("Error in delete",err) 
            return res.json({success:true}) 
        }) 
    }catch(err){ 
        console.error('An error occured',err) 
        return res.json({success:false}) 
    } 
}) 
 
app.listen(PORT,()=>{ 
    console.log(`Running on PORT: ${PORT}`) 
})
