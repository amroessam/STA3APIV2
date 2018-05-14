const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator')
const userSchema = mongoose.Schema({
    username: { type: String, unique: [true, 'This username has been used before.'], required: [true, 'Username is required.'] },
    email: { type: String, unique: [true, 'This email has been used before.'], required: [true, 'Email is required.123'] },
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String, required: [true, 'Password is required.']},
    _teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: [] }],
    _adminTeams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: [] }]
}, { timestamps: true })


userSchema.plugin(uniqueValidator)


userSchema.pre('save', function (next) {
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return next(err)
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) return next(err)
                this.password = hash
                next()
            })
        })
    } else {
        return next()
    }
})

userSchema.methods.comparePassword = function (pw, cb) {
    bcrypt.compare(pw, this.password, (err, isMatch) => {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

const User = mongoose.model('User', userSchema)