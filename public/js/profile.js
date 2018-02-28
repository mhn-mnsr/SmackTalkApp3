$(document).ready(() => {
    $.getJSON('/api/getProfile', data => {
      document.getElementById('firstName').value = data.firstName || ''
      document.getElementById('lastName').value = data.lastName || ''
      document.getElementById('currentUsername').value = data.username
    })
  })
