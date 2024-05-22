//imports
import express from 'express';


const app = express()


//routes

app.get('/', (req, res) => {
    res.send("<h1>Welcome</h1>")
})


//listen
app.listen(8080, () => {
    console.log("Server Is Running sir")
})