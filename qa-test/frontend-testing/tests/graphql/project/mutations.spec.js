import { test, expect } from '@playwright/test'
import { MongoClient, ObjectId } from 'mongodb'
import * as project_data from './project-data.js'

import axios from 'axios';

const ENDPOINT = "http://127.0.0.1:3000/api/graphql"

const uri =
    "mongodb://mongodb:mongodb@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.1";
const mongoClient = new MongoClient(uri)
const database = mongoClient.db('aiverify')
const projects = database.collection('projecttemplatemodels')
const reports = database.collection('reportmodels')

test.describe('Create Project', () => {

    test('Create Project with Valid Inputs', async () => {

        // Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: project_data.PROJECT_VARIABLES
        })

        const project = response.data.data.createProject
        const projectId = project.id

        // Get Project Info directly from MongoDB
        const query = { _id: ObjectId(projectId) }
        const projectInfoObj = await projects.findOne(query)

        // Assert Response
        expect(project.projectInfo.name).toBe(projectInfoObj.projectInfo.name)
        expect(project.projectInfo.company).toBe(projectInfoObj.projectInfo.company)

    })

    test('Create Project with Invalid Project Information', async () => {

        // NULL Project Information
        let response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: {
                "project": {
                    "projectInfo": {
                        "name": null,
                        "company": null
                    }
                }
            }
        })

        let errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Unexpected error value: \"Missing variable\"')

        // Wrong Data Type Project Information
        response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: {
                "project": {
                    "projectInfo": {
                        "name": true,
                        "company": true
                    }
                }
            }
        })

        const project = response.data.data.createProject.projectInfo

        // Assert Response
        expect(project).toBeTruthy()

    })


    test('Create Project with Empty Project Information', async () => {

        const response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: {
                "project": {
                    "projectInfo": {
                        "name": "",
                        "company": ""
                    }
                }
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable \"$project\" got invalid value \"\" at \"project.projectInfo.name\"; Expected type \"name_String_minLength_1_maxLength_128\". Must be at least 1 characters in length')

    })

    test('Create Project with Invalid Global Variables', async () => {

        // NULL Global Variables
        let response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: {
                "globalVariables": [
                    {
                        "key": null,
                        "value": null
                    },
                    {
                        "key": null,
                        "value": null
                    }
                ]
            }
        })

        let errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

        // Wrong Data Type Global Variables
        response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: {
                "globalVariables": [
                    {
                        "key": true,
                        "value": true
                    },
                    {
                        "key": true,
                        "value": true
                    }
                ]
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

    })

    test('Create Project with Empty Global Variables', async () => {

        const response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: {
                "globalVariables": [
                    {
                        "key": "",
                        "value": ""
                    },
                    {
                        "key": "",
                        "value": ""
                    }
                ]
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

    })

    test('Create Project with Invalid Pages', async () => {

        // Null Pages
        let response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: {
                "pages": [
                    {
                        "layouts": [
                            {
                                "w": null,
                                "h": null,
                                "x": null,
                                "y": null,
                                "i": null,
                                "minW": null,
                                "maxW": null,
                                "minH": null,
                                "maxH": null,
                                "moved": null,
                                "static": null
                            },
                            {
                                "w": null,
                                "h": null,
                                "x": null,
                                "y": null,
                                "i": null,
                                "moved": null,
                                "static": null
                            }
                        ],
                        "reportWidgets": [
                            {
                                "widgetGID": null,
                                "key": null,
                                "layoutItemProperties": {
                                    "justifyContent": null,
                                    "alignItems": null,
                                    "color": null,
                                    "bgcolor": null,
                                },
                                "properties": null,
                            }
                        ]
                    }
                ]
            }
        })

        let errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

        // Wrong Data Type Pages
        response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: {
                "pages": [
                    {
                        "layouts": [
                            {
                                "w": true,
                                "h": true,
                                "x": true,
                                "y": true,
                                "i": true,
                                "minW": true,
                                "maxW": true,
                                "minH": true,
                                "maxH": true,
                                "moved": true,
                                "static": true
                            },
                            {
                                "w": true,
                                "h": true,
                                "x": true,
                                "y": true,
                                "i": true,
                                "moved": true,
                                "static": true
                            }
                        ],
                        "reportWidgets": [
                            {
                                "widgetGID": true,
                                "key": true,
                                "layoutItemProperties": {
                                    "justifyContent": true,
                                    "alignItems": true,
                                    "color": true,
                                    "bgcolor": true,
                                },
                                "properties": true,
                            }
                        ]
                    }
                ]
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

    })

    test('Create Project with Empty Pages', async () => {

        const response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: {
                "pages": [
                    {
                        "layouts": [
                            {
                                "w": "",
                                "h": "",
                                "x": "",
                                "y": "",
                                "i": "",
                                "minW": "",
                                "maxW": "",
                                "minH": "",
                                "maxH": "",
                                "moved": "",
                                "static": ""
                            },
                            {
                                "w": "",
                                "h": "",
                                "x": "",
                                "y": "",
                                "i": "",
                                "moved": "",
                                "static": ""
                            }
                        ],
                        "reportWidgets": [
                            {
                                "widgetGID": "",
                                "key": "",
                                "layoutItemProperties": {
                                    "justifyContent": "",
                                    "alignItems": "",
                                    "color": "",
                                    "bgcolor": "",
                                },
                                "properties": "",
                            }
                        ]
                    }
                ]
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

    })

    test('Create Project with Malformed Input Block Data', async () => {

    })

    test('Create Project with Invalid Model & Datasets Input', async () => {

        // NULL Model & Datasets
        let response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: {
                "modelAndDatasets": {
                    "model": {
                        "id": null,
                        "name": null,
                        "filename": null,
                        "filePath": null,
                        "ctime": null,
                        "size": null,
                        "status": null,
                        "description": null,
                        "serializer": null,
                        "modelFormat": null,
                        "modelType": null,
                        "errorMessages": null,
                    },
                    "testDataset": {
                        "id": null,
                        "name": null,
                        "filename": null,
                        "filePath": null,
                        "ctime": null,
                        "size": null,
                        "status": null,
                        "description": null,
                        "dataColumns": null,
                        "serializer": null,
                        "dataFormat": null,
                        "errorMessages": null
                    },
                    "groundTruthDataset": {
                        "id": null,
                        "name": null,
                        "filename": null,
                        "filePath": null,
                        "ctime": null,
                        "size": null,
                        "status": null,
                        "description": null,
                        "dataColumns": null,
                        "serializer": null,
                        "dataFormat": null,
                        "errorMessages": null
                    },
                    "groundTruthColumn": null,
                }
            }
        })

        let errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

        // Wrong Data Type Model & Datasets
        response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: {
                "modelAndDatasets": {
                    "model": {
                        "id": true,
                        "name": true,
                        "filename": true,
                        "filePath": true,
                        "ctime": true,
                        "size": true,
                        "status": true,
                        "description": true,
                        "serializer": true,
                        "modelFormat": true,
                        "modelType": true,
                        "errorMessages": true
                    },
                    "testDataset": {
                        "id": true,
                        "name": true,
                        "filename": true,
                        "filePath": true,
                        "ctime": true,
                        "size": true,
                        "status": true,
                        "description": true,
                        "dataColumns": true,
                        "serializer": true,
                        "dataFormat": true,
                        "errorMessages": true
                    },
                    "groundTruthDataset": {
                        "id": true,
                        "name": true,
                        "filename": true,
                        "filePath": true,
                        "ctime": true,
                        "size": true,
                        "status": true,
                        "description": true,
                        "dataColumns": true,
                        "serializer": true,
                        "dataFormat": true,
                        "errorMessages": true
                    },
                    "groundTruthColumn": true,
                }
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

    })

    test('Create Project with Empty Model & Datasets Input', async () => {

        const response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: {
                "modelAndDatasets": {
                    "model": {
                        "id": "",
                        "name": "",
                        "filename": "",
                        "filePath": "",
                        "ctime": "",
                        "size": "",
                        "status": "",
                        "description": "",
                        "serializer": "",
                        "modelFormat": "",
                        "modelType": "",
                        "errorMessages": "",
                    },
                    "testDataset": {
                        "id": "",
                        "name": "",
                        "filename": "",
                        "filePath": "",
                        "ctime": "",
                        "size": "",
                        "status": "",
                        "description": "",
                        "dataColumns": [],
                        "serializer": "",
                        "dataFormat": "",
                        "errorMessages": ""
                    },
                    "groundTruthDataset": {
                        "id": "",
                        "name": "",
                        "filename": "",
                        "filePath": "",
                        "ctime": "",
                        "size": "",
                        "status": "",
                        "description": "",
                        "dataColumns": [],
                        "serializer": "",
                        "dataFormat": "",
                        "errorMessages": ""
                    },
                    "groundTruthColumn": "",
                }
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

    })

    test('Create Project with Invalid Test Information Input Data', async () => {

        // Null Test Information Data
        let response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: {
                "testInformationData": [
                    {
                        "algorithmGID": null,
                        "isTestArgumentsValid": null,
                        "testArguments": {
                            "sensitive_feature": null
                        },
                    }
                ]
            }
        })

        let errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

        // Wrong Data Type Information Data
        response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: {
                "testInformationData": [
                    {
                        "algorithmGID": true,
                        "isTestArgumentsValid": true,
                        "testArguments": {
                            "sensitive_feature": true
                        },
                    }
                ]
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')


    })

    test('Create Project with Empty Test Information Input Data', async () => {

        const response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: {
                "testInformationData": [
                    {
                        "algorithmGID": "",
                        "isTestArgumentsValid": "",
                        "testArguments": {
                            "sensitive_feature": []
                        },
                    }
                ]
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

    })

})

