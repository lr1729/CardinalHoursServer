var express = require('express');
var router = express.Router();
import Database from 'better-sqlite3';

// parse application/json
const db = new Database('foobar.db', { verbose: console.log });

const createTable = "CREATE TABLE IF NOT EXISTS users(name TEXT NOT NULL, password TEXT NOT NULL)"
db.exec(createTable)

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/add', (req, res, next) => {
  const { username } = req.body, { password } = req.body;
  if( username === '' || password === '' ){
    res.status(400)
    res.error("Bad request")
    console.log("Not a string")
  } else {
    const stmnt = db.prepare("INSERT INTO users(name, password) VALUES(?, ?)")
    stmnt.run(username, password);
    res.send({msg: `added new user:${username}`});
  }
});

router.get('/all', (req,res) => {
  const stmnt = db.prepare("SELECT * FROM users")
  const users = stmnt.all()
  res.send(users)
})

router.get('/user/:username', (req, res) => {
  const stmnt = db.prepare("SELECT * FROM users WHERE name = ?")
  const { username } = req.params
  const userData = stmnt.get(username)
  res.send(userData)
})
router.get('/delete/:username', (req,res) => {
  const stmnt = db.prepare("DELETE FROM users WHERE name = ?"), {username} = req.params
  stmnt.run(username)
  res.send(`Deleted user: ${username}`)
})
router.get('/update/:username', (req,res) => {
  const sql:string = "UPDATE users SET name = ? WHERE name = ?"
  const stmnt = db.prepare(sql)
  stmnt.get()
  res.send(`Updated user ${req.params.username}`)
})
router.get('/update/:password', (req, res, next) => {

})

const isDuplicateUsername = (username) => {
  const stmnt = db.prepare("SELECT name FROM users"), usernames = stmnt.all()
  for(let i = 0; i<usernames.length; i++) 
    if(username === usernames[i]) return true
  return false
}

module.exports = router;
