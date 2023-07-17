import { test, expect } from '@playwright/test'
import { MongoClient, ObjectId } from 'mongodb'
import * as project_template_data from './project-template-data.js'

import axios from 'axios';

const ENDPOINT = "http://127.0.0.1:3000/api/graphql"

const uri =
    "mongodb://mongodb:mongodb@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.1";
const mongoClient = new MongoClient(uri)
const database = mongoClient.db('aiverify')
const projects = database.collection('projecttemplatemodels')

test.describe('Create Project Template', () => {

    test('Create Project Template with Valid Inputs', async () => {

        //Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_template_data.CREATE_PROJECT_TEMPLATE,
            variables: project_template_data.PROJECT_TEMPLATE_VARIABLES
        })

        const projectTemplateInfo = response.data.data.createProjectTemplate

        const projectTemplateId = projectTemplateInfo.id

        // Get Project Info directly from MongoDB
        const query = { _id: ObjectId(projectTemplateId) }
        const projectTemplateInfoObj = await projects.findOne(query)

        // Assert Response
        expect(projectTemplateInfo.projectInfo.name).toBe(projectTemplateInfoObj.projectInfo.name)
        expect(projectTemplateInfo.projectInfo.description).toBe(projectTemplateInfoObj.projectInfo.description)
        expect(projectTemplateInfo.projectInfo.reportTitle).toBe(projectTemplateInfoObj.projectInfo.reportTitle)
        expect(projectTemplateInfo.projectInfo.company).toBe(projectTemplateInfoObj.projectInfo.company)

        expect(projectTemplateInfo.pages[0].layouts).toMatchObject(projectTemplateInfoObj.pages[0].layouts)
        expect(projectTemplateInfo.pages[0].reportWidgets[0].widgetGID).toBe(projectTemplateInfoObj.pages[0].reportWidgets[0].widgetGID)
        expect(projectTemplateInfo.pages[0].reportWidgets[0].key).toBe(projectTemplateInfoObj.pages[0].reportWidgets[0].key)
        expect(projectTemplateInfo.pages[0].reportWidgets[0].layoutItemProperties).toMatchObject(projectTemplateInfoObj.pages[0].reportWidgets[0].layoutItemProperties)
        expect(projectTemplateInfo.pages[0].reportWidgets[0].properties).toBe(projectTemplateInfoObj.pages[0].reportWidgets[0].properties)

        expect(projectTemplateInfo.globalVars[0].key).toBe(projectTemplateInfoObj.globalVars[0].key)
        expect(projectTemplateInfo.globalVars[0].value).toBe(projectTemplateInfoObj.globalVars[0].value)

        expect(projectTemplateInfo.globalVars[1].key).toBe(projectTemplateInfoObj.globalVars[1].key)
        expect(projectTemplateInfo.globalVars[1].value).toBe(projectTemplateInfoObj.globalVars[1].value)
    })

    test('Create Project Template with Invalid Project Information', async () => {

        // Test For Null Project Information
        let response = await axios.post(ENDPOINT, {
            query: project_template_data.CREATE_PROJECT_TEMPLATE,
            variables: {
                "projectTemplate": {
                    "projectInfo": {
                        "name": null,
                        "description": null,
                        "reportTitle": null,
                        "company": null
                    }
                }
            }
        })

        let errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Unexpected error value: \"Missing variable\"")

        // Test For Integer Project Information
        response = await axios.post(ENDPOINT, {
            query: project_template_data.CREATE_PROJECT_TEMPLATE,
            variables: {
                "projectTemplate": {
                    "projectInfo": {
                        "name": 0,
                        "description": 0,
                        "reportTitle": 0,
                        "company": 0
                    }
                }
            }
        })

        const projectTemplateInfo = response.data.data.createProjectTemplate

        // Assert Response
        expect(projectTemplateInfo).toBeTruthy()

    })

    test('Create Project Template with Empty Project Information', async () => {

        // Test For Empty Values
        const response = await axios.post(ENDPOINT, {
            query: project_template_data.CREATE_PROJECT_TEMPLATE,
            variables: {
                "projectTemplate": {
                    "projectInfo": {
                        "name": "",
                        "description": "",
                        "reportTitle": "",
                        "company": ""
                    }
                }
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$projectTemplate" got invalid value "" at "projectTemplate.projectInfo.name"; Expected type "name_String_minLength_1_maxLength_128". Must be at least 1 characters in length')

    })

    test('Create Project Template with Invalid Global Variable', async () => {

        // Test For Null Global Variables
        let response = await axios.post(ENDPOINT, {
            query: project_template_data.CREATE_PROJECT_TEMPLATE,
            variables: {
                "projectTemplate": {
                    "globalVars": {
                        "key": null,
                        "value": null
                    }
                }
            }
        })

        let errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Variable \"$projectTemplate\" got invalid value null at \"projectTemplate.globalVars.key\"; Expected non-nullable type \"key_String_NotNull_minLength_1_maxLength_128!\" not to be null.")
        expect(errorMessage[1].message).toBe("Variable \"$projectTemplate\" got invalid value null at \"projectTemplate.globalVars.value\"; Expected non-nullable type \"value_String_NotNull_minLength_1_maxLength_128!\" not to be null.")

        // Test For Integer Global Variables
        response = await axios.post(ENDPOINT, {
            query: project_template_data.CREATE_PROJECT_TEMPLATE,
            variables: {
                "projectTemplate": {
                    "globalVars": {
                        "key": 0,
                        "value": 0
                    }
                }
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Cannot read properties of undefined (reading 'name')")

    })

    test('Create Project Template with Empty Global Variable', async () => {

        // Test For Empty Global Variables
        let response = await axios.post(ENDPOINT, {
            query: project_template_data.CREATE_PROJECT_TEMPLATE,
            variables: {
                "projectTemplate": {
                    "globalVars": {
                        "key": "",
                        "value": ""
                    }
                }
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$projectTemplate" got invalid value "" at "projectTemplate.globalVars.key"; Expected type "key_String_NotNull_minLength_1_maxLength_128". Must be at least 1 characters in length')
        expect(errorMessage[1].message).toBe('Variable "$projectTemplate" got invalid value "" at "projectTemplate.globalVars.value"; Expected type "value_String_NotNull_minLength_1_maxLength_128". Must be at least 1 characters in length')

    })

    test('Create Project Template with Invalid Pages', async () => {

        // Test For Null Values in Layouts
        let response = await axios.post(ENDPOINT, {
            query: project_template_data.CREATE_PROJECT_TEMPLATE,
            variables: {
                "projectTemplate": {
                    "projectInfo": {
                        "name": "Template 3",
                        "company": "Template 3",
                        "description": "Template 3",
                        "reportTitle": "Template 3"
                    },
                    "pages": {
                        "layouts": {
                            "w": null,
                            "h": null,
                            "x": null,
                            "y": null,
                            "i": null,
                            "minW": null,
                            "maxW": null,
                            "minH": null,
                            "maxH": null,
                            "static": null
                        }
                    }
                },
            }
        })

        let errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$projectTemplate" got invalid value null at "projectTemplate.pages.layouts.i"; Expected non-nullable type "i_String_NotNull_minLength_1_maxLength_128!" not to be null.')
        expect(errorMessage[1].message).toBe('Variable "$projectTemplate" got invalid value null at "projectTemplate.pages.layouts.x"; Expected non-nullable type "x_Int_NotNull_min_0_max_12!" not to be null.')
        expect(errorMessage[2].message).toBe('Variable "$projectTemplate" got invalid value null at "projectTemplate.pages.layouts.y"; Expected non-nullable type "y_Int_NotNull_min_0_max_36!" not to be null.')
        expect(errorMessage[3].message).toBe('Variable \"$projectTemplate\" got invalid value null at \"projectTemplate.pages.layouts.w\"; Expected non-nullable type \"w_Int_NotNull_min_0_max_12!\" not to be null.')

        // Test For Float Values in Layouts
        response = await axios.post(ENDPOINT, {
            query: project_template_data.CREATE_PROJECT_TEMPLATE,
            variables: {
                "projectTemplate": {
                    "projectInfo": {
                        "name": "Template 3",
                        "company": "Template 3",
                        "description": "Template 3",
                        "reportTitle": "Template 3"
                    },
                    "pages": {
                        "layouts": {
                            "h": 0.1,
                            "i": 0.1,
                            "isBounded": true,
                            "isDraggable": true,
                            "isResizable": true,
                            "maxH": 0.1,
                            "maxW": 0.1,
                            "minH": 0.1,
                            "minW": 0.1,
                            "resizeHandles": 0.1,
                            "static": true,
                            "w": 0.1,
                            "x": 0.1,
                            "y": 0.1
                        }
                    }
                },
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$projectTemplate" got invalid value 0.1 at "projectTemplate.pages.layouts.x"; Int cannot represent non-integer value: 0.1')
        expect(errorMessage[1].message).toBe('Variable "$projectTemplate" got invalid value 0.1 at "projectTemplate.pages.layouts.y"; Int cannot represent non-integer value: 0.1')
        expect(errorMessage[2].message).toBe('Variable "$projectTemplate" got invalid value 0.1 at "projectTemplate.pages.layouts.w"; Int cannot represent non-integer value: 0.1')
        expect(errorMessage[3].message).toBe('Variable "$projectTemplate" got invalid value 0.1 at "projectTemplate.pages.layouts.h"; Int cannot represent non-integer value: 0.1')
        expect(errorMessage[4].message).toBe('Variable "$projectTemplate" got invalid value 0.1 at "projectTemplate.pages.layouts.maxW"; Int cannot represent non-integer value: 0.1')
        expect(errorMessage[5].message).toBe('Variable "$projectTemplate" got invalid value 0.1 at "projectTemplate.pages.layouts.maxH"; Int cannot represent non-integer value: 0.1')
        expect(errorMessage[6].message).toBe('Variable "$projectTemplate" got invalid value 0.1 at "projectTemplate.pages.layouts.minW"; Int cannot represent non-integer value: 0.1')
        expect(errorMessage[7].message).toBe('Variable "$projectTemplate" got invalid value 0.1 at "projectTemplate.pages.layouts.minH"; Int cannot represent non-integer value: 0.1')
        expect(errorMessage[8].message).toBe('Variable "$projectTemplate" got invalid value 0.1 at "projectTemplate.pages.layouts.resizeHandles"; Enum "WidgetLayoutResizeHandleType" cannot represent non-string value: 0.1.')

        // Test For Null Values in Report Widget
        response = await axios.post(ENDPOINT, {
            query: project_template_data.CREATE_PROJECT_TEMPLATE,
            variables: {
                "projectTemplates": {
                    "reportWidgets": {
                        "widgetGID": null,
                        "key": null,
                        "layoutItemProperties": {
                            "justifyContent": null,
                            "alignItems": null,
                            "color": null,
                            "bgcolor": null
                        },
                        "properties": null
                    }
                }
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Variable \"$projectTemplate\" of required type \"ProjectTemplateInput!\" was not provided.")

        // Test For Integer Values in Report Widget
        response = await axios.post(ENDPOINT, {
            query: project_template_data.CREATE_PROJECT_TEMPLATE,
            variables: {
                "projectTemplates": {
                    "reportWidgets": {
                        "widgetGID": 0,
                        "key": 0,
                        "layoutItemProperties": {
                            "justifyContent": 0,
                            "alignItems": 0,
                            "color": 0,
                            "bgcolor": 0
                        },
                        "properties": 0
                    }
                }
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Variable \"$projectTemplate\" of required type \"ProjectTemplateInput!\" was not provided.")

    })

    test('Create Project Template with Empty Pages', async () => {

        // Test For Null Values in Layouts
        let response = await axios.post(ENDPOINT, {
            query: project_template_data.CREATE_PROJECT_TEMPLATE,
            variables: {
                "projectTemplate": {
                    "pages": [
                        {
                            "layouts": {
                                "w": "",
                                "h": "",
                                "x": "",
                                "y": "",
                                "i": "",
                                "minW": "",
                                "maxW": "",
                                "minH": "",
                                "maxH": "",
                                "static": ""
                            },
                            "reportWidgets": {
                                "widgetGID": "",
                                "key": "",
                                "layoutItemProperties": {
                                    "justifyContent": "",
                                    "alignItems": "",
                                    "color": "",
                                    "bgcolor": ""
                                },
                                "properties": ""
                            }
                        }
                    ],
                }
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$projectTemplate" got invalid value "" at "projectTemplate.pages[0].layouts.i"; Expected type "i_String_NotNull_minLength_1_maxLength_128". Must be at least 1 characters in length')
        expect(errorMessage[1].message).toBe('Variable "$projectTemplate" got invalid value "" at "projectTemplate.pages[0].layouts.x"; Int cannot represent non-integer value: ""')
        expect(errorMessage[2].message).toBe('Variable "$projectTemplate" got invalid value "" at "projectTemplate.pages[0].layouts.y"; Int cannot represent non-integer value: ""')
        expect(errorMessage[3].message).toBe('Variable "$projectTemplate" got invalid value "" at "projectTemplate.pages[0].layouts.w"; Int cannot represent non-integer value: ""')
        expect(errorMessage[4].message).toBe('Variable "$projectTemplate" got invalid value "" at "projectTemplate.pages[0].layouts.h"; Int cannot represent non-integer value: ""')
        expect(errorMessage[5].message).toBe('Variable "$projectTemplate" got invalid value "" at "projectTemplate.pages[0].layouts.maxW"; Int cannot represent non-integer value: ""')
        expect(errorMessage[6].message).toBe('Variable "$projectTemplate" got invalid value "" at "projectTemplate.pages[0].layouts.maxH"; Int cannot represent non-integer value: ""')
        expect(errorMessage[7].message).toBe('Variable "$projectTemplate" got invalid value "" at "projectTemplate.pages[0].layouts.minW"; Int cannot represent non-integer value: ""')
        expect(errorMessage[8].message).toBe('Variable "$projectTemplate" got invalid value "" at "projectTemplate.pages[0].layouts.minH"; Int cannot represent non-integer value: ""')
        expect(errorMessage[9].message).toBe('Variable "$projectTemplate" got invalid value "" at "projectTemplate.pages[0].layouts.static"; Boolean cannot represent a non boolean value: ""')
        expect(errorMessage[10].message).toBe('Variable "$projectTemplate" got invalid value "" at "projectTemplate.pages[0].reportWidgets.widgetGID"; Expected type "widgetGID_String_NotNull_minLength_1_maxLength_128". Must be at least 1 characters in length')
    })
})

test.describe('Clone Project Template', () => {

    let projectTemplateId
    let projectTemplate

    test.beforeAll(async () => {

        const response = await axios.post(ENDPOINT, {
            query: project_template_data.CREATE_PROJECT_TEMPLATE,
            variables: project_template_data.PROJECT_TEMPLATE_VARIABLES
        })

        projectTemplate = response.data.data.createProjectTemplate

        projectTemplateId = projectTemplate.id
    })

    test('Clone Project Template by Project Template ID', async () => {

        // Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_template_data.CLONE_PROJECT_TEMPLATE,
            variables: {
                "cloneProjectTemplateId": projectTemplateId
            }
        })

        // Get Project Template ID of Cloned Project Template
        const clonedProjectTemplateId = response.data.data.cloneProjectTemplate.id

        // Get Cloned Project Template Info directly from MongoDB
        const query = { _id: ObjectId(clonedProjectTemplateId) };
        const clonedProjectTemplateObj = await projects.findOne(query)

        // Assert Response
        expect(clonedProjectTemplateObj.projectInfo.name).toBe("Copy of " + projectTemplate.projectInfo.name)
        expect(clonedProjectTemplateObj.projectInfo.company).toBe(projectTemplate.projectInfo.company)
    })

    test('Clone Project Template by Invalid Project Template ID', async () => {

        // Clone Project Template with Non-existing Project Template ID
        let response = await axios.post(ENDPOINT, {
            query: project_template_data.CLONE_PROJECT_TEMPLATE,
            variables: {
                "cloneProjectTemplateId": "0000"
            }
        })

        let errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$cloneProjectTemplateId" got invalid value "0000"; Value is not a valid mongodb object id of form: 0000')

        // Clone Project Template with Null Project Template ID
        response = await axios.post(ENDPOINT, {
            query: project_template_data.CLONE_PROJECT_TEMPLATE,
            variables: {
                "cloneProjectTemplateId": null
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$cloneProjectTemplateId" of non-null type "ObjectID!" must not be null.')

        // Clone Project Template with Integer Project Template ID
        response = await axios.post(ENDPOINT, {
            query: project_template_data.CLONE_PROJECT_TEMPLATE,
            variables: {
                "cloneProjectTemplateId": 0
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$cloneProjectTemplateId" got invalid value 0; Value is not a valid mongodb object id of form: 0')

    })

    test('Clone Project Template by Empty Project Template ID', async () => {

        // Clone Project Template with Non-existing Project Template ID
        let response = await axios.post(ENDPOINT, {
            query: project_template_data.CLONE_PROJECT_TEMPLATE,
            variables: {
                "cloneProjectTemplateId": ""
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$cloneProjectTemplateId" got invalid value ""; Value is not a valid mongodb object id of form: ')

    })

})

test.describe('Delete Project Template', () => {

    let projectTemplateId
    let projectTemplate

    test.beforeAll(async () => {

        const response = await axios.post(ENDPOINT, {
            query: project_template_data.CREATE_PROJECT_TEMPLATE,
            variables: project_template_data.PROJECT_TEMPLATE_VARIABLES
        })

        projectTemplate = response.data.data.createProjectTemplate

        projectTemplateId = projectTemplate.id
    })

    test('Delete Project Template by Project Template ID', async () => {

        // Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_template_data.DELETE_PROJECT_TEMPLATE,
            variables: {
                "deleteProjectTemplateId": projectTemplateId
            }
        })

        const deleteProjectTemplateId = response.data.data.deleteProjectTemplate

        // Get Cloned Project Template Info directly from MongoDB
        const query = { _id: ObjectId(deleteProjectTemplateId) };
        const deletedProjectTemplateObj = await projects.findOne(query)

        // Assert Delete Project Template
        expect(deletedProjectTemplateObj).toBeNull()
    })

    test('Delete Project Template by Invalid Project Template ID', async () => {

        // Delete Project Template with Non-existing Project Template ID
        let response = await axios.post(ENDPOINT, {
            query: project_template_data.DELETE_PROJECT_TEMPLATE,
            variables: {
                "deleteProjectTemplateId": "0000"
            }
        })

        let errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable \"$deleteProjectTemplateId\" got invalid value \"0000\"; Value is not a valid mongodb object id of form: 0000')

        // Delete Project Template with Null Project Template ID
        response = await axios.post(ENDPOINT, {
            query: project_template_data.DELETE_PROJECT_TEMPLATE,
            variables: {
                "deleteProjectTemplateId": null
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$deleteProjectTemplateId" of non-null type "ObjectID!" must not be null.')

        // Delete Project Template with Integer Project Template ID
        response = await axios.post(ENDPOINT, {
            query: project_template_data.DELETE_PROJECT_TEMPLATE,
            variables: {
                "deleteProjectTemplateId": 0
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$deleteProjectTemplateId" got invalid value 0; Value is not a valid mongodb object id of form: 0')

    })

    test('Delete Project Template by Empty Project Template ID', async () => {

        // Delete Project Template with Non-existing Project Template ID
        let response = await axios.post(ENDPOINT, {
            query: project_template_data.DELETE_PROJECT_TEMPLATE,
            variables: {
                "deleteProjectTemplateId": ""
            }
        })

        let errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$deleteProjectTemplateId" got invalid value ""; Value is not a valid mongodb object id of form: ')

    })
})

test.describe('Update Project Template', () => {

    let projectTemplateId
    let projectTemplate

    test.beforeAll(async () => {

        const response = await axios.post(ENDPOINT, {
            query: project_template_data.CREATE_PROJECT_TEMPLATE,
            variables: project_template_data.PROJECT_TEMPLATE_VARIABLES
        })

        projectTemplate = response.data.data.createProjectTemplate

        projectTemplateId = projectTemplate.id

    })

    test('Update Project Template by Project Template ID', async () => {

        const data = "Template 10"

        // Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_template_data.UPDATE_PROJECT_TEMPLATE,
            variables: {
                "updateProjectTemplateId": projectTemplateId,
                "projectTemplate": {
                    "fromPlugin": true,
                    "projectInfo": {
                        "name": data,
                        "description": data,
                    }
                }
            }
        })

        // Get Project Template ID of Updated Project Template
        const updatedProjectTemplateId = response.data.data.updateProjectTemplate.id

        // Get Updated Project Template Info directly from MongoDB
        const query = { _id: ObjectId(updatedProjectTemplateId) }
        const updatedProjectTemplateObj = await projects.findOne(query)

        // Assert Response
        expect(updatedProjectTemplateObj.projectInfo.name).toBe(data)
        expect(updatedProjectTemplateObj.projectInfo.description).toBe(data)

    })

    test('Update Project Template with Invalid Project Template ID', async () => {

        const data = "Template 19"

        // Test for Null Project Template ID
        let response = await axios.post(ENDPOINT, {
            query: project_template_data.UPDATE_PROJECT_TEMPLATE,
            variables: {
                "updateProjectTemplateId": null,
                "projectTemplate": {
                    "projectInfo": {
                        "name": data,
                        "description": data,
                    }
                }
            }
        })

        let errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Variable \"$updateProjectTemplateId\" of non-null type \"ObjectID!\" must not be null.")

        // Get Project Template Info directly from MongoDB
        let query = { _id: ObjectId(projectTemplateId) }
        let updatedProjectTemplateObj = await projects.findOne(query)

        // Assert Response
        expect(updatedProjectTemplateObj.projectInfo.name).not.toBe(data)
        expect(updatedProjectTemplateObj.projectInfo.description).not.toBe(data)

        // Test for Integer Project Template ID
        response = await axios.post(ENDPOINT, {
            query: project_template_data.UPDATE_PROJECT_TEMPLATE,
            variables: {
                "updateProjectTemplateId": 0,
                "projectTemplate": {
                    "projectInfo": {
                        "name": data,
                        "description": data,
                    }
                }
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Variable \"$updateProjectTemplateId\" got invalid value 0; Value is not a valid mongodb object id of form: 0")

        // Get Project Template Info directly from MongoDB
        query = { _id: ObjectId(projectTemplateId) }
        updatedProjectTemplateObj = await projects.findOne(query)

        // Assert Response
        expect(updatedProjectTemplateObj.projectInfo.name).not.toBe(data)
        expect(updatedProjectTemplateObj.projectInfo.description).not.toBe(data)

        // Test For Non-existing Project Template ID
        response = await axios.post(ENDPOINT, {
            query: project_template_data.UPDATE_PROJECT_TEMPLATE,
            variables: {
                "updateProjectTemplateId": "100",
                "projectTemplate": {
                    "projectInfo": {
                        "name": data,
                        "description": data,
                    }
                }
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Variable \"$updateProjectTemplateId\" got invalid value \"100\"; Value is not a valid mongodb object id of form: 100")

        // Get Project Template Info directly from MongoDB
        query = { _id: ObjectId(projectTemplateId) }
        updatedProjectTemplateObj = await projects.findOne(query)

        // Assert Response
        expect(updatedProjectTemplateObj.projectInfo.name).not.toBe(data)
        expect(updatedProjectTemplateObj.projectInfo.description).not.toBe(data)

    })

    test('Update Project Template with Empty Project Template ID', async () => {

        const data = "Template 45"

        // Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_template_data.UPDATE_PROJECT_TEMPLATE,
            variables: {
                "updateProjectTemplateId": "",
                "projectTemplate": {
                    "projectInfo": {
                        "name": data,
                        "description": data,
                    }
                }
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Variable \"$updateProjectTemplateId\" got invalid value \"\"; Value is not a valid mongodb object id of form: ")

        // Get Project Template Info directly from MongoDB
        const query = { _id: ObjectId(projectTemplateId) }
        const updatedProjectTemplateObj = await projects.findOne(query)

        // Assert Response
        expect(updatedProjectTemplateObj.projectInfo.name).not.toBe(data)
        expect(updatedProjectTemplateObj.projectInfo.description).not.toBe(data)

    })

    test('Update Project Template with Valid Inputs', async () => {

        const data = {
            "name": "Template 10",
            "description": "Template 6",
            "globalVarsKey": "Time",
            "value": "30",
            "widgetGID": "aiverify.tests:test3",
            "widgetKey": "1675757519254"
        }

        // Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_template_data.UPDATE_PROJECT_TEMPLATE,
            variables: {
                "updateProjectTemplateId": projectTemplateId,
                "projectTemplate":
                {
                    "projectInfo": {
                        "name": data.name,
                        "description": data.description,
                        "reportTitle": project_template_data.PROJECT_TEMPLATE_VARIABLES.projectTemplate.projectInfo.reportTitle,
                        "company": project_template_data.PROJECT_TEMPLATE_VARIABLES.projectTemplate.projectInfo.company
                    },
                    "globalVars": {
                        "key": data.globalVarsKey,
                        "value": data.value
                    },
                    "pages": {
                        "reportWidgets": [{
                            "widgetGID": data.widgetGID,
                            "key": data.widgetKey
                        }]
                    }

                }
            }
        })

        // console.log(response.data.data.updateProjectTemplate)

        // Get Project Template ID of Updated Project Template
        const updatedProjectTemplateId = response.data.data.updateProjectTemplate.id

        // Get Updated Project Template Info directly from MongoDB
        const query = { _id: ObjectId(updatedProjectTemplateId) }
        const updatedProjectTemplateObj = await projects.findOne(query)

        // Assert Response
        expect(updatedProjectTemplateObj.projectInfo.name).toBe(data.name)
        expect(updatedProjectTemplateObj.projectInfo.description).toBe(data.description)

        expect(updatedProjectTemplateObj.globalVars[0].key).toBe(data.globalVarsKey)
        expect(updatedProjectTemplateObj.globalVars[0].value).toBe(data.value)

        expect(updatedProjectTemplateObj.pages[0].reportWidgets[0].widgetGID).toBe(data.widgetGID)
        expect(updatedProjectTemplateObj.pages[0].reportWidgets[0].key).toBe(data.widgetKey)

    })

    test('Update Project Template with Invalid Project Information', async () => {

        // Test For Null Project Information
        let response = await axios.post(ENDPOINT, {
            query: project_template_data.UPDATE_PROJECT_TEMPLATE,
            variables: {
                "updateProjectTemplateId": projectTemplateId,
                "variables": {
                    "updateProjectTemplateId": projectTemplateId,
                    "projectTemplate": {
                        "projectInfo": {
                            "name": null,
                            "description": null,
                        }
                    }
                }
            }
        })

        let errorMessage = response.data.errors

        expect(errorMessage[0].message).toBe("Variable \"$projectTemplate\" of required type \"ProjectTemplateInput!\" was not provided.")

        // Get Project Template Info directly from MongoDB
        let query = { _id: ObjectId(projectTemplateId) }
        let updatedProjectTemplateObj = await projects.findOne(query)

        // Assert Response
        expect(updatedProjectTemplateObj.projectInfo.name).not.toBeNull
        expect(updatedProjectTemplateObj.projectInfo.description).not.toBeNull

        // Test For Integer Project Information
        response = await axios.post(ENDPOINT, {
            query: project_template_data.UPDATE_PROJECT_TEMPLATE,
            variables: {
                "updateProjectTemplateId": projectTemplateId,
                "variables": {
                    "updateProjectTemplateId": projectTemplateId,
                    "projectTemplate": {
                        "projectInfo": {
                            "name": 0,
                            "description": 0,
                        }
                    }
                }
            }
        })

        errorMessage = response.data.errors

        expect(errorMessage[0].message).toBe("Variable \"$projectTemplate\" of required type \"ProjectTemplateInput!\" was not provided.")

        // Get Project Template Info directly from MongoDB
        query = { _id: ObjectId(projectTemplateId) }
        updatedProjectTemplateObj = await projects.findOne(query)

        // Assert Response
        expect(updatedProjectTemplateObj.projectInfo.name).not.toBe(0)
        expect(updatedProjectTemplateObj.projectInfo.description).not.toBe(0)

    })

    test('Update Project Template with Empty Project Information', async () => {

        const data = ""

        // Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_template_data.UPDATE_PROJECT_TEMPLATE,
            variables: {
                "updateProjectTemplateId": projectTemplateId,
                "projectTemplate": {
                    "projectInfo": {
                        "name": data,
                        "description": data,
                    }
                }
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Variable \"$projectTemplate\" got invalid value \"\" at \"projectTemplate.projectInfo.name\"; Expected type \"name_String_minLength_1_maxLength_128\". Must be at least 1 characters in length")

        // Get Project Template Info directly from MongoDB
        const query = { _id: ObjectId(projectTemplateId) }
        const updatedProjectTemplateObj = await projects.findOne(query)

        // Assert Response
        expect(updatedProjectTemplateObj.projectInfo.name).not.toBe(data)
        expect(updatedProjectTemplateObj.projectInfo.description).not.toBe(data)

    })

    test('Update Project Template with Invalid Global Variables', async () => {

        // Test For Null Global Variables
        let response = await axios.post(ENDPOINT, {
            query: project_template_data.UPDATE_PROJECT_TEMPLATE,
            variables: {
                "updateProjectTemplateId": projectTemplateId,
                "projectTemplate": {
                    "globalVars": [
                        {
                            "key": null,
                            "value": null
                        }
                    ]
                }
            }
        })

        let errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Variable \"$projectTemplate\" got invalid value null at \"projectTemplate.globalVars[0].key\"; Expected non-nullable type \"key_String_NotNull_minLength_1_maxLength_128!\" not to be null.")
        expect(errorMessage[1].message).toBe("Variable \"$projectTemplate\" got invalid value null at \"projectTemplate.globalVars[0].value\"; Expected non-nullable type \"value_String_NotNull_minLength_1_maxLength_128!\" not to be null.")

        // Get Project Template Info directly from MongoDB
        let query = { _id: ObjectId(projectTemplateId) }
        let updatedProjectTemplateObj = await projects.findOne(query)

        // Assert Response
        expect(updatedProjectTemplateObj.globalVars.key).not.toBeNull
        expect(updatedProjectTemplateObj.globalVars.value).not.toBeNull

        // Test For Integer Global Variables
        response = await axios.post(ENDPOINT, {
            query: project_template_data.UPDATE_PROJECT_TEMPLATE,
            variables: {
                "updateProjectTemplateId": projectTemplateId,
                "projectTemplate": {
                    "globalVars": [
                        {
                            "key": 0,
                            "value": 0
                        }
                    ]
                }
            }
        })

        const projectTemplateInfo = response.data.data.updateProjectTemplate

        // Assert Response
        expect(projectTemplateInfo).toBeTruthy()

    })

    test('Update Project Template with Empty Global Variables', async () => {

        const data = ""

        // Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_template_data.UPDATE_PROJECT_TEMPLATE,
            variables: {
                "updateProjectTemplateId": projectTemplateId,
                "projectTemplate": {
                    "globalVars": [
                        {
                            "key": "",
                            "value": ""
                        }
                    ]
                }
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Variable \"$projectTemplate\" got invalid value \"\" at \"projectTemplate.globalVars[0].key\"; Expected type \"key_String_NotNull_minLength_1_maxLength_128\". Must be at least 1 characters in length")
        expect(errorMessage[1].message).toBe("Variable \"$projectTemplate\" got invalid value \"\" at \"projectTemplate.globalVars[0].value\"; Expected type \"value_String_NotNull_minLength_1_maxLength_128\". Must be at least 1 characters in length")

        // Get Project Template Info directly from MongoDB
        const query = { _id: ObjectId(projectTemplateId) }
        const updatedProjectTemplateObj = await projects.findOne(query)

        // Assert Response
        expect(updatedProjectTemplateObj.globalVars.key).not.toBe(data)
        expect(updatedProjectTemplateObj.globalVars.value).not.toBe(data)

    })

    test('Update Project Template with Invalid Pages', async () => {

        // Test For Null Values in Layouts
        let response = await axios.post(ENDPOINT, {
            query: project_template_data.UPDATE_PROJECT_TEMPLATE,
            variables: {
                "projectTemplate": {
                    "pages": {
                        "layouts": {
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
                        }
                    }
                },
            }
        })

        let errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Variable \"$updateProjectTemplateId\" of required type \"ObjectID!\" was not provided.")

        // Test For Float Values in Layouts
        response = await axios.post(ENDPOINT, {
            query: project_template_data.UPDATE_PROJECT_TEMPLATE,
            variables: {
                "projectTemplate": {
                    "pages": {
                        "layouts": {
                            "w": 0.1,
                            "h": 0.1,
                            "x": 0.1,
                            "y": 0.1,
                            "i": 0.1,
                            "minW": 0.1,
                            "maxW": 0.1,
                            "minH": 0.1,
                            "maxH": 0.1,
                            "moved": 0.1,
                            "static": 0.1
                        }
                    }
                },
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Variable \"$updateProjectTemplateId\" of required type \"ObjectID!\" was not provided.")

        // Test For Null Values in Report Widget
        response = await axios.post(ENDPOINT, {
            query: project_template_data.UPDATE_PROJECT_TEMPLATE,
            variables: {
                "projectTemplates": {
                    "reportWidgets": {
                        "widgetGID": null,
                        "key": null,
                        "layoutItemProperties": {
                            "justifyContent": null,
                            "alignItems": null,
                            "color": null,
                            "bgcolor": null
                        },
                        "properties": null
                    }
                }
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Variable \"$updateProjectTemplateId\" of required type \"ObjectID!\" was not provided.")

        // Test For Integer Values in Report Widget
        response = await axios.post(ENDPOINT, {
            query: project_template_data.UPDATE_PROJECT_TEMPLATE,
            variables: {
                "projectTemplates": {
                    "reportWidgets": {
                        "widgetGID": 0,
                        "key": 0,
                        "layoutItemProperties": {
                            "justifyContent": 0,
                            "alignItems": 0,
                            "color": 0,
                            "bgcolor": 0
                        },
                        "properties": 0
                    }
                }
            }
        })

        errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Variable \"$updateProjectTemplateId\" of required type \"ObjectID!\" was not provided.")

    })

    test('Update Project Template with Empty Pages', async () => {

        const data = ""

        // Send Request
        const response = await axios.post(ENDPOINT, {
            query: project_template_data.UPDATE_PROJECT_TEMPLATE,
            variables: {
                "updateProjectTemplateId": projectTemplateId,
                "projectTemplate": {
                    "pages": [
                        {
                            "layouts": data,
                            "reportWidgets": [
                                {
                                    "widgetGID": data,
                                    "key": data,
                                    "layoutItemProperties": {
                                        "bgcolor": data,
                                        "color": data,
                                        "alignItems": data,
                                        "justifyContent": data
                                    },
                                    "properties": data
                                }
                            ]
                        }
                    ]
                }
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe("Variable \"$projectTemplate\" got invalid value \"\" at \"projectTemplate.pages[0].layouts\"; Expected type \"WidgetLayoutInput\" to be an object.")
        expect(errorMessage[1].message).toBe("Variable \"$projectTemplate\" got invalid value \"\" at \"projectTemplate.pages[0].reportWidgets[0].widgetGID\"; Expected type \"widgetGID_String_NotNull_minLength_1_maxLength_128\". Must be at least 1 characters in length")

        // Get Project Template Info directly from MongoDB
        const query = { _id: ObjectId(projectTemplateId) }
        const updatedProjectTemplateObj = await projects.findOne(query)

        // Assert Response
        expect(updatedProjectTemplateObj.globalVars.key).not.toBe(data)
        expect(updatedProjectTemplateObj.globalVars.value).not.toBe(data)

    })

})