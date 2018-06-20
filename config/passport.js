const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
const User = mongoose.model('User')
const secret = require('../config/config').secret

module.exports = (passport) =>{
    let opts = {}
    opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken()
    opts.secretOrKey = secret
    passport.use(new JWTStrategy(opts,(payload,done)=>{
        User.find({id:payload._id}, (err,user)=>{
            if(err) return done(err,false)
            if(user) return done(null,user)
            else return done(null,false)
        })
    }))
}
