let deleteUserFromTeam = (uid, tid) => {
    console.log(uid,tid)
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", `/api/deleteUserFromTeam/${uid}/${tid}`, true); // true for asynchronous 
    xmlHttp.send(null);
}