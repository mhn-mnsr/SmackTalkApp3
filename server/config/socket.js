module.exports = (io)=> {

    io.sockets.on('connection', (socket) =>{
        // console.log('test from server')
        socket.on('message', (data) =>{
            console.log(data);
        });
    });
};
