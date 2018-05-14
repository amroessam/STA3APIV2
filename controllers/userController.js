const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const User = mongoose.model('User')
const secret = require('../config/config').secret
// const config = require('../config/config')
const fs = require('fs')
const path = require('path')
module.exports = {
    index(req,res){
        res.send('USER ROUTE')
    },
    register(req,res){
        if(!req.body.email || req.body.email == '') return res.status(500).json({auth: false, message: 'Email is required.'})
        if(!req.body.username || req.body.username == '') return res.status(500).json({auth: false, message: 'Username is required.'})
        if(!req.body.password || req.body.password == '') return res.status(500).json({auth: false, message: 'Password is required.'})
        if(Object.keys(req.body.password).length < 6) return res.status(500).json({auth: false, message: 'Password must be a minimum of 6 characters.'})
        let newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
        })
        newUser.save((err)=>{
            if(err){
                console.log(err)
                if(err.errors['email']){
                    if(err.errors['email'].kind == 'unique' && err.errors['email']) return res.status(400).json({auth:false,message:'This email has been used before, please check your inbox on how to recover your password.'})
                }
                if(err.errors['username']){
                    if(err.errors['username'].kind == 'unique' && err.errors['username']) return res.status(400).json({auth:false,message: 'This username has been used before, please check your inbox on how to recover your password.'})
                }
                else return res.status(400).json({auth:false,message:'Unexpexted Error'})
            }
            newUser.password = null
            res.send({auth:true,message:'User created succesfully.',user:newUser})
        })

    },
    login(req,res){
        User.findOne({username:req.body.username}, (err,user)=>{
            if (err) return res.json(err)
            if(!user) return res.status(401).json({auth:false, message:'Can\'t login with these credentials.'})
            else user.comparePassword(req.body.password,(err,isMatch)=>{
                if (isMatch && !err){
                    let token = jwt.sign({id:user._id},secret,{expiresIn:6000})
                    user.password = null
                    return res.status(202).json({auth:true, token: 'Bearer ' + token,user})
                } else return res.status(401).json({auth:true, message:'Can\'t login with these credentials.'})
            })
        })
    },
    auth(req,res){
        let token = req.headers.authorization
        token = token.substr(token.indexOf(' ')+1)
        try{
            jwt.verify(token,secret,(err,decoded)=>{
                User.findOne({_id:decoded.id},(err,user)=>{
                    if(user){
                        user.password = null
                        res.status(200).json({auth:true,user:user})
                    }else{
                        res.status(400).json({auth:false,message:'Invalid token.'})
                    }
                })
            })
        }catch(err){
            console.log(err)
            res.status(401).json({auth:false,message:'User doesn\'t exist.'})
        }
    }
}
