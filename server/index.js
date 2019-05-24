require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const app = express()
const { SERVER_PORT, SESSION_SECRET, CONNECTION_STRING } = process.env
const authController = require('./controllers/authController')
const treasureController = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')

app.use(express.json())

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log('DB is set!', db.listTables())
    app.listen(SERVER_PORT, () => {
        console.log(`Magic is happening on ${SERVER_PORT}`)
    })
})


app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);
app.get('/auth/logout', authController.logout);

app.get('/api/treasure/dragon', treasureController.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureController.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureController.addMyTreasure);
app.get('/api/treasure/all', auth.usersOnly, treasureController.getAllTreasure);