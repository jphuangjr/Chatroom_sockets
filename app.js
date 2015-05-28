var express = require("express");
var bodyparser = require("body-parser");
var app = express();
var querystring = require("querystring");
var server = app.listen(8000);
var path = require("path");

app.use(express.static(path.join(__dirname, "/static")));
app.use(bodyparser.urlencoded());
app.set("views" , __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", function (request, response){
	response.render("chat");
});

var io = require("socket.io").listen(server);
var chat = [];
io.sockets.on("connection", function (socket){
	io.emit("all_chat", chat);
	socket.on("user_joined", function (data){
		socket.broadcast.emit("new_user", data)
	});
    socket.on("clear_chat", function (){
        chat = []
        io.emit("all_chat", chat)
    });
	socket.on("user_message_name", function (data){
		var message = querystring.parse(data[1]);
		chat.push([data[0], message.message]);
		console.log(chat);
		io.emit("all_chat", chat);
	});

});

