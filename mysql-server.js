var path = require('path')
var express = require('express')
var exphbs = require('express-handlebars')

var app = express()
var port = process.env.PORT || 27469

// set up Database
var db = require('./mysql-db-connector')
const { debugPort } = require('process')

//set up handlebar usage
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//send requested public files
app.use(express.static('public'))

//set up ability to read JSON and form data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//send requested images
app.use('/imgs', express.static('./imgs'))


/********************** GET REQUESTS **********************/

//send homepage
app.get("/", function (req, res, next) {
    res.status(200).render('index')
})

/* request all animal info and load page */
app.get('/animals', function (req, res) {
    // define our query
    query = 'SELECT * FROM Animals;';

    //send query
    db.pool.query(query, function (err, results, fields) {

        // 【新增】打印错误信息和结果到终端，看看发生了什么
        if (err) {
            console.log("数据库连接报错！！！", err);
        } else {
            console.log("查询成功，查到了 " + results.length + " 条数据");
            console.log("第一条数据名字是: " + (results[0] ? results[0].animalName : "空"));
        }

        //get results from query and render page w/queried info
        res.status(200).render('animals', {
            anotherJS: true,
            jsFile: "animal.js",
            tableJsFile: "animalTableRow.js",
            animalData: results
        })
    })
})

/* request info for a specific animal */
app.get('/animals/:animalID', function (req, res) {
    var animalID = req.params.animalID;

    // define our query
    query = 'SELECT * FROM Animals WHERE animalID = ? ;';

    //send query
    db.pool.query(query, animalID, function (err, results, fields) {
        emptyResponse = {
            animalID: "N/A",
        }

        if (results.length == 0) {
            res.status(200).send([emptyResponse])
        }

        else {
            //get results from query and render page w/queried info
            res.status(200).send(results)
        }
    })
})

/* request all animal info and load page */
app.get('/animals', function (req, res) {

    // define our query
    query = 'SELECT * FROM Animals;';

    //send query
    db.pool.query(query, function (err, results, fields) {

        //get results from query and render page w/queried info
        res.status(200).render('animals', {
            anotherJS: true,
            jsFile: "animal.js",
            tableJsFile: "animalTableRow.js",
            animalData: results
        })
    })
})

/* request all prescription info and load page */
app.get('/prescriptions', function (req, res) {

    // define our query
    query1 = 'SELECT animalID, animalName, name, frequency, pictureURL FROM Animals NATURAL JOIN Prescriptions;'
    query2 = 'SELECT animalID, animalName FROM Animals;';

    //send query
    db.pool.query(query1, function (err, results, fields) {

        //save prescription results from query
        let prescriptions = results;

        db.pool.query(query2, function (err, results, fields) {
            //get results from query and render page w/queried info
            res.status(200).render('prescriptions', {
                anotherJS: true,
                jsFile: "prescriptions.js",
                tableJsFile: "prescriptionTableRow.js",
                prescriptionData: prescriptions,
                animals: results
            })
        })
    })
})

/* request all foster/adoption info and load page */
app.get('/fosters_and_adoptions', function (req, res) {

    // define our query
    query1 = `SELECT animalID, animalName, p.patronID, p.firstName, p.lastName, fosteredOrAdopted, DATE_FORMAT(date, '%b %e, %Y') as date FROM Animals NATURAL JOIN FostersAndAdoptions fa LEFT JOIN Patrons p on fa.patronID = p.patronID;`
    query2 = 'SELECT animalID, animalName FROM Animals;';
    query3 = 'SELECT firstName, lastName, patronID FROM Patrons;';

    db.pool.query(query1, function (err, results, fields) {

        //save foster/adoption results from query
        let faa = results;

        db.pool.query(query2, function (err, results, fields) {

            //save animal info from results
            let animals = results;

            db.pool.query(query3, function (err, results, fields) {
                //get results from query and render page w/queried info
                res.status(200).render('fosters_and_adoptions', {
                    anotherJS: true,
                    jsFile: "fosters_and_adoptions.js",
                    tableJsFile: "fosters_and_adoptionsTableRow.js",
                    faaData: faa,
                    animals: animals,
                    patrons: results
                })
            })

        })
    })
})

/* request all vaccine info and load page */
app.get('/vaccines', function (req, res) {

    // define our query
    query = 'SELECT * FROM Vaccines;';

    //send query
    db.pool.query(query, function (err, results, fields) {

        //get results from query and render page w/queried info
        res.status(200).render('vaccines', {
            anotherJS: true,
            jsFile: "vaccines.js",
            tableJsFile: "vaccineTableRow.js",
            vaccineData: results
        })
    })
})