test.describe('Create Project From Template', () => {

    let templateId

    test.beforeAll(async () => {

        const response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT_TEMPLATE,
            variables: project_data.PROJECT_TEMPLATE_VARIABLES
        })

        templateId = response.data.data.createProjectTemplate.id
    })

    test('Create Project From Template with Valid Input and Template ID', async () => {

        const response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT_FROM_TEMPLATE,
            variables: {
                "project": project_data.PROJECT_BY_TEMPLATE_VARIABLES,
                "templateId": templateId
            }
        })

        const project = response.data.data.createProjectFromTemplate
        const projectId = project.id

        // Get Project Info directly from MongoDB
        const query = { _id: ObjectId(projectId) }
        const projectInfoObj = await projects.findOne(query)

        // Assert Response
        expect(projectInfoObj.projectInfo.name).toBe(project_data.PROJECT_BY_TEMPLATE_VARIABLES.projectInfo.name)
        expect(projectInfoObj.projectInfo.company).toBe(project_data.PROJECT_BY_TEMPLATE_VARIABLES.projectInfo.company)
        expect(projectInfoObj.globalVars[0].key).toBe(project_data.PROJECT_BY_TEMPLATE_VARIABLES.globalVars[0].key)
        expect(projectInfoObj.globalVars[0].value).toBe(project_data.PROJECT_BY_TEMPLATE_VARIABLES.globalVars[0].value)

    })

    test('Create Project From Template with Empty Input and Template ID', async () => {

        const projectFromTemplate = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT_FROM_TEMPLATE,
            variables: {
                "project": "",
                "templateId": templateId
            }
        })

        const errorMessage = projectFromTemplate.data.errors
        expect(errorMessage[0].message).toBe('Variable "$project" got invalid value ""; Expected type "ProjectInput" to be an object.')
    })

    test('Create Project From Template with Valid Input and Invalid Template ID', async () => {

    })

    test('Create Project From Template with Valid Input and Empty Template ID', async () => {
        const projectFromTemplate = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT_FROM_TEMPLATE,
            variables: {
                "project": project_data.CREATE_PROJECT_FROM_TEMPLATE,
                "templateId": templateId
            }
        })

        const errorMessage = projectFromTemplate.data
        // console.log(errorMessage)
        // expect(errorMessage[0].message).toBe('Variable "$project" got invalid value ""; Expected type "ProjectInput" to be an object.')

    })
})

