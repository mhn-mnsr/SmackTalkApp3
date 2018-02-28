let joinTeam = (op,tid,uid)=>{
    let xmlHttp = new XMLHttpRequest()
    xmlHttp.open("GET", `/api/joinTeam?accept=${op}&uid=${uid}&tid=${tid}`, true) // true for asynchronous 
    xmlHttp.send(null)
    document.location.reload()
}