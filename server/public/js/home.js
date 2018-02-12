$(document).ready(()=>{
    $.getJSON('/api/getProfile', data=>{
        document.getElementById("greeting").innerHTML = `<h2>Hi, ${data.firstName || 'user'}!</h2>`
    })
})