test.describe('Update Project', () => {

    let project, projectId

    test.beforeAll(async () => {

        // Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: project_data.PROJECT_VARIABLES
        })

        project = response.data.data.createProject
        projectId = project.id

    })

    test('Update Project with Valid Inputs', async () => {

        // Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_data.UPDATE_PROJECT,
            variables: {
                "updateProjectId": projectId,
                "project": {
                    "projectInfo": {
                        "name": "Test 11",
                        "company": "Testing Company 10"
                    }
                },
                "globalVars": [
                    {
                        "key": "10",
                        "value": "20"
                    },
                    {
                        "key": "20",
                        "value": "30"
                    }
                ],
                "inputBlockData": {
                    "aiverify.stock.fairness-metrics-toolbox-widgets:fairness-tree": {}
                },
                "testInformationData": [
                    {
                        "algorithmGID": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox",
                        "isTestArgumentsValid": true,
                        "testArguments": {
                            "sensitive_feature": [
                                "Gender",
                            ]
                        },
                    }
                ],
                "pages": [
                    {
                        "layouts": [
                            {
                                "w": 12,
                                "h": 12,
                                "x": 12,
                                "y": 13,
                                "i": "1678694721822",
                                "minW": 12,
                                "maxW": 12,
                                "minH": 12,
                                "maxH": 36,
                                "moved": true,
                                "static": false
                            },
                            {
                                "w": 12,
                                "h": 1,
                                "x": 0,
                                "y": 35,
                                "i": "_youcantseeme",
                                "moved": false,
                                "static": false
                            }
                        ],
                        "reportWidgets": [
                            {
                                "widgetGID": "aiverify.stock.fairness-metrics-toolbox-widgets:false-discovery-rate-chart",
                                "key": "1678694721822",
                                "layoutItemProperties": {
                                    "justifyContent": "left",
                                    "alignItems": "top",
                                    "color": null,
                                    "bgcolor": null,
                                },
                                "properties": null,
                            }
                        ]
                    }
                ],
            }
        })

        const projectInfo = response.data.data.updateProject.projectInfo

        // Get Project Info directly from MongoDB
        const query = { _id: ObjectId(projectId) }
        const projectInfoObj = await projects.findOne(query)

        // Assert Response
        expect(projectInfo.name).toBe(projectInfoObj.projectInfo.name)
        expect(projectInfo.company).toBe(projectInfoObj.projectInfo.company)

    })

    test('Update Project with Invalid Project Information', async () => {

        // Non-Existing Project ID
        let response = await axios.post(ENDPOINT, {
            query: project_data.UPDATE_PROJECT,
            variables: {
                "updateProjectId": "123",
                "project": {
                    "projectInfo": {
                        "name": "Test 3",
                        "company": "Testing Company 3"
                    }
                }
            }
        })

        let errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$updateProjectId" got invalid value "123"; Value is not a valid mongodb object id of form: 123')

        // Null Project Information
        response = await axios.post(ENDPOINT, {
            query: project_data.UPDATE_PROJECT,
            variables: {
                "updateProjectId": projectId,
                "project": {
                    "projectInfo": {
                        "name": null,
                        "company": null
                    }
                }
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Cannot return null for non-nullable field ProjectInformation.name.')

        // Wrong Data Type
        response = await axios.post(ENDPOINT, {
            query: project_data.UPDATE_PROJECT,
            variables: {
                "updateProjectId": projectId,
                "project": {
                    "projectInfo": {
                        "name": true,
                        "company": true
                    }
                }
            }
        })

        const project = response.data.data.updateProject

        // Assert Response
        expect(project).toBeTruthy()

    })

    test('Update Project with Empty Project Information', async () => {

        const response = await axios.post(ENDPOINT, {
            query: project_data.UPDATE_PROJECT,
            variables: {
                "updateProjectId": "",
                "project": {
                    "projectInfo": {
                        "name": "",
                        "company": ""
                    }
                }
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$updateProjectId" got invalid value ""; Value is not a valid mongodb object id of form: ')
        expect(errorMessage[1].message).toBe('Variable "$project" got invalid value "" at "project.projectInfo.name"; Expected type "name_String_minLength_1_maxLength_128". Must be at least 1 characters in length')

    })

    test('Update Project with Invalid Global Variables', async () => {

        // NULL Global Variables
        let response = await axios.post(ENDPOINT, {
            query: project_data.UPDATE_PROJECT,
            variables: {
                "updateProjectId": projectId,
                "globalVariables": [
                    {
                        "key": null,
                        "value": null
                    },
                    {
                        "key": null,
                        "value": null
                    }
                ]
            }
        })

        let errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

        // Wrong Data Type Global Variables
        response = await axios.post(ENDPOINT, {
            query: project_data.UPDATE_PROJECT,
            variables: {
                "updateProjectId": projectId,
                "globalVariables": [
                    {
                        "key": true,
                        "value": true
                    },
                    {
                        "key": true,
                        "value": true
                    }
                ]
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

    })

    test('Update Project with Empty Global Variables', async () => {

        const response = await axios.post(ENDPOINT, {
            query: project_data.UPDATE_PROJECT,
            variables: {
                "updateProjectId": projectId,
                "globalVariables": [
                    {
                        "key": "",
                        "value": ""
                    },
                    {
                        "key": "",
                        "value": ""
                    }
                ]
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

    })

    test('Update Project with Invalid Pages', async () => {

        // Null Pages
        let response = await axios.post(ENDPOINT, {
            query: project_data.UPDATE_PROJECT,
            variables: {
                "updateProjectId": projectId,
                "pages": [
                    {
                        "layouts": [
                            {
                                "w": null,
                                "h": null,
                                "x": null,
                                "y": null,
                                "i": null,
                                "minW": null,
                                "maxW": null,
                                "minH": null,
                                "maxH": null,
                                "moved": null,
                                "static": null
                            },
                            {
                                "w": null,
                                "h": null,
                                "x": null,
                                "y": null,
                                "i": null,
                                "moved": null,
                                "static": null
                            }
                        ],
                        "reportWidgets": [
                            {
                                "widgetGID": null,
                                "key": null,
                                "layoutItemProperties": {
                                    "justifyContent": null,
                                    "alignItems": null,
                                    "color": null,
                                    "bgcolor": null,
                                },
                                "properties": null,
                            }
                        ]
                    }
                ]
            }
        })

        let errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

        // Wrong Data Type Pages
        response = await axios.post(ENDPOINT, {
            query: project_data.UPDATE_PROJECT,
            variables: {
                "updateProjectId": projectId,
                "pages": [
                    {
                        "layouts": [
                            {
                                "w": true,
                                "h": true,
                                "x": true,
                                "y": true,
                                "i": true,
                                "minW": true,
                                "maxW": true,
                                "minH": true,
                                "maxH": true,
                                "moved": true,
                                "static": true
                            },
                            {
                                "w": true,
                                "h": true,
                                "x": true,
                                "y": true,
                                "i": true,
                                "moved": true,
                                "static": true
                            }
                        ],
                        "reportWidgets": [
                            {
                                "widgetGID": true,
                                "key": true,
                                "layoutItemProperties": {
                                    "justifyContent": true,
                                    "alignItems": true,
                                    "color": true,
                                    "bgcolor": true,
                                },
                                "properties": true,
                            }
                        ]
                    }
                ]
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

    })

    test('Update Project with Empty Pages', async () => {

        const response = await axios.post(ENDPOINT, {
            query: project_data.UPDATE_PROJECT,
            variables: {
                "updateProjectId": projectId,
                "pages": [
                    {
                        "layouts": [
                            {
                                "w": "",
                                "h": "",
                                "x": "",
                                "y": "",
                                "i": "",
                                "minW": "",
                                "maxW": "",
                                "minH": "",
                                "maxH": "",
                                "moved": "",
                                "static": ""
                            },
                            {
                                "w": "",
                                "h": "",
                                "x": "",
                                "y": "",
                                "i": "",
                                "moved": "",
                                "static": ""
                            }
                        ],
                        "reportWidgets": [
                            {
                                "widgetGID": "",
                                "key": "",
                                "layoutItemProperties": {
                                    "justifyContent": "",
                                    "alignItems": "",
                                    "color": "",
                                    "bgcolor": "",
                                },
                                "properties": "",
                            }
                        ]
                    }
                ]
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

    })

    test('Update Project with Malformed Input Block Data', async () => {

    })

    test('Update Project with Invalid Model & Datasets Input', async () => {

        // NULL Model & Datasets
        let response = await axios.post(ENDPOINT, {
            query: project_data.UPDATE_PROJECT,
            variables: {
                "updateProjectId": projectId,
                "modelAndDatasets": {
                    "model": {
                        "id": null,
                        "name": null,
                        "filename": null,
                        "filePath": null,
                        "ctime": null,
                        "size": null,
                        "status": null,
                        "description": null,
                        "serializer": null,
                        "modelFormat": null,
                        "modelType": null,
                        "errorMessages": null,
                    },
                    "testDataset": {
                        "id": null,
                        "name": null,
                        "filename": null,
                        "filePath": null,
                        "ctime": null,
                        "size": null,
                        "status": null,
                        "description": null,
                        "dataColumns": null,
                        "serializer": null,
                        "dataFormat": null,
                        "errorMessages": null
                    },
                    "groundTruthDataset": {
                        "id": null,
                        "name": null,
                        "filename": null,
                        "filePath": null,
                        "ctime": null,
                        "size": null,
                        "status": null,
                        "description": null,
                        "dataColumns": null,
                        "serializer": null,
                        "dataFormat": null,
                        "errorMessages": null
                    },
                    "groundTruthColumn": null,
                }
            }
        })

        let errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

        // Wrong Data Type Model & Datasets
        response = await axios.post(ENDPOINT, {
            query: project_data.UPDATE_PROJECT,
            variables: {
                "updateProjectId": projectId,
                "modelAndDatasets": {
                    "model": {
                        "id": true,
                        "name": true,
                        "filename": true,
                        "filePath": true,
                        "ctime": true,
                        "size": true,
                        "status": true,
                        "description": true,
                        "serializer": true,
                        "modelFormat": true,
                        "modelType": true,
                        "errorMessages": true
                    },
                    "testDataset": {
                        "id": true,
                        "name": true,
                        "filename": true,
                        "filePath": true,
                        "ctime": true,
                        "size": true,
                        "status": true,
                        "description": true,
                        "dataColumns": true,
                        "serializer": true,
                        "dataFormat": true,
                        "errorMessages": true
                    },
                    "groundTruthDataset": {
                        "id": true,
                        "name": true,
                        "filename": true,
                        "filePath": true,
                        "ctime": true,
                        "size": true,
                        "status": true,
                        "description": true,
                        "dataColumns": true,
                        "serializer": true,
                        "dataFormat": true,
                        "errorMessages": true
                    },
                    "groundTruthColumn": true,
                }
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

    })

    test('Update Project with Empty Model & Datasets Input', async () => {

        const response = await axios.post(ENDPOINT, {
            query: project_data.UPDATE_PROJECT,
            variables: {
                "updateProjectId": projectId,
                "modelAndDatasets": {
                    "model": {
                        "id": "",
                        "name": "",
                        "filename": "",
                        "filePath": "",
                        "ctime": "",
                        "size": "",
                        "status": "",
                        "description": "",
                        "serializer": "",
                        "modelFormat": "",
                        "modelType": "",
                        "errorMessages": "",
                    },
                    "testDataset": {
                        "id": "",
                        "name": "",
                        "filename": "",
                        "filePath": "",
                        "ctime": "",
                        "size": "",
                        "status": "",
                        "description": "",
                        "dataColumns": [],
                        "serializer": "",
                        "dataFormat": "",
                        "errorMessages": ""
                    },
                    "groundTruthDataset": {
                        "id": "",
                        "name": "",
                        "filename": "",
                        "filePath": "",
                        "ctime": "",
                        "size": "",
                        "status": "",
                        "description": "",
                        "dataColumns": [],
                        "serializer": "",
                        "dataFormat": "",
                        "errorMessages": ""
                    },
                    "groundTruthColumn": "",
                }
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

    })

    test('Update Project with Invalid Test Information Input Data', async () => {

        // Null Test Information Data
        let response = await axios.post(ENDPOINT, {
            query: project_data.UPDATE_PROJECT,
            variables: {
                "updateProjectId": projectId,
                "testInformationData": [
                    {
                        "algorithmGID": null,
                        "isTestArgumentsValid": null,
                        "testArguments": {
                            "sensitive_feature": null
                        },
                    }
                ]
            }
        })

        let errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

        // Wrong Data Type Information Data
        response = await axios.post(ENDPOINT, {
            query: project_data.UPDATE_PROJECT,
            variables: {
                "updateProjectId": projectId,
                "testInformationData": [
                    {
                        "algorithmGID": true,
                        "isTestArgumentsValid": true,
                        "testArguments": {
                            "sensitive_feature": true
                        },
                    }
                ]
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

    })

    test('Update Project with Empty Test Information Input Data', async () => {

        const response = await axios.post(ENDPOINT, {
            query: project_data.UPDATE_PROJECT,
            variables: {
                "updateProjectId": projectId,
                "testInformationData": [
                    {
                        "algorithmGID": "",
                        "isTestArgumentsValid": "",
                        "testArguments": {
                            "sensitive_feature": []
                        },
                    }
                ]
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$project" of required type "ProjectInput!" was not provided.')

    })

})

test.describe('Delete Project', () => {

    let project, projectId

    test.beforeAll(async () => {

        // Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: project_data.PROJECT_VARIABLES
        })

        project = response.data.data.createProject
        projectId = project.id

    })

    test('Delete Project with Valid Project ID', async () => {

        // Send Request
        await axios.post(ENDPOINT, {
            query: project_data.DELETE_PROJECT,
            variables: {
                "deleteProjectId": projectId
            }
        })

        const response = await axios.post(ENDPOINT, {
            query: project_data.GET_PROJECT_BY_ID,
            variables: {
                "projectId": projectId
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Unexpected error value: "Invalid ID"')
    })

    test('Delete Project with Invalid Project ID', async () => {

        // Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_data.DELETE_PROJECT,
            variables: {
                "deleteProjectId": "63b5496ac05b0b2df748f46b"
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Unexpected error value: "Invalid ID"')
    })

    test('Delete Project with Empty Project ID', async () => {

        // Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_data.DELETE_PROJECT,
            variables: {
                "deleteProjectId": ""
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable \"$deleteProjectId\" got invalid value \"\"; Value is not a valid mongodb object id of form: ')
    })

})

test.describe('Clone Project', () => {

    let project, projectId

    test.beforeAll(async () => {

        // Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: project_data.PROJECT_VARIABLES
        })

        project = response.data.data.createProject
        projectId = project.id

    })

    test('Clone Project with Valid Project ID', async () => {

        // Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_data.CLONE_PROJECT,
            variables: {
                "cloneProjectId": projectId
            }
        })

        const projectInfo = response.data.data.cloneProject.projectInfo

        // Get Project Info directly from MongoDB
        const query = { _id: ObjectId(projectId) };
        const projectInfoObj = await projects.findOne(query)

        // Assert Response
        expect(projectInfo.name).toBe("Copy of " + projectInfoObj.projectInfo.name)
        expect(projectInfo.company).toBe(projectInfoObj.projectInfo.company)
    })

    test('Clone Project with Invalid Project ID', async () => {

        // Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_data.CLONE_PROJECT,
            variables: {
                "cloneProjectId": "63b5496ac05b0b2df748f46b"
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Unexpected error value: "Invalid ID"')

    })

    test('Clone Project with Empty Project ID', async () => {

        // Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_data.CLONE_PROJECT,
            variables: {
                "cloneProjectId": ""
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$cloneProjectId" got invalid value ""; Value is not a valid mongodb object id of form: ')

    })

})

test.describe('Generate Report', () => {

    let project, projectId

    test.beforeAll(async () => {

        // Send Request
        const createProject = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: project_data.PROJECT_VARIABLES
        })

        project = createProject.data.data.createProject
        projectId = project.id

    })

    test.skip('Generate Report with Valid Inputs', async () => {

        // Generate Report into Generating Report State
        const generateReport = await axios.post(ENDPOINT, {
            query: project_data.GENERATE_REPORT_TO_GENERATE_REPORT_STATUS,
            variables: {
                "projectId": projectId,
                "algorithms": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox",
                "modelAndDatasets": {
                    "modelFileName": '/home/benflop/uploads/model/pickle_scikit_multiclasslr_loan.sav',
                    "testDatasetFileName": '/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav',
                    "groundTruthDatasetFileName": "/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav",
                    "modelType": 'Classification',
                    "groundTruthColumn": 'Interest_Rate'
                }
            }
        })

        expect(generateReport.data.data.generateReport.status).toBe("RunningTests") //Change to Report Generated
    })

    test.skip('Generate Report when Report Generation In Progress', async () => {

        // Send Request
        let generateReport = await axios.post(ENDPOINT, {
            query: project_data.GENERATE_REPORT_TO_GENERATE_REPORT_STATUS,
            variables: {
                "projectId": projectId,
                "algorithms": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox",
                "modelAndDatasets": {
                    "modelFileName": '/home/benflop/uploads/model/pickle_scikit_multiclasslr_loan.sav',
                    "testDatasetFileName": '/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav',
                    "groundTruthDatasetFileName": "/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav",
                    "modelType": 'Classification',
                    "groundTruthColumn": 'Interest_Rate'
                }
            }
        })

        generateReport = await axios.post(ENDPOINT, {
            query: project_data.GENERATE_REPORT_TO_GENERATE_REPORT_STATUS,
            variables: {
                "projectId": projectId,
                "algorithms": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox",
                "modelAndDatasets": {
                    "modelFileName": '/home/benflop/uploads/model/pickle_scikit_multiclasslr_loan.sav',
                    "testDatasetFileName": '/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav',
                    "groundTruthDatasetFileName": "/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav",
                    "modelType": 'Classification',
                    "groundTruthColumn": 'Interest_Rate'
                }
            }
        })

        const errorMessage = generateReport.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Unexpected error value: \"Previous report generation still running\"")

    })

    test('Generate Report with Invalid Project ID', async () => {

        // Non-Existing Project ID
        let generateReport = await axios.post(ENDPOINT, {
            query: project_data.GENERATE_REPORT_TO_GENERATE_REPORT_STATUS,
            variables: {
                "projectId": "123",
                "algorithms": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox",
                "modelAndDatasets": {
                    "modelFileName": '/home/benflop/uploads/model/pickle_scikit_multiclasslr_loan.sav',
                    "testDatasetFileName": '/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav',
                    "groundTruthDatasetFileName": "/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav",
                    "modelType": 'Classification',
                    "groundTruthColumn": 'Interest_Rate'
                }
            }
        })

        let errorMessage = generateReport.data.errors
        expect(errorMessage[0].message).toBe('Variable "$projectId" got invalid value "123"; Value is not a valid mongodb object id of form: 123')

        // Null Project ID
        generateReport = await axios.post(ENDPOINT, {
            query: project_data.GENERATE_REPORT_TO_GENERATE_REPORT_STATUS,
            variables: {
                "projectId": null,
                "algorithms": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox",
                "modelAndDatasets": {
                    "modelFileName": '/home/benflop/uploads/model/pickle_scikit_multiclasslr_loan.sav',
                    "testDatasetFileName": '/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav',
                    "groundTruthDatasetFileName": "/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav",
                    "modelType": 'Classification',
                    "groundTruthColumn": 'Interest_Rate'
                }
            }
        })

        errorMessage = generateReport.data.errors
        expect(errorMessage[0].message).toBe('Variable "$projectId" of non-null type "ObjectID!" must not be null.')

        // Wrong Datatype
        generateReport = await axios.post(ENDPOINT, {
            query: project_data.GENERATE_REPORT_TO_GENERATE_REPORT_STATUS,
            variables: {
                "projectId": 0,
                "algorithms": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox",
                "modelAndDatasets": {
                    "modelFileName": '/home/benflop/uploads/model/pickle_scikit_multiclasslr_loan.sav',
                    "testDatasetFileName": '/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav',
                    "groundTruthDatasetFileName": "/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav",
                    "modelType": 'Classification',
                    "groundTruthColumn": 'Interest_Rate'
                }
            }
        })

        errorMessage = generateReport.data.errors
        expect(errorMessage[0].message).toBe('Variable "$projectId" got invalid value 0; Value is not a valid mongodb object id of form: 0')

    })

    test('Generate Report with Empty Project ID', async () => {

        const generateReport = await axios.post(ENDPOINT, {
            query: project_data.GENERATE_REPORT_TO_GENERATE_REPORT_STATUS,
            variables: {
                "projectId": "",
                "algorithms": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox",
                "modelAndDatasets": {
                    "modelFileName": '/home/benflop/uploads/model/pickle_scikit_multiclasslr_loan.sav',
                    "testDatasetFileName": '/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav',
                    "groundTruthDatasetFileName": "/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav",
                    "modelType": 'Classification',
                    "groundTruthColumn": 'Interest_Rate'
                }
            }
        })

        const errorMessage = generateReport.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Variable \"$projectId\" got invalid value \"\"; Value is not a valid mongodb object id of form: ")

    })

    test('Generate Report with Invalid Algorithms', async () => {

        // Non-Existing Algorithms
        let generateReport = await axios.post(ENDPOINT, {
            query: project_data.GENERATE_REPORT_TO_GENERATE_REPORT_STATUS,
            variables: {
                "projectId": projectId,
                "algorithms": "aiverify",
                "modelAndDatasets": {
                    "modelFileName": '/home/benflop/uploads/model/pickle_scikit_multiclasslr_loan.sav',
                    "testDatasetFileName": '/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav',
                    "groundTruthDatasetFileName": "/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav",
                    "modelType": 'Classification',
                    "groundTruthColumn": 'Interest_Rate'
                }
            }
        })

        let errorMessage = generateReport.data
        // console.log(errorMessage)
        // expect(errorMessage[0].message).toBe('')

        // Null Algorithms
        generateReport = await axios.post(ENDPOINT, {
            query: project_data.GENERATE_REPORT_TO_GENERATE_REPORT_STATUS,
            variables: {
                "projectId": projectId,
                "algorithms": null,
                "modelAndDatasets": {
                    "modelFileName": '/home/benflop/uploads/model/pickle_scikit_multiclasslr_loan.sav',
                    "testDatasetFileName": '/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav',
                    "groundTruthDatasetFileName": "/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav",
                    "modelType": 'Classification',
                    "groundTruthColumn": 'Interest_Rate'
                }
            }
        })

        errorMessage = generateReport.data.errors
        expect(errorMessage[0].message).toBe('Variable "$algorithms" of non-null type "[String]!" must not be null.')

        // Wrong Data Type Algorithms
        generateReport = await axios.post(ENDPOINT, {
            query: project_data.GENERATE_REPORT_TO_GENERATE_REPORT_STATUS,
            variables: {
                "projectId": projectId,
                "algorithms": 0,
                "modelAndDatasets": {
                    "modelFileName": '/home/benflop/uploads/model/pickle_scikit_multiclasslr_loan.sav',
                    "testDatasetFileName": '/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav',
                    "groundTruthDatasetFileName": "/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav",
                    "modelType": 'Classification',
                    "groundTruthColumn": 'Interest_Rate'
                }
            }
        })

        errorMessage = generateReport.data.errors
        expect(errorMessage[0].message).toBe('Variable "$algorithms" got invalid value 0; String cannot represent a non string value: 0')

    })

    test('Generate Report with Empty Algorithm', async () => {

        const generateReport = await axios.post(ENDPOINT, {
            query: project_data.GENERATE_REPORT_TO_GENERATE_REPORT_STATUS,
            variables: {
                "projectId": projectId,
                "algorithms": "",
                "modelAndDatasets": {
                    "modelFileName": '/home/benflop/uploads/model/pickle_scikit_multiclasslr_loan.sav',
                    "testDatasetFileName": '/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav',
                    "groundTruthDatasetFileName": "/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav",
                    "modelType": 'Classification',
                    "groundTruthColumn": 'Interest_Rate'
                }
            }
        })

        let reportStatus = generateReport.data.data
        // console.log(reportStatus)
        // expect(reportStatus).toBe()

    })

    test.skip('Generate Report with Invalid Model and Datasets', async () => {

        // Wrong Datatype Model and Datasets
        let generateReport = await axios.post(ENDPOINT, {
            query: project_data.GENERATE_REPORT_TO_GENERATE_REPORT_STATUS,
            variables: {
                "projectId": projectId,
                "algorithms": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox",
                "modelAndDatasets": {
                    "modelFileName": true,
                    "testDatasetFileName": true,
                    "groundTruthDatasetFileName": true,
                    "modelType": true,
                    "groundTruthColumn": true
                }
            }
        })

        let errorMessage = generateReport.data.errors

        expect(errorMessage[0].message).toBe('Variable "$modelAndDatasets" got invalid value true at "modelAndDatasets.modelFileName"; String cannot represent a non string value: true')
        expect(errorMessage[1].message).toBe('Variable "$modelAndDatasets" got invalid value true at "modelAndDatasets.testDatasetFileName"; String cannot represent a non string value: true')
        expect(errorMessage[2].message).toBe('Variable "$modelAndDatasets" got invalid value true at "modelAndDatasets.groundTruthDatasetFileName"; String cannot represent a non string value: true')
        expect(errorMessage[3].message).toBe('Variable "$modelAndDatasets" got invalid value true at "modelAndDatasets.modelType"; String cannot represent a non string value: true')
        expect(errorMessage[4].message).toBe('Variable "$modelAndDatasets" got invalid value true at "modelAndDatasets.groundTruthColumn"; String cannot represent a non string value: true')

        // Null Model and Datasets
        generateReport = await axios.post(ENDPOINT, {
            query: project_data.GENERATE_REPORT_TO_GENERATE_REPORT_STATUS,
            variables: {
                "projectId": projectId,
                "algorithms": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox",
                "modelAndDatasets": {
                    "modelFileName": null,
                    "testDatasetFileName": null,
                    "groundTruthDatasetFileName": null,
                    "modelType": null,
                    "groundTruthColumn": null
                }
            }
        })

        errorMessage = generateReport.data.errors
        // console.log(generateReport) //FIXME JIRA 556

        // Non-Existing Model and Datasets
        generateReport = await axios.post(ENDPOINT, {
            query: project_data.GENERATE_REPORT_TO_GENERATE_REPORT_STATUS,
            variables: {
                "projectId": projectId,
                "algorithms": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox",
                "modelAndDatasets": {
                    "modelFileName": '123',
                    "testDatasetFileName": '123',
                    "groundTruthDatasetFileName": '123',
                    "modelType": '123',
                    "groundTruthColumn": '123'
                }
            }
        })

        errorMessage = generateReport.data
        // console.log(errorMessage) //FIXME JIRA 556

    })

    test.skip('Generate Report with Empty Model and Datasets', async () => {

        const generateReport = await axios.post(ENDPOINT, {
            query: project_data.GENERATE_REPORT_TO_GENERATE_REPORT_STATUS,
            variables: {
                "projectId": projectId,
                "algorithms": "",
                "modelAndDatasets": ""
            }
        })

        const errorMessage = generateReport.data.errors
        expect(errorMessage[0].message).toBe('Variable "$modelAndDatasets" got invalid value ""; Expected type "ModelAndDatasetsReportInput" to be an object.')

    })

})

test.describe('Cancel Test Run', () => {

    let project, projectId

    test.beforeEach(async () => {

        // Send Request
        const createProject = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: project_data.PROJECT_VARIABLES
        })

        project = createProject.data.data.createProject
        projectId = project.id

    })

    test.skip('Cancel Test Run with Valid Project ID & With Report Generation', async () => {

        // Generate Report into Generating Report State
        const generateReport = await axios.post(ENDPOINT, {
            query: project_data.GENERATE_REPORT_TO_GENERATE_REPORT_STATUS,
            variables: {
                "projectId": projectId,
                "algorithms": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox",
                "modelAndDatasets": {
                    "modelFileName": '/home/benflop/uploads/model/pickle_scikit_multiclasslr_loan.sav',
                    "testDatasetFileName": '/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav',
                    "groundTruthDatasetFileName": "/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing.sav",
                    "modelType": 'Classification',
                    "groundTruthColumn": 'Interest_Rate'
                }
            }
        })

        expect(generateReport.data.data.generateReport.status).toBe("RunningTests")

        // Cancel Test Run
        const response = await axios.post(ENDPOINT, {
            query: project_data.CANCEL_TEST_RUNS,
            variables: {
                "projectId": projectId,
                "algorithms": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox"
            }
        })

        const testRun = response.data.data.cancelTestRuns

        // Assert Response
        expect(testRun.status).toBe("ReportGenerated")
        // expect(generateReport.data.data.generateReport.status).toBe("Report Generated")

    })

    test('Cancel Test Run with Invalid Project ID', async () => {

        // NULL Project ID
        let response = await axios.post(ENDPOINT, {
            query: project_data.CANCEL_TEST_RUNS,
            variables: {
                "projectId": null,
                "algorithms": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox"
            }
        })

        let errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Variable \"$projectId\" of non-null type \"ObjectID!\" must not be null.")

        // Non-existing Project ID
        response = await axios.post(ENDPOINT, {
            query: project_data.CANCEL_TEST_RUNS,
            variables: {
                "projectId": "63be7e9bd43d9b23db71ff1",
                "algorithms": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox"
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Variable \"$projectId\" got invalid value \"63be7e9bd43d9b23db71ff1\"; Value is not a valid mongodb object id of form: 63be7e9bd43d9b23db71ff1")

        // Invalid Data Type
        response = await axios.post(ENDPOINT, {
            query: project_data.CANCEL_TEST_RUNS,
            variables: {
                "projectId": 0,
                "algorithms": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox"
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Variable \"$projectId\" got invalid value 0; Value is not a valid mongodb object id of form: 0")

    })

    test('Cancel Test Run with Empty Project ID', async () => {

        //Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_data.CANCEL_TEST_RUNS,
            variables: {
                "projectId": "",
                "algorithms": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox"
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Variable \"$projectId\" got invalid value \"\"; Value is not a valid mongodb object id of form: ")

    })

    test('Cancel Test Run with Invalid Algorithm', async () => {

        //Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_data.CANCEL_TEST_RUNS,
            variables: {
                "projectId": projectId,
                "algorithms": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics"
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Unexpected error value: \"Report not found\"") // TODO Correct Error Message?

    })

    test('Cancel Test Run with Empty Algorithm', async () => {

        //Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_data.CANCEL_TEST_RUNS,
            variables: {
                "projectId": projectId,
                "algorithms": ""
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Unexpected error value: \"Report not found\"") // TODO Correct Error Message?

    })

    test('Cancel Test Run with No Report', async () => {

        //Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_data.CANCEL_TEST_RUNS,
            variables: {
                "projectId": projectId,
                "algorithms": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox"
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Unexpected error value: \"Report not found\"")

    })

    test.skip('Cancel Test Run with Generating Report', async () => {

        // Generate Report into Generating Report State
        const generateReport = await axios.post(ENDPOINT, {
            query: project_data.GENERATE_REPORT_TO_GENERATE_REPORT_STATUS,
            variables: {
                "projectId": projectId,
                "algorithms": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox"
            }
        })

        expect(generateReport.data.data.generateReport.status).toBe("RunningTests")

        // Cancel Test Run
        const response = await axios.post(ENDPOINT, {
            query: project_data.CANCEL_TEST_RUNS,
            variables: {
                "projectId": projectId,
                "algorithms": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox"
            }
        })

        const testRun = response.data.data.cancelTestRuns

        // Assert Status
        expect(testRun.status).toBe("ReportGenerated")

    })

    test('Cancel Test Run with Pending Test', async () => {

    })

})

test.describe('Save Project As Template', () => {

    test('Valid Inputs', async () => {

        // Send Request
        let response = await axios.post(ENDPOINT, {
            query: project_data.CREATE_PROJECT,
            variables: project_data.PROJECT_VARIABLES
        })

        const project = response.data.data.createProject
        const projectId = project.id

        // Save Project As Template
        response = await axios.post(ENDPOINT, {
            query: project_data.SAVE_PROJECT_AS_TEMPLATE,
            variables: {
                "datasetId": "645b7551836b727afebf5e8d",
                "dataset": "pickle_pandas_tabular_loan_testing.sav",
                "projectId": projectId,
                "templateInfo": {
                    "name": "Test",
                    "description": "Test",
                    "reportTitle": "Test",
                    "company": "Test"
                }
            }
        })

        const saveProjectAsTemplate = response.data.data.saveProjectAsTemplate

        // Get Project Info directly from MongoDB
        const query = { _id: ObjectId(projectId) }
        const projectTemplateInfoObj = await projects.findOne(query)

        // Assert Project Template
        expect(saveProjectAsTemplate.pages[0].layouts).toMatchObject(projectTemplateInfoObj.pages[0].layouts)
        expect(saveProjectAsTemplate.globalVars[0].key).toBe(projectTemplateInfoObj.globalVars[0].key)
        expect(saveProjectAsTemplate.globalVars[0].value).toBe(projectTemplateInfoObj.globalVars[0].value)

    })

    test('Invalid Inputs', async () => {

        // Null Input
        let response = await axios.post(ENDPOINT, {
            query: project_data.SAVE_PROJECT_AS_TEMPLATE,
            variables: {
                "datasetId": null,
                "dataset": null,
                "projectId": null,
                "templateInfo": {
                    "name": null,
                    "description": null,
                    "reportTitle": null,
                    "company": null
                }
            }
        })

        let errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$projectId" of non-null type "ObjectID!" must not be null.')

        // Invalid Datatype
        response = await axios.post(ENDPOINT, {
            query: project_data.SAVE_PROJECT_AS_TEMPLATE,
            variables: {
                "datasetId": true,
                "dataset": true,
                "projectId": true,
                "templateInfo": {
                    "name": true,
                    "description": true,
                    "reportTitle": true,
                    "company": true
                }
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$projectId" got invalid value true; Value is not a valid mongodb object id of form: true')

    })

    test('Empty Inputs', async () => {

        // Empty Input
        const response = await axios.post(ENDPOINT, {
            query: project_data.SAVE_PROJECT_AS_TEMPLATE,
            variables: {
                "datasetId": "",
                "dataset": "",
                "projectId": "",
                "templateInfo": {
                    "name": "",
                    "description": "",
                    "reportTitle": "",
                    "company": ""
                }
            }
        })

        const errorMessage = response.data.errors
        
        // Assert Response
        expect(errorMessage[0].message).toBe('Variable \"$projectId\" got invalid value \"\"; Value is not a valid mongodb object id of form: ')
        expect(errorMessage[1].message).toBe('Variable "$templateInfo" got invalid value "" at "templateInfo.name"; Expected type "name_String_minLength_1_maxLength_128". Must be at least 1 characters in length')
    
    })
})