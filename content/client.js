(function() {

    let user_key = null; //variable to identify the currently logged in user
    let username;
    let latestData;

    setInterval(getRoutes, 8000);

    async function getRoutes() {
        try {
            const response = await fetch('/getRoutes/');
            if (response.status == 200) {
                const data = await response.json()
                allData = data;
                latestData = data;

                console.log(latestData)
                displayRoutes(latestData)
            }
        } catch (err) {
            console.log(err);
            document.getElementById('all-routes').innerHTML = "ERROR: Routes cannot be displayed."
        }
    }

    let deleteDisplay = () => {
        let oldContent = document.getElementById('all-routes')
        while (oldContent.hasChildNodes()) {
            oldContent.removeChild(oldContent.firstChild);
        };
    };

    let displayRoutes = data => { //display all routes 
        deleteDisplay() //delete old display
        let content = document.getElementById('all-routes')

        for (item of data) {
            const info = item.value

            const routePost = document.createElement('p');
            routePost.setAttribute("class", "lead")
                //const user
            const title = document.createElement('h4');
            title.setAttribute("class", "display-4")
            const description = document.createElement('p')
            description.setAttribute("class", "lead")
            const start = document.createElement('h6')
            const end = document.createElement('h6')
            const meeting = document.createElement('p')

            const date = document.createElement('div')
            const distance = document.createElement('div')
            const pace = document.createElement('div')
            const comment_button = document.createElement('button')
            comment_button.innerText = 'Add Comment'
            const input = document.createElement('input')
            input.setAttribute("id", `${info.routename}`)
            const join_button = document.createElement('button')
            join_button.innerHTML = 'JOIN NOW'

            //content

            title.innerText = `${item.key.toUpperCase()}`;
            description.innerText = info.description;
            start.innerHTML = `📍 <b> ${info.start} </b>`
            end.innerHTML = `🏁 <b>${info.end}</b>`
            pace.innerHTML = `<b>Expected pace</b>: ${info.pace} per km`
            input.placeholder = 'Comment ...'
            const dateString = new Date(info.dateTime).toLocaleString()
            date.innerHTML = `Date and Time: <br> <b>${dateString} </b>`

            if (info.distance != undefined) {
                distance.innerHTML = `<b>Total Distance</b> ${info.distance} km`
            }


            if (info.waypoints != undefined) {
                for (waypoint of info.waypoints) {
                    let p = document.createElement('p')
                    p.innerHTML = 'Meeting points: '
                    let wp = waypoint.location
                    const div = document.createElement('div')
                    div.innerText = `📍 ${wp}`
                    meeting.append(p, div)
                }
            }

            routePost.append(distance, pace, date)

            let all_participants = []

            //BUTTON ACTION 
            join_button.onclick = async event => { //post to database, participants for run
                let participant = new Object()
                participant.participant = username
                participant.rev = info._rev
                all_participants.push(participant)
                let id = info.routename
                console.log(info, all_participants)

                const join = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(all_participants)
                }

                try {
                    let addParticipant = await fetch(`/updateRoute/${id}`, join);
                    if (addParticipant.status == 200) {
                        let response = await addParticipant.json();
                        console.log(response)
                        alert(response.msg)
                        console.log('posted')
                    } else {
                        alert('Error: Cannot join this route!')
                        console.log(addParticipant.status + ':Invalid Request')
                    }

                } catch (err) {
                    console.log(err);
                    alert(err)
                }
            };

            let all_comments = []

            //COMMENT FUNCTION BUGS
            // comment_button.onclick = async event => {
            //     let commentInput = document.getElementById(`${info.routename}`).value
            //     let comment = new Object()
            //     comment.comment = commentInput;
            //     comment.user = username
            //     comment.rev = info._rev
            //     all_comments.push(comment)
            //     console.log(all_comments)

            //     let id = info.routeName

            //     const comm = {
            //         method: 'PUT',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify(all_comments)
            //     }

            //     try {
            //         let addComment = await fetch(`/addComment/${id}`, comm);
            //         if (addComment.status == 200) {
            //             let response = await addComment.json();
            //             console.log(response)
            //             console.log('posted')
            //         } else {
            //             alert('Error: Cannot comment!')
            //         }
            //     } catch (err) {
            //         console.log(err);
            //         alert(err)
            //     }
            // }

            let listElement = document.createElement('li');

            listElement.append(title, description, start, end, meeting, routePost, input, comment_button, join_button)
            content.appendChild(listElement)
        }
    }

    //little function to check the response header of a request
    function parseResponse(response) {
        if (response.status == 401) {
            document.getElementById("private_msg").innerHTML = "";
            document.getElementById("private").style.display = "none";
            document.getElementById("login").style.display = "block";
            document.getElementById("public_msg").innerHTML = "Invalid username or password!";
            document.getElementById("registration").style.display = "none"
            return null;
        } else {
            return response.json();
        }
    }

    //handler for the login button
    function login() {
        username = document.getElementById('username').value
        password = document.getElementById('pass').value
            //make a key-value pair from the username & password elements & convert them to base 64 (needed for transmition to server)
        user_key = btoa(document.getElementById("username").value + ":" + document.getElementById("pass").value);
        document.getElementById("username").value = "";
        document.getElementById("pass").value = "";
        hello()
    }

    //handler for the logout button 
    function logout() {
        //just clear the user key - if we were doing something smarter on the server we would need to tell it to log the user out too
        user_key = null;
        //document.getElementById("private_msg").innerHTML = "";
        document.getElementById("private").style.display = "none";
        document.getElementById("registration").style.display = "none"
        document.getElementById("public_msg").innerText = `BYEEE, SEE YOU FOR YOUR NEXT RUN!`
        document.getElementById("sign-up").style.display = "";
    }

    //handler for the hello page
    function hello() {
        fetch(`/login/${username}`, {
                method: 'GET',
                headers: { "Authorization": "Basic " + user_key }
            })
            .then(res => parseResponse(res))
            .then(jsn => {
                if (jsn && jsn.msg) {
                    document.getElementById("routeTitle").innerText = jsn.msg;
                    document.getElementById("private").style.display = "block";
                    document.getElementById("sign-up").style.display = "none";
                }
            })
    }

    function registerInfo() { //handler for register button
        document.getElementById("private_msg").innerHTML = "none";
        document.getElementById("private").style.display = "none";
        document.getElementById("login").style.display = "none";
        document.getElementById("registration").style.display = "block"
        publicInfo()
    }

    function register() { //create new user
        let firstname = document.getElementById("firstname").value
        let lastname = document.getElementById("lastname").value;
        let fullname = `${firstname} ${lastname}`
            //console.log(fullname)
        let username = document.getElementById("newUsername").value;
        let password = document.getElementById("newPass").value;
        let experience = document.getElementById("experience").value
            //console.log(experience)
        let user = new Object()
        user.fullname = fullname
        user.username = username
        user.password = password
        user.experience = experience
        console.log(user)
        fetch(`/addUser/${username}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            })
            .then(res => res.text())
            .then(txt => alert(txt))

        document.getElementById("firstname").value = ""
        document.getElementById("lastname").value = ""
        document.getElementById("newUsername").value = ""
        document.getElementById("newPass").value = ""
        document.getElementById("login").style.display = "block"
        document.getElementById("registration").style.display = "none"
    }

    function cancelRegistration() { //hide registration tab if cancelled 
        document.getElementById("login").style.display = "block"
        document.getElementById("private_msg").innerHTML = "";
        document.getElementById("private").style.display = "none";
        document.getElementById("registration").style.display = "none"
        publicInfo()
    }

    //function to get the publicly available info
    function publicInfo() {
        return fetch("/public_info")
            .then(res => parseResponse(res))
            .then(jsn => {
                if (jsn != null && jsn.msg) {
                    document.getElementById("public_msg").innerHTML = jsn.msg;
                }
            })
    }

    function addRoute() { //create new routes
        let routeName = document.getElementById("routeName").value
        let pace = document.getElementById("pace-input").value
        let dateTime = document.getElementById("datetime-input").value
        let description = document.getElementById("info").value;

        console.log(description)

        let route = new Object()
        route.routeName = routeName
        route.pace = pace
        route.dateTime = dateTime
        route.description = description
        route.start = startValue
        route.end = endValue
        route.distance = distance
        console.log(distance)
        if (waypts.length != 0) { route.waypoints = waypts }
        console.log(route)

        try {
            fetch(`/addRoute/${routeName}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(route)
                })
                .then(res => {
                    if (res.status == 200) {
                        res.text()
                            .then(txt => alert(txt))
                    } else {
                        alert('ERROR: Route Information incomplete!')
                    }
                })
        } catch (err) {
            console.log(err);
        }

        document.getElementById("routeName").value = ""
        document.getElementById("pace-input").value = ""
        document.getElementById("datetime-input").value = ""
        document.getElementById("info").value = ""
        getRoutes()
    }


    //when the page loads
    window.onload = () => {
        document.getElementById("login_button").onclick = login;
        document.getElementById("logout").onclick = logout;
        document.getElementById("register_button").onclick = registerInfo;
        document.getElementById("submit_register").onclick = register;
        document.getElementById("cancel_button").onclick = cancelRegistration;
        document.getElementById("submitForm").onclick = addRoute;
        document.getElementById("private").style.display = "none";
        document.getElementById("registration").style.display = "none"
        publicInfo();
    }
})();



