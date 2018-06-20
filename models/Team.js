const mongoose = require('mongoose')
const User = mongoose.model('User')

const TeamSchema = mongoose.Schema({
    teamName: { type: String },
    teamDescription: { type: String },
    _adminMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    _members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    _pendingMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    _messages: [],
}, { timestamp: true })

const Team = mongoose.model('Team', TeamSchema)