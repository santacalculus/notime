"use strict"

function loadTime() {
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return
        updatePage(xhr)
        console.log("yes")
    }
    xhr.open("GET", getURL, true)
    console.log("here")
    xhr.send()
}

function updatePage(xhr) {
    if (xhr.status == 200) {
        let response = JSON.parse(xhr.responseText)
        let waitresponse = response.wait_time
        updateWait(waitresponse)
        let numresponse = response.num_people
        updateNum(numresponse)
        return
    }
    if (xhr.status == 0) {
        displayError("Cannot connect to server")
        return
    }

    if (!xhr.getResponseHeader('content-type') == 'application/json') {
        displayError("Received status=" + xhr.status)
        return
    }

    let response = JSON.parse(xhr.responseText)
    if (response.hasOwnProperty('error')) {
        displayError(response.error)
        return
    }

    displayError(response)

}

function displayError(message) {
    let errorElement = document.getElementById("error")
    errorElement.innerHTML = message
}

function sanitize(s) {
    // Be sure to replace ampersand first
    return s.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
}


function updateWait(items) {
    let item = items[items.length - 1]
    let waitdiv = document.getElementById("id_predicted_time")
    let currdate = new Date(item.creation_time)
    let itemtime = currdate.toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return
        updatePage(xhr)
    }
    waitdiv.innerHTML = itemtime.replace(',', ' ') + '+' + item.wait_time
}



function getCSRFToken() {
    let cookies = document.cookie.split(";")
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim()
        if (c.startsWith("csrftoken=")) {
            return c.substring("csrftoken=".length, c.length)
        }
    }
    return "unknown"
}