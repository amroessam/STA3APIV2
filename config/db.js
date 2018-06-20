const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URI || 'mongodb://localhost/sta3api').catch((err)=>{
    console.log(err)
})
