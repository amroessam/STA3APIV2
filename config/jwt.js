const passport = require('passport')
module.exports = {
    auth() {
        return passport.authenticate('jwt', { session: false })
    }
}