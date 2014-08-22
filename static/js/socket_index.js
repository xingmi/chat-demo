/*
 * 初始化事件注册和监听
 */

(function(){
    var socket = io();
    var name;
    //用户接入
    socket.emit('userVistor')
    socket.on('userVistor',function(initData){
        $("#allUser h2 em").text(initData.count);
        $("#allUser div").remove();
        initData.userArray.forEach(function(i){
            $("#allUser").append($('<div>').text(i))
        });
    });
    // name = prompt("输入姓名后即可进入聊天室")
    //用户登陆
    if(name != "" && name != "null" ){
        socket.emit('userConnect',name);
        socket.on('userConnect',function(user){

            $("#allUser").append($('<div>').text(user.username))
            $("#allUser h2 em").text(user.count)
        });
    }

    //用户发送消息
    $('form').submit(function(){
        socket.emit('sendMessage', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('sendMessage', function(msg){
        $('#messages').append($('<li>').text(msg.user + "说:" + msg.message));
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
    });

    // @某人
    socket.on('atSomeOne',function(msg){
        document.title = msg
    });

    //用户离开
    socket.on('disconnect',function(userLeave){
        $("#allUser h2 em").text(userLeave.count);
        $("#allUser div").each(function(i){
            if($("#allUser div").eq(i).text() == userLeave.username ){
                $("#allUser div").eq(i).remove();
            }
        })
    });

})()