<div>
    <h1>Burni FHIR Server</h1>
    Burni is an implementation of the FHIR server with Node, Express, and MongoDB providing very simple ways to customize the <a href="https://www.hl7.org/fhir/">HL7 FHIR® specification</a> Currently, Burni support both Windows and Linux environment to enable developers to rapidly deploy a FHIR service. Burni also supports to import your <a href="https://www.hl7.org/fhir/implementationguide.html">Implementation Guide<a> to store FHIR Resources and create FHIR RESTful API as well.    
</div>

This server supported FHIR RESTFul API below:
- read (e.g. GET http://example.com/fhir/Patient/example)
- update (e.g. PUT http://example.com/fhir/Patient/example)
- delete (e.g. DELETE http://example.com/fhir/Patient/example)
- search (e.g. http://example.com/fhir/Patient?_id=example)

**The search API now only suppurt _id & empty parameter**

**The resources don't have `text` field**

<font color=red>**Don't remove Bundle.js in models/mongodb/FHIRTypeSchema**</font>

## Installation
```bash=
npm install
```

## configure

The resources config in `config\config.js`
```javascript=
module.exports = {
    // add the resource name that you need
    "Patient" : { 
        "interaction": {
            "read": true,
            "vread": true,
            "update": true,
            "delete": true,
            "history": true,
            "create": true,
            "search": true
        }
    }
}
```
dotenv in root path `.env`
```=
MONGODB_NAME="dbName"
MONGODB_HOSTS=["mongodb"]
MONGODB_PORTS=[27017]
MONGODB_USER="myAdmin"
MONGODB_PASSWORD="MymongoAdmin1"
MONGODB_SLAVEMODE=false

FHIRSERVER_HOST="localhost"
FHIRSERVER_PORT=8088
FHIRSERVER_APIPATH="fhir"

#If u want to use token auth, add below.
ENABLE_TOKEN_AUTH=true
ADMIN_LOGIN_PATH="adminLogin"  
ADMIN_USERNAME="adminUsername"
ADMIN_PASSWORD="adminPassword"
```
After configuration, run `npm run build` to generate resources
```
npm run build
```
> TypeError: genParamFunc[type] is not a function mean that search parameter method not support
## Usage
```
node server.js
```

### RESTful API
- get (search)
    - Number
    - Date (DateTime, Instance Not yet)
    - String
    - Token
    - Reference
>GET http://example.com/fhir/Patient

- getById (read)
>GET http://example.com/fhir/Patient/123
- getHistoryById (history, vread)
>GET http://example.com/fhir/Patient/_history/

> GET http://example.com/fhir/Patient/_history/1
- putById (update)
> PUT http://example.com/fhir/Patient/1
- deleteById (delete)
> DELETE http://example.com/fhir/Patient/1

### Example
Use patient from [here](https://www.hl7.org/fhir/patient-example.json.html)

Use with `postman`


POST (create)
![](https://i.imgur.com/EDsuuNA.png)

PUT (update)

create new resouce with id
![](https://i.imgur.com/lqLdSlF.png)
update `active` and `name`
![](https://i.imgur.com/6jNqKbw.png)

GET
<details>
    <summary>
        GET patient resource return bundle(Clilk here to show)
    </summary>

`http://localhost:8088/fhir/Patient/`
```json=
    {
    "resourceType": "Bundle",
    "type": "searchset",
    "total": 2,
    "link": [
        {
            "relation": "self",
            "url": "http://localhost:8088/fhir/Patient?_offset=0&_count=100"
        }
    ],
    "entry": [
        {
            "fullUrl": "http://localhost:8088/fhir/Patient/b4bbadb0-8192-4524-bde0-9962d8ab179b",
            "resource": {
                "resourceType": "Patient",
                "id": "b4bbadb0-8192-4524-bde0-9962d8ab179b",
                "identifier": [
                    {
                        "use": "usual",
                        "type": {
                            "coding": [
                                {
                                    "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                                    "code": "MR"
                                }
                            ]
                        },
                        "system": "urn:oid:1.2.36.146.595.217.0.1",
                        "value": "12345",
                        "period": {
                            "start": "2001-05-06T00:00:00.000Z"
                        },
                        "assigner": {
                            "display": "Acme Healthcare"
                        }
                    }
                ],
                "active": true,
                "name": [
                    {
                        "use": "official",
                        "family": "Chalmers",
                        "given": [
                            "Peter",
                            "James"
                        ]
                    },
                    {
                        "use": "usual",
                        "given": [
                            "Jim"
                        ]
                    },
                    {
                        "use": "maiden",
                        "family": "Windsor",
                        "given": [
                            "Peter",
                            "James"
                        ],
                        "period": {
                            "end": "2002-01-01T00:00:00.000Z"
                        }
                    }
                ],
                "telecom": [
                    {
                        "use": "home"
                    },
                    {
                        "system": "phone",
                        "value": "(03) 5555 6473",
                        "use": "work",
                        "rank": 1
                    },
                    {
                        "system": "phone",
                        "value": "(03) 3410 5613",
                        "use": "mobile",
                        "rank": 2
                    },
                    {
                        "system": "phone",
                        "value": "(03) 5555 8834",
                        "use": "old",
                        "period": {
                            "end": "2014-01-01T00:00:00.000Z"
                        }
                    }
                ],
                "gender": "male",
                "birthDate": "1974-12-25",
                "deceasedBoolean": false,
                "address": [
                    {
                        "use": "home",
                        "type": "both",
                        "line": [
                            "534 Erewhon St"
                        ],
                        "city": "PleasantVille",
                        "district": "Rainbow",
                        "state": "Vic",
                        "postalCode": "3999",
                        "period": {
                            "start": "1974-12-25T00:00:00.000Z"
                        }
                    }
                ],
                "contact": [
                    {
                        "relationship": [
                            {
                                "coding": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/v2-0131",
                                        "code": "N"
                                    }
                                ]
                            }
                        ],
                        "name": {
                            "family": "du Marché",
                            "given": [
                                "Bénédicte"
                            ]
                        },
                        "telecom": [
                            {
                                "system": "phone",
                                "value": "+33 (237) 998327"
                            }
                        ],
                        "address": {
                            "use": "home",
                            "type": "both",
                            "line": [
                                "534 Erewhon St"
                            ],
                            "city": "PleasantVille",
                            "district": "Rainbow",
                            "state": "Vic",
                            "postalCode": "3999",
                            "period": {
                                "start": "1974-12-25T00:00:00.000Z"
                            }
                        },
                        "gender": "female",
                        "period": {
                            "start": "2012-01-01T00:00:00.000Z"
                        }
                    }
                ],
                "managingOrganization": {
                    "reference": "Organization/1"
                }
            }
        },
        {
            "fullUrl": "http://localhost:8088/fhir/Patient/123456",
            "resource": {
                "resourceType": "Patient",
                "id": "123456",
                "identifier": [
                    {
                        "use": "usual",
                        "type": {
                            "coding": [
                                {
                                    "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                                    "code": "MR"
                                }
                            ]
                        },
                        "system": "urn:oid:1.2.36.146.595.217.0.1",
                        "value": "12345",
                        "period": {
                            "start": "2001-05-06T00:00:00.000Z"
                        },
                        "assigner": {
                            "display": "Acme Healthcare"
                        }
                    }
                ],
                "active": false,
                "name": [
                    {
                        "use": "official",
                        "family": "Chalmers",
                        "given": [
                            "hahahaha",
                            "hahahaha"
                        ]
                    }
                ],
                "telecom": [
                    {
                        "use": "home"
                    },
                    {
                        "system": "phone",
                        "value": "(03) 5555 6473",
                        "use": "work",
                        "rank": 1
                    },
                    {
                        "system": "phone",
                        "value": "(03) 3410 5613",
                        "use": "mobile",
                        "rank": 2
                    },
                    {
                        "system": "phone",
                        "value": "(03) 5555 8834",
                        "use": "old",
                        "period": {
                            "end": "2014-01-01T00:00:00.000Z"
                        }
                    }
                ],
                "gender": "male",
                "birthDate": "1974-12-25",
                "deceasedBoolean": false,
                "address": [
                    {
                        "use": "home",
                        "type": "both",
                        "line": [
                            "534 Erewhon St"
                        ],
                        "city": "PleasantVille",
                        "district": "Rainbow",
                        "state": "Vic",
                        "postalCode": "3999",
                        "period": {
                            "start": "1974-12-25T00:00:00.000Z"
                        }
                    }
                ],
                "contact": [
                    {
                        "relationship": [
                            {
                                "coding": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/v2-0131",
                                        "code": "N"
                                    }
                                ]
                            }
                        ],
                        "name": {
                            "family": "du Marché",
                            "given": [
                                "Bénédicte"
                            ]
                        },
                        "telecom": [
                            {
                                "system": "phone",
                                "value": "+33 (237) 998327"
                            }
                        ],
                        "address": {
                            "use": "home",
                            "type": "both",
                            "line": [
                                "534 Erewhon St"
                            ],
                            "city": "PleasantVille",
                            "district": "Rainbow",
                            "state": "Vic",
                            "postalCode": "3999",
                            "period": {
                                "start": "1974-12-25T00:00:00.000Z"
                            }
                        },
                        "gender": "female",
                        "period": {
                            "start": "2012-01-01T00:00:00.000Z"
                        }
                    }
                ],
                "managingOrganization": {
                    "reference": "Organization/1"
                }
            }
        }
    ]
}
```
    
</details>

<details>
    <summary>
        GET patient by id (Click here to show)
    </summary>

`http://localhost:8088/fhir/Patient/123456`
```json=
{
    "resourceType": "Patient",
    "id": "123456",
    "identifier": [
        {
            "use": "usual",
            "type": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                        "code": "MR"
                    }
                ]
            },
            "system": "urn:oid:1.2.36.146.595.217.0.1",
            "value": "12345",
            "period": {
                "start": "2001-05-06T00:00:00.000Z"
            },
            "assigner": {
                "display": "Acme Healthcare"
            }
        }
    ],
    "active": false,
    "name": [
        {
            "use": "official",
            "family": "Chalmers",
            "given": [
                "hahahaha",
                "hahahaha"
            ]
        }
    ],
    "telecom": [
        {
            "use": "home"
        },
        {
            "system": "phone",
            "value": "(03) 5555 6473",
            "use": "work",
            "rank": 1
        },
        {
            "system": "phone",
            "value": "(03) 3410 5613",
            "use": "mobile",
            "rank": 2
        },
        {
            "system": "phone",
            "value": "(03) 5555 8834",
            "use": "old",
            "period": {
                "end": "2014-01-01T00:00:00.000Z"
            }
        }
    ],
    "gender": "male",
    "birthDate": "1974-12-25",
    "deceasedBoolean": false,
    "address": [
        {
            "use": "home",
            "type": "both",
            "line": [
                "534 Erewhon St"
            ],
            "city": "PleasantVille",
            "district": "Rainbow",
            "state": "Vic",
            "postalCode": "3999",
            "period": {
                "start": "1974-12-25T00:00:00.000Z"
            }
        }
    ],
    "contact": [
        {
            "relationship": [
                {
                    "coding": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/v2-0131",
                            "code": "N"
                        }
                    ]
                }
            ],
            "name": {
                "family": "du Marché",
                "given": [
                    "Bénédicte"
                ]
            },
            "telecom": [
                {
                    "system": "phone",
                    "value": "+33 (237) 998327"
                }
            ],
            "address": {
                "use": "home",
                "type": "both",
                "line": [
                    "534 Erewhon St"
                ],
                "city": "PleasantVille",
                "district": "Rainbow",
                "state": "Vic",
                "postalCode": "3999",
                "period": {
                    "start": "1974-12-25T00:00:00.000Z"
                }
            },
            "gender": "female",
            "period": {
                "start": "2012-01-01T00:00:00.000Z"
            }
        }
    ],
    "managingOrganization": {
        "reference": "Organization/1"
    }
}
```

</details>

DELETE `http://localhost:8088/fhir/Patient/123456`
![](https://i.imgur.com/PGXRya4.png)

Then GET by id
![](https://i.imgur.com/M9V5xaF.png)

# TODO
- [x] metadata
- [ ] history
- [x] search parameters
- [x] support FHIR implementation guide(IG)

## Special project
- [Raccoon](https://github.com/cylab-tw/raccoon) - a noSQL-based DICOMWeb Server.
- [ngs2fhir](https://github.com/cylab-tw/ngs2fhir) - Convert the next generation sequencing (NGS) data to the FHIR Resources.
