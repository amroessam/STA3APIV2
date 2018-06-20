//TODO: rewrite config
// const config = require('./config/config')
// config.startup()

//server configurations
const express = require('express')
const bodyparser = require('body-parser')
const app = express()
const router = express.Router()
const mongoose = require('mongoose')

require('./models/User')
require('./models/Team')
const cors = require('cors')
const morgan = require('morgan')
const passport = require('passport')
require('./config/passport')(passport)
app.use(cors())
app.use(morgan('dev'))
app.use(passport.initialize())
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
require('./config/db')


//server routes
const r_user = require('./routes/user')
const r_team = require('./routes/team')
router.use('/user', r_user)
<<<<<<< HEAD
router.use('/user/team', r_team)
=======
router.use('/team', r_team)
>>>>>>> 55c17b0a966013c5aeb16e2262dbc2d29badc3b8
app.use('/api/v2', router)
//server spin up
app.set('port',process.env.API_PORT || 8081)
app.listen(app.get('port'))