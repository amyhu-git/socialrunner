/*
	Data Access Object with:
	* constructor to create database connection
	* function to initialise the specifed database
	* function to get a document for a given id
	* function to get documents from a given view
	* function to get documents from the 'all' view for a given key
	* function to get documents from a given view with results grouped
	* function to insert a given document with a given id
	* function to bulk insert given documents
	* function to create specified views in a design
*/

(function() {
    var nano = require('nano');

    var route_views = {
        all: {
            map: function(doc) { if (doc.routename) { emit(doc.routename, doc); } }
        }
    }

    class DAO {
        constructor(url, user, pword) {
            console.log(`URL: http://${user}:******@${url}`);
            nano = nano(`http://${user}:${pword}@${url}`);
            this._db = null;
        }


        //initialise the database should be called immediately after the constructor!
        init(db_name) {
            this._db = nano.use(db_name);
            //check if the database exists
            return nano.db.get(db_name)
                .then(body => console.log(`using database ${db_name}!`))
                .catch(err => {
                    //if the database does not exists create it and add some data and some views
                    if (err.reason == 'no_db_file') {
                        return nano.db.create(db_name) // create the database
                            .then(body => console.log(`database ${db_name} created!`))
                            .then(body => this.createViews('routes', route_views))
                            .then(body => console.log('Views added!'))
                    } else {
                        console.log(`error getting database ${db_name}!`);
                        throw err; //we do not want to catch errors here - let the calling function deal with them!
                    }
                });
        }

        //get user with id
        getUser(id) {
            return this._db.get(id)
        }

        getUsers(id) {
            this._db.fetch({ keys: id })
                .then(body => {
                    let results = new Object
                    for (let a of body.rows) { results[a.id = a.doc] }
                    return results;
                })
                .catch(err => console.log(err))
        }

        getRoute(id) {
            return this._db.get(id)
        }

        getRoutes(route) {
            return this._db.view('routes', route).then(body => body.rows)
        }

        //insert doc iwth particular id to db
        insertUser(id, participant) {
            return this._db.insert(participant, id)
        }

        insertRoute(id, route) {
            return this._db.insert(route, id)
        }

        //buld insert
        insertUsers(users) {
            return this._db.bulk({ docs: users })
        }

        //set up views for querying
        createViews(design, views) {
            return this._db.insert({ 'views': views }, '_design/' + design)
        }
    }

    //make the dao accessible from outside the module
    var moduleExports = { DAO: DAO };
    module.exports = moduleExports;
})();