/* request all vaccine info for specified species and return it */
app.get('/vaccines/:species/:table', function (req, res) {
    var species = req.params.species;
    var table = req.params.table;

    // define our query
    if (table == "VaccinesAdministered")
        query = `SELECT animalID, animalName, vaccineName, vaccineID, DATE_FORMAT(dateGiven, '%b %e, %Y') as dateGiven, DATE_FORMAT(dateExpires, '%b %e, %Y') as dateExpires, pictureURL FROM Animals NATURAL JOIN VaccinesAdministered WHERE species = ?;`;

    else if (table == "Prescriptions")
        query = `SELECT * FROM Prescriptions NATURAL JOIN Animals WHERE species = ?`

    else
        query = `SELECT * FROM Vaccines WHERE species = ?`

    //send query
    db.pool.query(query, species, function (err, results, fields) {
        res.status(200).send(results)
    })
})


/* request all vaccine info and load page */
app.get('/vaccines_administered', function (req, res) {

    // define our query
    query1 = `SELECT animalID, animalName, vaccineName, vaccineID, DATE_FORMAT(dateGiven, '%b %e, %Y') as dateGiven, DATE_FORMAT(dateExpires, '%b %e, %Y') as dateExpires, pictureURL FROM Animals NATURAL JOIN VaccinesAdministered;`
    query2 = 'SELECT * FROM Vaccines;';
    query3 = 'SELECT animalID, animalName FROM Animals';

    db.pool.query(query1, function (err, results, fields) {

        //save prescription results from query
        let vaccinesAdminstered = results;

        db.pool.query(query2, function (err, results, fields) {

            //save vaccine results from query
            let vaccines = results;

            db.pool.query(query3, function (err, results, fields) {
                //get results from query and render page w/queried info
                res.status(200).render('vaccines_administered', {
                    anotherJS: true,
                    jsFile: "vaccines_administered.js",
                    tableJsFile: "vaccines_administeredTableRow.js",
                    vaccines_administeredData: vaccinesAdminstered,
                    vaccines: vaccines,
                    animals: results
                })
            })
        })
    })
})

/* request all patron info and load page */
app.get('/patrons', function (req, res) {

    // define our query
    query = 'SELECT * FROM Patrons;';

    //send query
    db.pool.query(query, function (err, results, fields) {

        //get results from query and render page w/queried info
        res.status(200).render('patrons', {
            anotherJS: true,
            jsFile: "patrons.js",
            tableJsFile: "patronTableRow.js",
            patronData: results
        })
    })
})

/* get restrictions for an adoptable animal, return N/A if animal is not adoptable */
app.get('/adoptable/:animalID', function (req, res) {
    var animalID = req.params.animalID;

    // define our query
    query = 'SELECT restrictions FROM Adoptable WHERE animalID = ' + animalID + ';';

    //send query
    db.pool.query(query, function (err, results, fields) {
        emptyResponse = {
            restrictions: "N/A",
        }

        if (results.length == 0) {
            res.status(200).send([emptyResponse])
        }

        else {
            //get results from query and render page w/queried info
            res.status(200).send(results)
        }
    })
})

/* Request all adoptable animal info */
app.get('/adoptable', function (req, res) {
    // define our query
    query = 'SELECT * FROM Animals RIGHT JOIN Adoptable ON Animals.animalID = Adoptable.animalID;'

    //send query
    db.pool.query(query, function (err, results, fields) {
        //get results from query and render page w/queried info
        res.status(200).send(results)
    })
})

/* Request all adoptabed animal info */
app.get('/adopted/:table', function (req, res) {
    let table = req.params.table

    // define our query
    if (table == "Animals")
        query = 'SELECT * FROM Animals WHERE animalID IN (SELECT animalID FROM FostersAndAdoptions WHERE fosteredOrAdopted = "A");'

    else if (table == "FostersAndAdoptions")
        query = `SELECT animalID, animalName, patronID, firstName, lastName, fosteredOrAdopted, DATE_FORMAT(date, '%b %e, %Y') as date FROM Animals NATURAL JOIN FostersAndAdoptions NATURAL JOIN Patrons WHERE fosteredOrAdopted = "A";`

    else
        query = `SELECT * FROM Patrons WHERE patronID IN (SELECT patronID FROM FostersAndAdoptions WHERE fosteredOrAdopted = "A");`

    //send query
    db.pool.query(query, function (err, results, fields) {
        //get results from query and render page w/queried info
        res.status(200).send(results)
    })
})

