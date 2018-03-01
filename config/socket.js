const mongoose = require("mongoose");
const User = mongoose.model('User')
const Team = mongoose.model('Team')



module.exports = (io) => {

    io.sockets.on('connection', (socket) => { //step1
        socket.on('message', (msgcontainer) => {//step2
            Team.addTeamMessage(msgcontainer)//step3
            io.sockets.emit('message', msgcontainer)
        });
    });




};