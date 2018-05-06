let deleteUserFromTeam = (uid, tid) => {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", `/api/deleteUserFromTeam/${uid}/${tid}`, true); // true for asynchronous 
    xmlHttp.send(null);
    document.location.reload()
}

$(document).ready(()=>{
    $('.fa-trash').click((event)=>{
        let uid = event.target.attributes.uid.value
        let tid = event.target.attributes.tid.value
        deleteUserFromTeam(uid,tid)
    })
})