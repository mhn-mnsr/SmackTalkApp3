let user
$(document).ready(()=>{
    $.getJSON('/api/getProfile', data=>{
        user = data
        document.getElementById("greeting").innerHTML = `<h2>Hi, ${data.firstName || 'user'}!</h2>`
    })
    $.getJSON('/api/getUserTeams',data=>{
        data._teams.forEach(e => {
            document.getElementById('teams').innerHTML += `<li><div class="chat-left-detail"><p>${e.teamName}</p></div></li>`
        });
    })
    $.getJSON('/api/getTeamsMessages', data=>{
        console.log(data._teams[0])
        // document.getElementById('tid').attributes.tid = data._teams[0]._id
        document.getElementById('tid').value = data._teams[0]._id
        data._teams[0]._messages.forEach( m =>{
            if (m.user == !user._id){
                document.getElementById('messages').innerHTML += `<li><div class="rightside-left-chat">
                                                                <span><i class="fa fa-circle" aria-hidden="true"></i> OPPOSITE MAN
                                                                <small>${m.createdAt}</small></span><br><br><p>${m.message}</p></div></li>`
            }else{
                document.getElementById('messages').innerHTML += `<li><div class="rightside-right-chat">
                                                                <span><i class="fa fa-circle" aria-hidden="true"></i> ${user.username} 
                                                                <small>${m.createdAt}</small></span><br><br><p>${m.message}</p></div></li>`
            }
        })
    })
})
let activeTeam = 
socket = io.connect('http://localhost:8000')
socket.on('message', (server)=>{
    console.log('display message')
    console.log(server)
})