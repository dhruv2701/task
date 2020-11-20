const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const Read = require('./models/read');


const app = express();
const port = process.env.PORT || 9000;
const dbUrl = "mongodb://localhost:27017/nodetask";
mongoose.connect(dbUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.get("/",(req,res)=>{
    res.render("form");
})


// user reading duration
let start_date=0,end_date=0;
let userDuration = 0;
app.get("/user",async (req,res)=>{
    try{
        const User = await Read.find({user:"Dhruv"});

        for(let i=0;i<User.length;i++){
            if(User[i].event_type === "start")
            {
                start_date = (start_date + User[i].timeStamp.valueOf())/1000;
            }
            else if(User[i].event_type === "end")
            {
                end_date = (end_date + User[i].timeStamp.valueOf())/1000;
            }    
        }
        userDuration = Math.floor(Math.abs(end_date - start_date))
        res.send(`Reading duration of given user is ${userDuration/60} minutes`);
    }
    catch(e){
        res.status(500).send(e);
    }
});


//no of users read the same book
app.get("/book", async(req,res)=>{
    try{
        const book = await Read.find({book:"helen keller"});   

        let Users = book.map(u=>{
            return u.user;
        }).filter((elem,index,self)=>{
            return index == self.indexOf(elem)
        });

        const totalUsers = Users.length;
        if(totalUsers<=0)
        {
            res.send(`sorry, No users are following this book`);
        }
        else
        {
            res.send(`Uses are :-${Users}`);
        }
    }
    catch(e){
        res.status(500).send(e);
    }
});


// total reading of a given day
let start_type=0,end_type=0;
let allusersDuration;

app.get("/date",async (req,res)=>{
    try{
        let User = await Read.find({date:req.query.date});
        for(let i=0;i<User.length;i++){
            if(User[i].event_type === "start")
            {
                start_date = (start_date + User[i].timeStamp.valueOf())/1000;
            }
            else if(User[i].event_type === "end")
            {
                end_date = (end_date + User[i].timeStamp.valueOf())/1000;
            }       
        }
        allusersDuration = Math.floor(Math.abs(end_date - start_date))
        res.send(`Reading duration of all users is ${allusersDuration/60} minutes`);
    }
    catch(e){
        res.status(500).send(e);
    }
});     
app.get("/books",async (req,res)=>{
    const books = await Read.find({});
    res.send(books);
})  
app.post("/books",async (req,res)=>{
    req.body.read.timeStamp = new Date();
    const books = await Read.create({...req.body.read});
    res.redirect("/");
});

app.listen(port,function(){
	console.log(`server is on port ${port}`)
});