let map, infoWindow
let waypts = []
let startValue, endValue

// Initialize and add the map
function initMap() {

    let options = {
        center: { lat: 49.40768, lng: 8.69079 },
        zoom: 17,
        //mapTypeId: google.maps.MapTypeId.HYBRID
    };
    //create map
    map = new google.maps.Map(document.getElementById('map'), options)
        //directionsRenderer.setMap(map)

    //infoWindow to display geolocation
    let infoWindow = new google.maps.InfoWindow;

    //check if geolocation is available
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(p => {
            let position = { //gran lng/lat
                lat: p.coords.latitude,
                lng: p.coords.longitude
            };
            infoWindow.setPosition(position); //move to new position on map
            infoWindow.setContent('Your location!');
            infoWindow.open(map);
            map.setCenter(position); //move new position to center 
        }, function() {
            handleLocationError('Geolocation service failed', map.getCenter()) //error handling
        })
    } else {
        handleLocationError('No geolocation available', map.getCenter()) //if geolocation denied
    }

    // Instantiate a directions service.
    var directionsService = new google.maps.DirectionsService;
    // Create a renderer for directions and bind it to the map.
    var directionsRenderer = new google.maps.DirectionsRenderer({
        //draggable: true,
        map: map,
        panel: document.getElementById('directions-info')
    });
    directionsRenderer.setMap(map)

    //get input
    let start = document.getElementById("startpoint");
    let end = document.getElementById("endpoint");
    let wypt = document.getElementById("waypointSearch")

    searchDisplay(start); //display marker on searched places
    searchDisplay(end);
    searchDisplay(wypt);

    document.getElementById('submitRoute').addEventListener('click', function() {
        displayRoute(startValue, endValue, directionsService, directionsRenderer); //display route on map
    });

    directionsRenderer.addListener('directions_changed', function() {
        computeTotalDistance(directionsRenderer.getDirections()); //compute Distance and display directions from start to end
    });

    document.getElementById("resetRout").addEventListener('click', function() {
        if (directionsRenderer != null) {
            directionsRenderer.setMap(null);
            directionsRenderer = null;
        }
    })

}

