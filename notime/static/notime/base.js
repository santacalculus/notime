"use strict"

function loadTime() {
    let xhr = new XMLHttpRequest()

    xhr.onerror = function() {
        console.log('Error occurred.');
      };
    
    xhr.onreadystatechange = function() {
        
        if (this.readyState != 4) {
            return
        }
        
        updatePage(xhr)
    }
    xhr.open("GET", getURL, true)
    //console.log("here")
    xhr.send()
    var d = new Date(); 
    var secs = d.getSeconds();
    console.log(secs)
}

function updatePage(xhr) {
    if (xhr.status == 200) {
        let response = JSON.parse(xhr.responseText)
        let numresponse = response.num_people 
        let lineDiv = document.getElementById("id_line_num")
        //console.log(numresponse)
        lineDiv.innerHTML = numresponse
        let maxresponse = response.max_people
        // console.log(maxresponse)
        needleAngle(numresponse, maxresponse)
        updateTime(response)
        
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
    
}

function updateTime(response) {
    let waitresponse = response.wait_time
    let waitdiv = document.getElementById("id_predicted_time")
    waitdiv.innerHTML = waitresponse
    //console.log(waitresponse)
    let createresponse = response.creation_time
    let creatediv = document.getElementById("id_creation_time")
    creatediv.innerHTML = createresponse
    let finalresponse = response.final_time
    let finaldiv = document.getElementById("id_final_time")
    finaldiv.innerHTML = finalresponse
    
    
}

function displayError(message) {
    let errorElement = document.getElementById("error")
    errorElement.innerHTML = message
}


// function to check whether the dining hall is open
function checkPrima() {
    var d = new Date(); 
    var hours = d.getHours();
    var day = d.getDay();
    let headerdiv = document.getElementById("id_prima_head")
    if(1 < day && day < 5) {
        //console.log(day)
        if(8 <= hours && hours <= 18) {
            //console.log(hours)
            
            headerdiv.innerHTML = "OPEN"
        }
    } else {
        headerdiv.innerHTML = "CLOSED"
    }

}

function checkExchange() {
    var d = new Date(); 
    var hours = d.getHours();
    var day = d.getDay();
    let headerdiv = document.getElementById("id_exchange_head")
    if(0 < day && day < 7) {
        //console.log(day)
        if (3 <= day && day <= 4) {
            if (8 <= hours && hours <= 15) {
                headerdiv.innerHTML = "OPEN"
            }
        }
        if (day == 1) {
            if (8 <= hours && hours <= 19) {
                headerdiv.innerHTML = "OPEN"
            }
        }
        if (day == 2) {
            if (8 <= hours && hours <= 17) {
                //console.log(hours)
                
                headerdiv.innerHTML = "OPEN"
            }
        }
        if (day == 5) {
            if (8 <= hours && hours <= 18) {
                headerdiv.innerHTML = "OPEN"
            }
        }
        if (day == 6) {
            if (10 <= hours && hours <= 14) {
                headerdiv.innerHTML = "OPEN"
            }
        }
        else {
            headerdiv.innerHTML = "CLOSED"
        }
    } else {
        headerdiv.innerHTML = "CLOSED"
    }

}

function speedometer() {
    var myDiv = document.getElementById("id_meter");
    var colWidth = myDiv.getBoundingClientRect(). width;
    var rowHeight = colWidth/2;

    const svg_semi = d3.select(myDiv)
        .append("svg")
        .attr("width", colWidth)
        .attr("height", rowHeight)
    
    const centerx = colWidth/2;
    const centery = rowHeight*0.9;
    const radius = rowHeight*0.8;

    // Define the gradient colors
    const gradientColors = d3.interpolate(d3.rgb("#00FF00"), d3.rgb("#FF0000"));

    // Create the gradient
    const gradient = svg_semi.append("defs")
        .append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", gradientColors(0))
        .attr("stop-opacity", 1);

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", gradientColors(1))
        .attr("stop-opacity", 1);



    const arc = d3.arc()
        .startAngle(-Math.PI/2)
        .endAngle(Math.PI/2)
        .innerRadius(radius*0.8)
        .outerRadius(radius)
        .cornerRadius(radius/10);
        
    svg_semi.append("path")
    .attr("transform", `translate(${centerx}, ${centery})`)
    .attr("d", arc)
    .attr("fill", "url(#gradient)")
    .attr("stroke", "#333")
    .attr("stroke-width", 3);
    needle();

}

function needle() {
    var myDiv = document.getElementById("id_meter");
    var colWidth = myDiv.getBoundingClientRect(). width;
    var rowHeight = colWidth/2;

    const svg_semi = d3.select(myDiv).select("svg");

    const centerx = colWidth/2;
    const centery = rowHeight*0.9;
    const radius = rowHeight*0.8;
    
    const needle = svg_semi.append("g")
        .attr("transform", `translate(${centerx},${centery}),rotate(-90)`);
    
    needle.append("path")
        .attr("d", `M -10 0 L 0 -${radius - 20} L 10 0 Z`)
        .attr("fill", "#FFF67D")
        .attr("stroke", "#333")
        .attr("stroke-width", 1);

    needle.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 10)
        .attr("fill", "#FEDD00")
        .attr("stroke", "#333")
        .attr("stroke-width", 1);
}

function needleAngle(numresponse, maxresponse) {
    var myDiv = document.getElementById("id_meter");
    var colWidth = myDiv.getBoundingClientRect(). width;
    var rowHeight = colWidth/2;
    const centerx = colWidth/2;
    const centery = rowHeight*0.9;
    // const radius = rowHeight*0.8;

    var angle = -90 + (180*numresponse/maxresponse);
    const needle = d3.select("#id_meter svg g");
    needle.transition()
        .duration(500)
        .attr("transform", `translate(${centerx},${centery}),rotate(${angle})`);


    // var myDiv = document.getElementById("id_meter");
    // var colWidth = myDiv.getBoundingClientRect(). width;
    // var rowHeight = colWidth/2;

    // const svg_semi = d3.select(myDiv).select("svg");

    // const centerx = colWidth/2;
    // const centery = rowHeight*0.9;
    // const radius = rowHeight*0.8;
    
    // const needle = svg_semi.append("g");
    // let angle = - 90 + (180 * numresponse/maxresponse);
    // console.log("what",angle)
    // needle.transition()
    // .duration(1000)
    // .ease(d3.easeElastic)
    // .attr("transform", `translate(${centerx},${centery}),rotate(30)`);

}


//         const needle = svg_semi.append("g")
//             .attr("transform", `translate(${centerx},${centery}),rotate(45)`);

//         needle.append("path")
//             .attr("d", `M -10 0 L 0 -${radius - 20} L 10 0 Z`)
//             .attr("fill", "#FFF67D")
//             .attr("stroke", "#333")
//             .attr("stroke-width", 1);

//         needle.append("circle")
//             .attr("cx", 0)
//             .attr("cy", 0)
//             .attr("r", 10)
//             .attr("fill", "#FEDD00")
//             .attr("stroke", "#333")
//             .attr("stroke-width", 1);

        // Rotate the needle to a given angle
        // function setNeedleAngle(angle) {
        //     needle.attr("transform", `translate(${centerx},${centery}) rotate(${angle})`);
        // }

        // // Example: rotate the needle to 45 degrees
        // setNeedleAngle(Math.PI/4);


        
        // var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        // svg.setAttribute("width", colWidth);
        // svg.setAttribute("height", rowHeight);
        
