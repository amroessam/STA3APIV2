const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const User = mongoose.model('User')
const Team = mongoose.model('Team')

const secret = require('../config/config').secret
// const config = require('../config/config')
const fs = require('fs')
const path = require('path')
module.exports = {
    index(req, res) {
        res.send('TEAM ROUTE')
    },
    getAllTeams(req, res) {
        let token = req.headers.authorization
        token = token.substr(token.indexOf(' ') + 1)
        try {
            jwt.verify(token, secret, (err, decoded) => {
                User.findOne({ _id: decoded.id }, (err, user) => {
                    if (user) {
                        user.password = null
                        res.status(200).json({ auth: true, teams: user._teams })
                    } else {
                        res.status(400).json({ auth: false, message: 'Invalid token.' })
                    }
                })
            })
        } catch (err) {
            console.log(err)
            res.status(401).json({ auth: false, message: 'User doesn\'t exist.' })
        }
    },
    getAdminTeams(req, res) {
        let token = req.headers.authorization
        token = token.substr(token.indexOf(' ') + 1)
        try {
            jwt.verify(token, secret, (err, decoded) => {
                User.findOne({ _id: decoded.id }, (err, user) => {
                    if (user) {
                        user.password = null
                        res.status(200).json({ auth: true, teams: user._adminTeams })
                    } else {
                        res.status(400).json({ auth: false, message: 'Invalid token.' })
                    }
                })
            })
        } catch (err) {
            console.log(err)
            res.status(401).json({ auth: false, message: 'User doesn\'t exist.' })
        }
    },
    createNewTeam(req, res) {
        let token = req.headers.authorization
        token = token.substr(token.indexOf(' ') + 1)
        try {
            jwt.verify(token, secret, (err, decoded) => {
                User.findOne({ _id: decoded.id }, (err, user) => {
                    if (user) {
                        let newTeam = new Team({
                            teamName: req.body.teamName,
                            teamDescription: req.body.teamDescription
                        })
                        newTeam._adminMembers.push(decoded.id)
                        newTeam._members.push(decoded.id)
                        newTeam.save((err)=>{
                            if(err){
                                console.log(err)
                                return res.status(400).json({success:false,message:'An Error has occured'})
                            }
                            user._teams.push(newTeam._id)
                            user._adminTeams.push(newTeam._id)
                            console.log(user)
                            user.save()
                        })
                        return res.status(200).json({ success: true, teams: user._adminTeams })
                    } else {
                        res.status(400).json({ auth: false, message: 'Invalid token.' })
                    }
                })
            })
        } catch (err) {
            console.log(err)
            res.status(401).json({ auth: false, message: 'User doesn\'t exist.' })
        }
    }

}
