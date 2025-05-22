const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("welcome to the home page");
});

app.use('/about',(req,res)=>{
    res.send('about page')
})

app.use('/test',(req,res)=>{
    res.send('test case 1')
})

app.listen(7777)
