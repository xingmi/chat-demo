var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var global = {
    count : 0,
    userArray : []
}
app.get('/',function(req,res){
    res.sendfile('index.html');
});
io.on('connection',function(socket){
    var global_connection;

    //用户接入
    socket.on('userVistor',function(){
        io.emit('userVistor',global)
    });

    //用户登陆
    socket.on('userConnect',function(username){
        global.count += 1;
        if( global.userArray.indexOf(username) >= 0 ){
            username = username + Math.floor((Math.random() * 1000) );
        }
        global.userArray.push(username);
        global_connection = {
            username : username,
            count : global.count
        };    
        console.log(global_connection.username +' has connected');
        io.emit('userConnect',global_connection)
    });

    //用户发送消息
    socket.on('sendMessage',function(message){
        var userChat = {
            user :  global_connection.username,
            message  : message
        };
        io.emit('sendMessage', userChat);
    })

    //用户离开
    socket.on('disconnect',function(){
        global.count -= 1;
    });
})
http.listen(3000,function(){
    console.log('listen on port 3000')
});