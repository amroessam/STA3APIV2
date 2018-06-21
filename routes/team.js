const express = require('express');
const team = express.Router();
const teamController = require('../controllers/teamController')
const passport = require('passport')

team.get('/', teamController.index)
team.get('/getAllTeams', teamController.getAllTeams)
team.post('/newTeam', teamController.createNewTeam)
team.post('/addMember', teamController.addTeamMember)
module.exports = team