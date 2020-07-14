# CS5003 Practical3: Social Runner
This repository implements a simple application enabling runners to generate, join and view routes.<br>
The file with a name 'server' contains the code of the server side.<br>
The file "package.json" tells what packages are needed.<br>
The "content" folder contains three files. These three files are:<br>
* index : the HTML file;
* client : the javascript file contains client-side javascript code;
* style : the CSS file;
The database folder holds three files: <br>
* config-db: the configuration file to set up the database
* run-dao: holds Data Access Object and all the functions to insert, retrieve or query information
* user-model: provides the constructors to create the database connection, in this case USER and ROUTE

For run the server, make sure you have installed Node.js, Chrome or Firefox browser and the packages in the "package.json" file.<br>
<b>Node.js:</b>
https://nodejs.org/en/ 
<br>
<b>Chrome:</b>
https://www.google.co.uk/chrome/?brand=CHBD&gclid=CjwKCAjwhOD0BRAQEiwAK7JHmLie5EJVCYwVrKvqc_qXTiAONve3IxyvExzj373uvO81Kiud6a9pwRoCSuAQAvD_BwE&gclsrc=aw.ds
<br>
<b>Firefox:</b>
https://www.mozilla.org/de/firefox/new/

After installing Node.js and Chrome, use "npm install <package name>" to install packages needed.<br>
Follow the steps below to run the server:<br>

* Open the Terminal or Powershell
* Locate the folder
* Type "node server.js"
* Open Chrome browser and type "localhost:21977" in the address bar
* Click "enter" on your keyboard
* Now you can start to view or create routes!