/* Request all fostered animal info */
app.get('/fostered/:table', function (req, res) {
    let table = req.params.table

    // define our query
    if (table == "Animals")
        query = 'SELECT * FROM Animals WHERE animalID IN (SELECT animalID FROM FostersAndAdoptions WHERE fosteredOrAdopted = "F");'

    else if (table == "FostersAndAdoptions")
        query = `SELECT animalID, animalName, patronID, firstName, lastName, fosteredOrAdopted, DATE_FORMAT(date, '%b %e, %Y') as date FROM Animals NATURAL JOIN FostersAndAdoptions NATURAL JOIN Patrons WHERE fosteredOrAdopted = "F";`

    else
        query = `SELECT * FROM Patrons WHERE patronID IN (SELECT patronID FROM FostersAndAdoptions WHERE fosteredOrAdopted = "F");`

    //send query
    db.pool.query(query, function (err, results, fields) {
        //get results from query and render page w/queried info
        res.status(200).send(results)
    })
})


/********************** POST REQUESTS **********************/

function getAddQuery(table) {
    switch (table) {
        case "Animals":
            return `INSERT INTO Animals (species, animalName, age, gender, breed, pictureURL) VALUES (?, ?, ?, ?, ?, ?);`
        case "Patrons":
            return `INSERT INTO Patrons(firstName, lastName, phoneNumber, address) VALUES (?, ?, ?, ?);`
        case "VaccinesAdministered":
            return `INSERT INTO VaccinesAdministered(animalID, vaccineID, vaccineName, dateGiven, dateExpires) VALUES (?, ?, ?, ?, ?);`
        case "Vaccines":
            return `INSERT INTO Vaccines(name, doses, species) VALUES(?, ?, ?);`
        case "Prescriptions":
            return `INSERT INTO Prescriptions(animalID, name, frequency) VALUES (?, ?, ?);`
        case "FostersAndAdoptions":
            return `INSERT INTO FostersAndAdoptions(animalID, patronID, fosteredOrAdopted, date) VALUES (?, ?, ?, ?);`
        default:
            break;
    }
}

function getAddParameters(table, data) {
    switch (table) {
        case "Animals":
            return [data['species'], data['animalName'], [data['age']], data['gender'], data['breed'], data['pictureURL']];
        case "Patrons":
            return [data['firstName'], data['lastName'], data['phoneNumber'], data['address']];
        case "VaccinesAdministered":
            return [data['animalID'], data['vaccineID'], data['vaccineName'], data['dateGiven'], data['dateExpires']];
        case "Vaccines":
            return [data['name'], data['doses'], data['species']]
        case "Prescriptions":
            return [data['animalID'], data['name'], data['frequency']]
        case "FostersAndAdoptions":
            return [data['animalID'], data['patronID'], data['fosteredOrAdopted'], data['date']]
        default:
            break;
    }
}

function getUpdateQuery(table) {
    switch (table) {
        case "Animals":
            return;
        case "Patrons":
            return `UPDATE Patrons SET firstName = ?, lastName = ?, phoneNumber = ?, address = ? \
                     WHERE patronID = ?;`
        case "VaccinesAdministered":
            return `UPDATE VaccinesAdministered SET dateGiven = ?, dateExpires = ? WHERE animalID = ? AND vaccineName = ?;`
        case "Vaccines":
            return `UPDATE Vaccines SET doses = ? WHERE name = ?`
        case "FostersAndAdoptions":
            return `UPDATE FostersAndAdoptions SET fosteredOrAdopted = ? WHERE animalID = ?`
        default:
            break;
    }
}

function getUpdateParameters(table, data) {
    switch (table) {
        case "Animals":
            return;
        case "Patrons":
            return [data['firstName'], data['lastName'], data['phoneNumber'], data['address'], data['patronID']];
        case "VaccinesAdministered":
            return [data['dateGiven'], data['dateExpires'], data['animalID'], data['vaccineName']];
        case "Vaccines":
            return [data['doses'], data['name']]
        case "FostersAndAdoptions":
            return [data['fosteredOrAdopted'], data['animalID']]
        default:
            break;
    }
}


function getDeleteQuery(table) {
    switch (table) {
        case "Animals":
            return `DELETE FROM Animals WHERE animalID = ?;`;
        case "Patrons":
            return `DELETE FROM Patrons WHERE patronID = ?;`;
        case "VaccinesAdministered":
            return `DELETE FROM VaccinesAdministered WHERE animalID = ? AND vaccineName = ?`;
        case "Vaccines":
            return `DELETE FROM Vaccines WHERE name = ?`
        case "Prescriptions":
            return `DELETE FROM Prescriptions WHERE animalID = ? AND name = ?`
        case "FostersAndAdoptions":
            return `DELETE FROM FostersAndAdoptions WHERE animalID = ?`
        default:
            break;
    }
}