function displayRoute(origin, destination, service, display) {
    service.route({
        origin: origin,
        destination: destination,
        waypoints: waypts,
        travelMode: 'WALKING',
    }, function(response, status) {
        if (status === 'OK') {
            display.setDirections(response);
        } else {
            alert('Could not display directions due to: ' + status);
        }
    });
}

function searchDisplay(input) { //function to display map markers
    var searchBox = new google.maps.places.SearchBox(input);

    //track changes in surrounding bounds
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];

    //track changes of place
    searchBox.addListener('places_changed', function() { //autocomplete search box 
        var places = searchBox.getPlaces();
        console.log(places)

        if (places.length == 0)
            return;

        //coordinate boundaries for the map 
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(p) {
            if (!p.geometry) //check geometry attributes to reach the place
                return;

            markers.push(new google.maps.Marker({
                map: map,
                title: p.name,
                position: p.geometry.location
            }));

            if (p.geometry.viewport)
                bounds.union(p.geometry.viewport);
            else
                bounds.extend(p.geometry.location);
        });

        map.fitBounds(bounds)

        document.getElementById("resetRout").addEventListener('click', function() { //remove markers when resetted
            //reset markers
            markers.forEach(function(m) { m.setMap(null); });
            markers = [];
            waypts = [];
            reset()
        })
    });

}

