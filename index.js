const express = require("express");
const mongoose = require("mongoose");
const Note = require("./models/Note");
const User = require("./models/User");
const app = express();
app.use(express.json({extended: true}));
app.use(express.urlencoded({ extended: true }));
const port = 3000;

mongoose.connect("mongodb+srv://dev-abdullah:Mm55065546@cluster0.nvhbn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log("connected successfully");
}).catch((error) => {
    console.log("error with connecting with the DB", error);
})

// Endpoints to server the HTML
app.get("/", (req, res) => {
  res.sendFile("pages/index.html", { root: __dirname });
});

app.get("/login", (req, res) => {
  res.sendFile("pages/login.html", { root: __dirname });
});

app.get("/signup", (req, res) => {
  res.sendFile("pages/signup.html", { root: __dirname });
});

// Endpoints for APIs
app.post("/getnotes", async (req, res) => {
    let notes = await Note.find({email: req.body.email})
    res.status(200).json({success: true,notes});
  });

  app.post("/login", async (req, res) => {
    let user = await User.findOne(req.body);
    console.log(user);
    if(!user){
        res.status(200).json({success: false, message: "No user found"});
    }
    else{
        res.status(200).json({success: true,user: {email: user.email}, message: "User found"});
    }
  });

  app.post("/signup", async (req, res) => {
    const {userToken} = req.body;
    console.log(req.body);
    let user = await User.create(req.body);
    res.status(200).json({success:true, user: user});
  });

  app.post("/addnote", async (req, res) => {
    const {userToken} = req.body;
    let note = await Note.create(req.body);
    res.status(200).json({success:true, note});
  });

  app.post("/deletenote", async (req, res) => {
    const { noteId } = req.body;
  
    try {
      await Note.deleteOne({ _id: noteId });
      res.status(200).json({ success: true, message: "Note deleted successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to delete note", error: err.message });
    }
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