function getDeleteParameters(table, data) {
    switch (table) {
        case "Animals":
            return data['animalID'];
        case "Patrons":
            return data['patronID'];
        case "VaccinesAdministered":
            return [data['animalID'], data['vaccineName']];
        case "Vaccines":
            return [data['name']]
        case "Prescriptions":
            return [data['animalID'], data['name']];
        case "FostersAndAdoptions":
            return data['animalID'];
        default:
            break;
    }
}

/* Add an entity to requested table*/
app.post('/add/:table', function (req, res) {
    var table = req.params.table;
    let data = req.body;

    //create query based on database
    query = getAddQuery(table);
    parameters = getAddParameters(table, data);

    //send query to add animal
    db.pool.query(query, parameters, function (error, results, fields) {

        //check for error
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            //check if we need to send an insertion to adoptable table
            if (table == "Animals" && data.adoptable == 'Yes') {
                updateAdoptable(results.insertId, data.adoptable, data.restrictions)
            }

            //return that there were no errors
            res.sendStatus(200);
        }
    })
})


/* update requested entity */
app.post('/update/:table', function (req, res) {
    var table = req.params.table;
    let data = req.body;

    //create query based on database
    query = getUpdateQuery(table);
    parameters = getUpdateParameters(table, data);

    //send query to add animal
    db.pool.query(query, parameters, function (error, results, fields) {

        //check for error
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            //return that there were no errors
            res.sendStatus(200);
        }
    })
})

/* Update adoptable status of animal via POST request */
app.post('/update-adoptable', function (req, res) {
    let data = req.body
    let currentStatus = {
        adoptable: "No",
        restrictions: "N/A"
    }

    //first, query info from database
    query = `SELECT * FROM Adoptable WHERE animalID = ?;`

    //send query
    db.pool.query(query, data.animalID, function (error, results, fields) {
        //check for error
        if (error) {
            console.log(error)
            res.sendStatus(400)
        }

        // if animal is adoptable, update info
        if (results.length > 0) {
            currentStatus.adoptable = "Yes"
            currentStatus.restrictions = results[0].restrictions
        }

        //if nothing changed, return response
        if (currentStatus.adoptable == data.adoptable &&
            currentStatus.restrictions == data.restrictions) {
            res.sendStatus(200)
        }

        //if only restrictions changed
        else if (currentStatus.adoptable == data.adoptable) {
            //send update, wait on response to send status back
            updateAdoptable(data.animalID, "Update", data.restrictions, function (status) {
                res.sendStatus(status)
            })
        }

        else {
            updateAdoptable(data.animalID, data.adoptable, data.restrictions, function (status) {
                res.sendStatus(status)
            })
        }
    })
})


/* Delete an entity from the requested table */
app.post('/delete/:table', function (req, res) {
    var table = req.params.table;
    let data = req.body;

    //create query based on database
    query = getDeleteQuery(table);
    parameters = getDeleteParameters(table, data);

    //send query to add animal
    db.pool.query(query, parameters, function (error, results, fields) {

        //check for error
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {

            //return that there were no errors
            res.sendStatus(200);
        }
    })
})


/* Update adoption table by adding or deleting an adoptable status */
function updateAdoptable(animalID, adoptable, restrictions) {
    var query
    var parameters

    if (adoptable == "Yes") {
        query = `INSERT INTO Adoptable(animalID, restrictions) VALUES (?, ?);`;
        parameters = [animalID, restrictions]
    }

    else if (adoptable == "No") {
        query = `DELETE FROM Adoptable WHERE animalID = ?;`;
        parameters = [animalID]
    }

    else {//adoptable == "Update"
        query = `UPDATE Adoptable SET restrictions = ? WHERE animalID = ?;`
        parameters = [restrictions, animalID]
    }

    console.log("Query: \n" + query + "\nParameters: \n" + parameters + "\n***\n\n")

    //send query to add animal
    db.pool.query(query, parameters, function (error, results, fields) {
        //check for error
        if (error) {
            console.log(error)
            return 400
        }
        else {
            return 200
        }
    })
}


/***********************************************************/

app.listen(port, 'localhost', function () {
    var address = "http://localhost:" + port + "/";
    console.log("Listening on port", port);
    console.log("Accessible at: " + address);
});