let distance //value needed to post on database

function computeTotalDistance(result) { //calculate distance
    var total = 0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
    }
    total = total / 1000;
    distance = total
    document.getElementById('total').innerHTML = total + ' km';
    console.log(distance)
}


//handle geolocation errors
function handleLocationError(content, position) {
    infoWindow.setPosition(position);
    infoWindow.setContent(content);
    infoWindow.open(map);
}

function addWaypoints() { //define meeting points and list on page
    let searchInput = document.getElementById("waypointSearch").value;
    //let div = document.getElementById("waypointsInput")
    if (searchInput != "") {
        let list = document.getElementById("listed-points")
        let listElement = document.createElement('li')
        listElement.setAttribute("id", "meetPoint")
        listElement.innerHTML = searchInput
        list.appendChild(listElement)

        waypts.push({
            location: searchInput,
            stopover: true
        })
    } else {
        alert("Invalid: Please enter a value!")
    }

    console.log(waypts)

    document.getElementById("waypointSearch").value = ""
}

function addStart() { //define start point and display on page
    let startpoint = document.getElementById("startpoint").value
    startValue = startpoint
    console.log(startpoint)
    if (startpoint != "") {
        document.getElementById("startpoint").style.display = "none"
        document.getElementById("startpoint-button").style.display = "none"
        let text = document.createElement("p")
        text.setAttribute("id", "locationP")
        let div = document.getElementById("startpointdiv")
        text.innerHTML = startpoint
        div.appendChild(text)
    } else {
        alert("Please enter a value!")
    }
}

function reset() { //clear any searches and input

    document.getElementById("startpoint").style.display = "block"
    document.getElementById("startpoint-button").style.display = "block"
    document.getElementById("endpoint").style.display = "block"
    document.getElementById("endpoint-button").style.display = "block"
    if (document.getElementById("locationP")) {
        document.getElementById("locationP").remove()
    }
    if (document.getElementById("meetPoint")) {
        document.getElementById("meetPoint").remove()
    }
    document.getElementById("startpoint").value = ""
    document.getElementById("endpoint").value = ""
    document.getElementById("waypointSearch").value = ""
}

function addEnd() { //define endpoint and add it to page
    let endpoint = document.getElementById("endpoint").value
    endValue = endpoint
    if (endpoint != "") {
        document.getElementById("endpoint").style.display = "none"
        document.getElementById("endpoint-button").style.display = "none"
        let text = document.createElement("p")
        text.setAttribute("id", "locationP")
        let div = document.getElementById("endpointdiv")
        text.innerHTML = endpoint
        div.appendChild(text)
    } else {
        alert("Please enter a value!")
    }
}

// //search content by title
// function searchRoutes() {
//     let search = document.getElementById('route-search');
//     let filter = search.value.toLowerCase();
//     let ul = document.getElementById("all-routes")
//     let li = ul.getElementsByTagName('li')

//     for (i = 0; i < li.length; i++) {
//         loc = li[i].getElementsByTagName('h6')[0];
//         console.log(loc)
//         txtValue = loc.textContent || loc.innerText || loc.innerHTML;
//         if (txtValue.toUpperCase().indexOf(filter) > -1) {
//             li[i].style.display = "";
//         } else {
//             li[i].style.display = "none";
//         }
//     }
// };