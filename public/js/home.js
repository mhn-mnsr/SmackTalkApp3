let aUSER
let scrollBottom = () => {
    document.getElementById("chat-window").scrollTop = document.getElementById("chat-window").scrollHeight
}
let sendMessage = () => {
    if (document.getElementById('nmessage').value == '') return
    let msgcontainer = {
        tid: document.getElementById('teamName').attributes.tid,
        user: aUSER._id,
        username: aUSER.username,
        message: document.getElementById('nmessage').value,
        createdAt: new Date().toString()
    }
    socket.emit('message', msgcontainer)
    document.getElementById('messages').innerHTML += `<li><p><me>${aUSER.username}:</me> ${msgcontainer.message}</p></li>`
    scrollBottom()
    document.getElementById('nmessage').value = ''

}
let isEnter = (e) => {
    if (e.keyCode == 13) {
        sendMessage()
    }
}
let selectDifferentTeam = (el) => {
    // for(elm of el.target.parentNode.parentNode.parentNode.children){
    //     elm.className = 'team-item'
    // }
    // el.currentTarget.className = 'team-item selected'
    document.getElementById('teamName').innerHTML = `${el.currentTarget.innerText} <i class="fas fa-caret-down"></i>`
    document.getElementById('messages').innerHTML = ''
    $.getJSON('/api/getTeamsMessages', data => {
        document.getElementById('teamName').attributes.tid = el.currentTarget.id
        for (team of data._teams) {
            if (team._id == el.currentTarget.id) {
                team._messages.forEach(m => {
                    if (m.user !== aUSER._id) {
                        document.getElementById('messages').innerHTML += `<li><p><you>${m.username}:</you> ${m.message}</p></li>`
                    } else {
                        document.getElementById('messages').innerHTML += `<li><p><me>${m.username}:</me> ${m.message}</p></li>`
                    }
                })
            }
        }
    })
    $('#nmessage').focus()
}

let updateMessage = msgcontainer => {
    if (msgcontainer.user !== aUSER._id && document.getElementById('teamName').attributes.tid == msgcontainer.tid) {
        document.getElementById('messages').innerHTML += `<li><p><you>${msgcontainer.username}:</you> ${msgcontainer.message}</p></li>`
        scrollBottom
    }
}
$(document).ready(() => {

    $.getJSON('/api/getProfile', user => {
        aUSER = user
    }).then(
        $.getJSON('/api/getUserTeams', data => {
            data._teams.forEach((e, i) => {
                if (i == 0) {
                    document.getElementById('teamName').innerHTML = `${e.teamName} <i class="fas fa-caret-down"></i>`
                    document.getElementById('teams').innerHTML += `<li id='${e._id}'><p>${e.teamName}</p></li>`
                } else {
                    document.getElementById('teams').innerHTML += `<li id='${e._id}'><p>${e.teamName}</p></li>`
                }
            });
            $('#teams > li').click((el) => { selectDifferentTeam(el) })
        })
    ).then(
        $.getJSON('/api/getTeamsMessages', data => {
            document.getElementById('teamName').attributes.tid = data._teams[0]._id
            data._teams[0]._messages.forEach(m => {
                if (m.user !== aUSER._id) {
                    document.getElementById('messages').innerHTML += `<li><p><you>${m.username}:</you> ${m.message}</p></li>`
                } else {
                    document.getElementById('messages').innerHTML += `<li><p><me>${m.username}:</me> ${m.message}</p></li>`
                }
            })
            scrollBottom()
        })
    )
    socket = io.connect('http://localhost:8000')
    socket.on('message', message => {
        updateMessage(message)
    })
})

