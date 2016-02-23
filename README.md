# opener
Read-only API for Estonian political information about donations and parties.


# Technical details
This API has been written in ES6 using node.JS version 4.
If you need to run this API on older versions of node, please feel free to use babel.

All API responses are in JSON. POST, DELETE, PATCH endpoints return 405 as this is read-only API.

# Running
To run:    
`node app.js`    
using bunyan for pretty log output:    
`node app.js | bunyan`    
configuring runtime log-level:     
`node app.js --log.level=trace | bunyan`   


# The DB
This API was build and tested with mysql but as `knex` is in use and all queries have been built using it, it should
also freely run on any other knex supported DB like PostgreSQL or sqLite.

Warning: This is a read-only API. There is no reason for the DB user to have any other rights. Application will also 
give this warning on startup.


# Importing data
Original .csv data can be found from `./data` and import files from `./import`    
Importing is done in 4 different steps and they go as following:    
`node import/` - This creates db tables    
`node import/parties_and_members.js` - Imports parties and their members    
`node import/donations.js` - Imports donations    
`node import/procurements.js` - Imports procurements data    
`node import/party_metadata.js` - Imports party metadata
`node import/company_roles.js` - Imports company roles
`node import/company_employees.js` - Imports company employees

Please note that the order is important as donations and procurements imports expect parties table to be populated.
Warning: Imports need elevated access for the DB to create tables and insert data. You can specify DB user for imports adding after imports:    
`--db.user=DBUSER --db.password=DBPASSWORD` 

# v1 API endpoints
All api endpoints are prefixed with `./api/v1/` so `yourdomain.com/api/v1/person`

Single item endpoints return objects not arrays, 404 if resource is not found.

Endpoints also provide limiting, offseting, ordering and field select specifying:     
`?fields=[field,field,field]` - Only returns selected fields. Please note that it is advised to use this at all times and request only the data you need. Note that some endpoints have predefined fields selected and you can't hide these.    
`?order=[field, -field]` - Default ordering is ASC, prepend field name with - (minus) to change the ordering to DESC. Supports multi-field ordering     
`?limit=100` - Default limit is 100    
`?offset=100` - Offsets response.     



## Persons `./person`
Returns list of all persons in the DB

## Person `./person/:id`
Returns person object

```json
{
    "id": 60026,
    "created_at": "2016-01-29T18:26:42.000Z",
    "updated_at": "2016-01-29T18:26:42.000Z",
    "party_id": 2,
    "member_id": 60026,
    "amount": 250000,
    "year": 2013,
    "first_name": "HILLAR",
    "last_name": "TEDER",
    "birthday": "1962-10-08T21:00:00.000Z",
    "personal_identification": null,
    "half_personal_identification": "620910",
    "donator": 1,
    "total_amount": 600000
}
```
## Person `./person/:id/full`
Returns full person object with his company relations, donations and party membership


## Parties `./party`
Returns list of all parties in the DB

## Party `./party/:id`
Return party object

```json
{
    "id": 2,
    "created_at": "2016-01-29T18:24:49.000Z",
    "updated_at": "2016-01-29T18:24:49.000Z",
    "name": "Eesti Reformierakond",
    "reg_code": "80 043 147"
}
```

## Party members `./party/:id/members`
Returns list of person objects that are members for given party.    

## Party donations `./party/:id/donations`
Returns list of donations for this party
```json
{
    "id": 9595,
    "created_at": "2016-01-29T18:24:52.000Z",
    "updated_at": "2016-01-29T18:24:52.000Z",
    "party_id": 2,
    "member_id": 9595,
    "amount": 33,
    "year": 2013,
    "first_name": "AARE",
    "last_name": "ETS",
    "birthday": "1973-09-21T22:00:00.000Z",
    "personal_identification": "37308230229",
    "half_personal_identification": "730823",
    "donator": 1
}
```

## Party donations sum `./party/:id/donations/sum`
Returns party donations grouped by donator. Total donations can be found under key `total_amount`

## Procurements `./procurement`
Returns list of procurement objects


## Procurement `./procurement/:id`
Returns procurement object

```json
{
    "id": 1,
    "created_at": "2016-01-29T18:26:54.000Z",
    "updated_at": "2016-01-29T18:26:54.000Z",
    "acquirer": 1,
    "provider": 2,
    "description": "Kontoriruumi väljaehitamine",
    "reference_number": "159864",
    "contract_price": 41807.56,
    "end_price": 39768.56,
    "signed_on": "2015-03-23T22:00:00.000Z",
    "status": "finished",
    "name": "Rohelise Jõemaa Koostöökogu",
    "reg_code": "80235484",
    "provider_name": "aktsiaselts Pärnu REV",
    "provider_reg_code": "10248994",
    "acquirer_name": "Rohelise Jõemaa Koostöökogu",
    "acquirer_reg_code": "80235484"
}
```

## Companies `./company`
Returns list of company objects with employees

## Company `./company/:id`
Returns company object

```json
{
    "id": 7,
    "created_at": "2016-02-22T15:58:49.000Z",
    "updated_at": "2016-02-22T15:58:49.000Z",
    "name": "aktsiaselts Olerex",
    "reg_code": "10136870"
}
```

## Full company details `./company/:id/full`
Returns company objects with employees and company procurement data

## Company employees `./company/:id/employees`
Returns list of company employees which are person objects including role in company 

```json
{
    "id": 19,
    "created_at": "2016-02-22T15:59:44.000Z",
    "updated_at": "2016-02-22T15:59:44.000Z",
    "company_id": 7,
    "employee_id": 61588,
    "role_id": 19,
    "first_name": "Piret",
    "last_name": "Miller",
    "birthday": null,
    "personal_identification": "47307152772",
    "half_personal_identification": null,
    "donator": null,
    "short": "JUHL",
    "long": "Juhatuseliige"
}
```

## Aggregated proc acquirers `./aggregated/mostprocsby`
Lists procs with total sum (over all procs) by acquirers

## Aggregated proc acquirers `./aggregated/mostprocsby`
Includes all procs

## Aggregated proc providers `./aggregated/mostprocsto`
Lists procs with total sum (over all procs) by providers

## Aggregated proc providers `./aggregated/mostprocsto/withprocs`
Includes all procs

## Some other useful queries
`/aggregated/mostprocsto?order=-total_amount` - Top proc providers with procs
`/aggregated/mostprocsby?order=-total_amount` - Top proc acquirers with procs

Use `/withprocs` with these calls to also get the procs, but be aware, many of these have hundreds of procs so use `?limit` when needed
