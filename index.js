const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const app = express();
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

app.use(
  cors({
    origin: "*",
  })
);
dotenv.config();

app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("Server is Connected to Database");
  } catch (err) {
    console.log("Server is NOT connected to Database", err.message);
  }
};
connectDb();

app.get("/", (req, res) => {
  res.send("API is running123");
});

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server=app.listen(PORT, console.log("Server is Running..."));





// const io= require("socket.io")(server,{
//   cors:(
//     origin: '*'
//   ),
//   pingTimeout:60000,
// });

// io.on("connection",(socket)=>{
//   console.log("socket.io connection esatblished")

//   socket.on("setup",(user)=>{
//     socket.join(user.data._id);
//     socket.emit("connected");
//   });

//   socket.on("join chat", (room)=>{
//     socket.join(room);
//     console.log("User joined room :", room);
//   });

//   socket.on("new message", (newMessageStatus)=>{
//     var chat= newMessageStatus.chat;
//     if(!chat.users){
//       return console.log("chat.user not defined");
//     }
//     chat.user.forEach(element => {
//       if(user._id== newMessageStatus.sender._id) return ;
//       socket.in(user._id).emit("message received", newMessageStatus);
      
//     });
//   });

// }

// );
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  },
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  console.log("socket.io connection established");

  socket.on("setup", (user) => {
    socket.join(user.data._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room:", room);
  });

  socket.on("new message", (newMessage) => {
    var chat = newMessage.chat;
    if (!chat.users) {
      return console.log("chat.users not defined");
    }
    chat.users.forEach(element => {
      if (element._id == newMessage.sender._id) return;
      socket.in(element._id).emit("message received", newMessage);
    });
  });

});
