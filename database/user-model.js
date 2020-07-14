(function() {

    class User {
        constructor(fullname, username, password, experience) {
            this.fullname = fullname;
            this.username = username;
            this.password = password;
            this.experience = experience
        }

        get fullname() { return this._fullname; }
        set fullname(newName) {
            if (typeof(newName) === 'string' && newName != "") this._fullname = newName;
            else throw new Error("Invalid name");
        }

        get username() { return this._username; }
        set username(newUser) {
            if (typeof(newUser) === 'string' && newUser != "") this._username = newUser;
            else throw new Error("Invalid Password");
        }

        get password() { return this._password; }
        set password(newPassword) {
            if (typeof(newPassword) === 'string' && newPassword != "") this._password = newPassword;
            else throw new Error("Invalid Password");
        }

        get experience() { return this._experience; }
        set experience(newExperience) {
            if (typeof(newExperience) === 'string' && newExperience != "") this._experience = newExperience
        }

        // convert to json 
        toJSON() {
            let result = {};
            result.fullname = this.fullname;
            result.username = this.username;
            result.password = this.password;
            result.experience = this.experience;
            return result;
        }

        // convert to string
        toJSONString() {
            return JSON.stringify(this.toJSON());
        }

        //build Film from json
        static fromJSON(json) {
            if (!json.hasOwnProperty('fullname')) {
                throw new Error("Missing name");
            }
            if (!json.hasOwnProperty('username')) {
                throw new Error("Missing username");
            }
            if (!json.hasOwnProperty('password')) {
                throw new Error("Missing password");
            }
            if (!json.hasOwnProperty('experience')) {
                throw new Error("Missing experience value");
            }

            return new User(json.fullname, json.username, json.password, json.experience);
        }

    }

    class Route {
        constructor(routeName, pace, dateTime, description, start, end, waypoints, distance, participant, comment) {
            this.routeName = routeName
            this.pace = pace;
            this.dateTime = dateTime;
            this.description = description;
            this.start = start;
            this.end = end;
            this.waypoints = waypoints;
            this.distance = distance;
            this.participant = participant;
            this.comment = comment
        }

        get routeName() { return this._routeName; }
        set routeName(newRoute) {
            if (typeof(newRoute) === 'string' && newRoute != "") this._routeName = newRoute;
            else throw new Error("Invalid Route Name");
        }

        get pace() { return this._pace; }
        set pace(newPace) {
            if (typeof(newPace) === 'string' && newPace != "") this._pace = newPace;
            else throw new Error("Invalid Pace Value");
        }

        get dateTime() { return this._dateTime; }
        set dateTime(newdateTime) {
            if (typeof(newdateTime) === 'string' && newdateTime != "") this._dateTime = newdateTime;
            else throw new Error("Invalid Date or Time Value");
        }

        get description() { return this._description; }
        set description(newdescription) {
            if (typeof(newdescription) === 'string' && newdescription != "") this._description = newdescription;
            else throw new Error("Invalid Description provided");
        }

        get start() { return this._start; }
        set start(newstart) {
            if (typeof(newstart) === 'string' && newstart != "") this._start = newstart;
            else throw new Error("Invalid Startpoint provided");
        }

        get end() { return this._end; }
        set end(newend) {
            if (typeof(newend) === 'string' && newend != "") this._end = newend;
            else throw new Error("Invalid Endpoint provided");
        }

        get waypoints() { return this._waypoints }
        set waypoints(newwaypoints) {
            if (newwaypoints != "") this._waypoints = newwaypoints;
            else return null
        }

        // convert to json 
        toJSON() {
            let result = {};

            result.routename = this.routeName;
            result.pace = this.pace;
            result.dateTime = this.dateTime;
            result.description = this.description;
            result.start = this.start;
            result.end = this.end;
            result.waypoints = this.waypoints
            result.distance = this.distance
            result.participant = this.participant
            result.comment = this.comment
            result.type = "route";
            return result;
        }

        // convert to string
        toJSONString() {
            return JSON.stringify(this.toJSON());
        }

        //build Film from json
        static fromJSON(json) {
            if (!json.hasOwnProperty('routeName')) {
                throw new Error("Missing Route Name");
            }
            if (!json.hasOwnProperty('pace')) {
                throw new Error("Missing value for expected pace");
            }
            if (!json.hasOwnProperty('dateTime')) {
                throw new Error("Missing Date and Time value");
            }
            if (!json.hasOwnProperty('description')) {
                throw new Error("Missing descrption");
            }
            if (!json.hasOwnProperty('start')) {
                throw new Error("Missing Startpoint");
            }
            if (!json.hasOwnProperty('end')) {
                throw new Error("Missing Endpoint");
            }

            return new Route(json.routeName, json.pace, json.dateTime, json.description, json.start, json.end, json.waypoints, json.distance, json.participant, json.comment);
        }

    }

    var moduleExports = {
        User: User,
        Route: Route
    }

    if (typeof __dirname == 'undefined')
        window.exports = moduleExports;
    else
        module.exports = moduleExports


}());