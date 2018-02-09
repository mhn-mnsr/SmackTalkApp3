let users;
    let memberList = document.getElementById("membersList")
    let ml = document.getElementById('ml')
    let addMember = () => {
        let x = document.getElementById("members").value
        for (user in users) {
            if (users[user].username.toLowerCase() == x.toLowerCase()) {
                memberList.innerHTML += `<li>${users[user].username}</li>`
                ml.value += ',' +users[user]._id
            }
        }
    }
    $(document).ready(() => {
        $.getJSON('/api/allUsers', data => {
            users = data
        })
    })