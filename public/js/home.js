let aUSER
let sendMessage = () => {
    let msgcontainer = {
        tid: document.getElementById('tid').value,
        user: aUSER._id,
        username: aUSER.username,
        message: document.getElementById('nmessage').value,
        createdAt: new Date().toString()
    }
    socket.emit('message', msgcontainer)
    document.getElementById('messages').innerHTML += `<li><div class="rightside-right-chat">
                                                    <span><i class="fa fa-circle" aria-hidden="true"></i> ${aUSER.username} 
                                                    <small>${msgcontainer.createdAt}</small></span><br><br><p>${msgcontainer.message}</p></div></li>`
    document.getElementById('nmessage').value = ''
}
let isEnter = (e) =>{
    if(e.keyCode == 13){
        sendMessage()
    }
}
let selectDifferentTeam = (el) =>{
    for(elm of el.target.parentNode.parentNode.parentNode.children){
        elm.className = 'team-item'
    }
    el.currentTarget.className = 'team-item selected'
    document.getElementById('messages').innerHTML = ''
    $.getJSON('/api/getTeamsMessages',data=>{
        document.getElementById('tid').value = el.currentTarget.id
        for (team of data._teams){
            if(team._id == el.currentTarget.id){
                team._messages.forEach(m =>{
                    if (m.user !== aUSER._id) {
                        document.getElementById('messages').innerHTML += `<li><div class="rightside-left-chat">
                                                                        <span><i class="fa fa-circle" aria-hidden="true"></i> ${m.username}
                                                                        <small>${m.createdAt}</small></span><br><br><p>${m.message}</p></div></li>`
                    } else {
                        document.getElementById('messages').innerHTML += `<li><div class="rightside-right-chat">
                                                                        <span><i class="fa fa-circle" aria-hidden="true"></i> ${aUSER.username} 
                                                                        <small>${m.createdAt}</small></span><br><br><p>${m.message}</p></div></li>`
                    }
                })
            }
        }
    })
}
$(document).ready(() => {
   
    $.getJSON('/api/getProfile', user => {
        aUSER = user
    }).then(
        $.getJSON('/api/getUserTeams', data => {
            data._teams.forEach((e,i) => {
                if(i==0){
                    document.getElementById('teams').innerHTML += `<li class='team-item selected' id='${e._id}' style='cursor:pointer'><div class="chat-left-detail"><p>${e.teamName}</p></div></li>`
                }else{
                    document.getElementById('teams').innerHTML += `<li class='team-item' id='${e._id}'><div class="chat-left-detail" style='cursor:pointer'><p>${e.teamName}</p></div></li>`
                }
            });
            $('#teams > li').click((el)=>{selectDifferentTeam(el)})
        })
    ).then(
        $.getJSON('/api/getTeamsMessages', data => {
            document.getElementById('tid').value = data._teams[0]._id
            data._teams[0]._messages.forEach(m => {
                if (m.user !== aUSER._id) {
                    document.getElementById('messages').innerHTML += `<li><div class="rightside-left-chat">
                                                                    <span><i class="fa fa-circle" aria-hidden="true"></i> ${m.username}
                                                                    <small>${m.createdAt}</small></span><br><br><p>${m.message}</p></div></li>`
                } else {
                    document.getElementById('messages').innerHTML += `<li><div class="rightside-right-chat">
                                                                    <span><i class="fa fa-circle" aria-hidden="true"></i> ${aUSER.username} 
                                                                    <small>${m.createdAt}</small></span><br><br><p>${m.message}</p></div></li>`
                }
            })
        })
    )
    socket = io.connect('http://localhost:8000')
})

