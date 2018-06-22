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
                        let teams = user.populate({path:'_teams',select:'teamName'})
                        res.status(200).json({ auth: true, teams: teams })
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
                    if(err){
                        return res.status(400).json({ auth: false, message: 'Token expired please log in again.' })
                    }
                    if (user) {
                        let newTeam = new Team({
                            teamName: req.body.teamName,
                            teamDescription: req.body.teamDescription
                        })
                        newTeam._adminMembers.push(decoded.id)
                        newTeam._members.push(decoded.id)
                        newTeam.save((err)=>{
                            if(err){
                                return res.status(400).json({success:false,message:'An Error has occured'})
                            }
                            user._teams.push(newTeam._id)
                            user._adminTeams.push(newTeam._id)
                            user.save()
                        })
                        return res.status(200).json({ success: true, teamID: newTeam._id })
                    } else {
                        return res.status(400).json({ auth: false, message: 'Invalid token.' })
                    }
                })
            })
        } catch (err) {
            console.log(err)
            res.status(401).json({ auth: false, message: 'User doesn\'t exist.' })
        }
    },
    addTeamMember(req,res){
        let token = req.headers.authorization
        token = token.substr(token.indexOf(' ') + 1)
        try {
            jwt.verify(token, secret, async function(err, decoded){
                // const decoded = jwt.verify(token, secret)
                try{
                    const team = await Team.findOne({_id:req.body.teamID})
                    const user = await User.findOne({_id:req.body.userID})
                    console.log(req.body.userID)
                    console.log(user)
                    const member = await User.findOne({username:req.body.newTeamMember})
                    user._adminTeams.forEach(t=>{
                        if(t.toString() === req.body.teamID){
                            team._members.push(member._id)     
                            if(req.body.newTeamMemberAdmin){
                                team._adminMembers.push(member._id)
                                member._adminTeams.push(team._id)
                            }
                            member._teams.push(team._id)
                            team.save()
                            member.save()
                            //TODO: look into what to add to the below json
                            return res.status(200).json({ success: true })
                        }
                    })
                }
                catch(err){
                    console.log(err)
                }
            })
        } catch (err) {
            console.log(err)
            res.status(401).json({ auth: false, message: 'User doesn\'t exist.' })
        }
    }
}
