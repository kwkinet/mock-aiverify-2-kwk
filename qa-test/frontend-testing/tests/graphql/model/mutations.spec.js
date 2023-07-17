import { test, expect } from '@playwright/test'
import { MongoClient, ObjectId } from 'mongodb'
import * as model_data from './model-data.js'

import axios from 'axios'
import fs from 'fs'
import FormData from 'form-data'
import { setTimeout } from "timers/promises"

const ENDPOINT = "http://127.0.0.1:3000"

const uri =
    "mongodb://mongodb:mongodb@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.1";
const mongoClient = new MongoClient(uri)
const database = mongoClient.db('aiverify')
const models = database.collection('modelfilemodels')

test.describe.configure({ mode: 'serial' });

test.describe('Update Model', () => {

    let model, modelID

    test.beforeAll(async () => {

        const form_data = new FormData()
        form_data.append('myModelFiles', fs.createReadStream('./fixtures/pickle_scikit_multiclasslr_loan.sav'));

        await axios.post(ENDPOINT + '/api/upload/model', form_data, {
            headers: {
                ...form_data.getHeaders()
            },
            data: form_data,
        })

        await setTimeout(2000)

        const response = await axios.post(ENDPOINT + '/api/graphql', {
            query: model_data.MODELS,
        })

        model = response.data.data.modelFiles[0]
        modelID = model.id

    })

    test('Update Model with Valid Model ID', async () => {

        const response = await axios.post(ENDPOINT + '/api/graphql', {
            query: model_data.UPDATE_MODEL,
            variables: {
                "modelFileId": modelID,
                "modelFile": {
                    "name": "test2",
                    "modelType": "Classification",
                    "status": "Pending",
                    "description": "test2",
                }
            }
        })

        const updateModel = response.data.data.updateModel
        
        // Get Dataset directly from MongoDB
        const query = { _id: ObjectId(modelID) }
        const updateModelObj = await models.findOne(query)

        // Assert Update
        expect(updateModel.name).toBe(updateModelObj.name)
        expect(updateModel.modelType).toBe(updateModelObj.modelType)
        expect(updateModel.description).toBe(updateModelObj.description)
        expect(updateModel.status).toBe(updateModelObj.status)

    })

    test('Update Model with Invalid Model ID', async () => {

        // Null Model ID
        const response = await axios.post(ENDPOINT + '/api/graphql', {
            query: model_data.UPDATE_MODEL,
            variables: {
                "modelFileId": null,
                "modelFile": {
                    "name": "test2",
                    "modelType": "Classification",
                    "status": "true",
                    "description": "test2",
                }
            }
        })

        const errorMessage = response.data.errors

        // Assert Response
        expect(errorMessage[0].message).toBe('Variable "$modelFileId" of non-null type "ObjectID!" must not be null.')
        expect(errorMessage[1].message).toBe('Variable "$modelFile" got invalid value "true" at "modelFile.status"; Value "true" does not exist in "ModelFileStatusType" enum.')

    })

    test('Update Model with Empty Model ID', async () => {

        const response = await axios.post(ENDPOINT + '/api/graphql', {
            query: model_data.UPDATE_MODEL,
            variables: {
                "modelFileId": "",
                "modelFile": {
                    "name": "test2",
                    "modelType": "Classification",
                    "status": "Pending",
                    "description": "test2",
                }
            }
        })

        const errorMessage = response.data.errors[0]

        // Assert Response
        expect(errorMessage.message).toBe('Variable "$modelFileId" got invalid value ""; Value is not a valid mongodb object id of form: ')

    })

    test('Update Model with Invalid Inputs', async () => {

        // Null Values
        let response = await axios.post(ENDPOINT + '/api/graphql', {
            query: model_data.UPDATE_MODEL,
            variables: {
                "modelFileId": modelID,
                "modelFile": {
                    "name": null,
                    "modelType": null,
                    "status": null,
                    "description": null,
                }
            }
        })

        let updateModel = response.data.data.updateModel

        // Get Dataset directly from MongoDB
        let query = { _id: ObjectId(modelID) }
        let updateModelObj = await models.findOne(query)

        // Assert Update
        expect(updateModel.name).toBe(updateModelObj.name)
        expect(updateModel.modelType).toBe(updateModelObj.modelType)
        expect(updateModel.description).toBe(updateModelObj.description)
        expect(updateModel.status).toBe(updateModelObj.status)

        // Invalid Datatype
        response = await axios.post(ENDPOINT + '/api/graphql', {
            query: model_data.UPDATE_MODEL,
            variables: {
                "modelFileId": modelID,
                "modelFile": {
                    "name": true,
                    "modelType": true,
                    "status": true,
                    "description": true,
                }
            }
        })

        let errorMessage = response.data.errors
        
        // Assert Errors
        expect(errorMessage[0].message).toBe('Variable "$modelFile" got invalid value true at "modelFile.status"; Enum "ModelFileStatusType" cannot represent non-string value: true.')
        expect(errorMessage[1].message).toBe('Variable "$modelFile" got invalid value true at "modelFile.modelType"; Enum "ModelType" cannot represent non-string value: true.')
  
    })

    test('Update Model with Empty Inputs', async () => {

        const response = await axios.post(ENDPOINT + '/api/graphql', {
            query: model_data.UPDATE_MODEL,
            variables: {
                "modelFileId": modelID,
                "modelFile": {
                    "name": "",
                    "modelType": "",
                    "status": "",
                    "description": "",
                }
            }
        })

        const errorMessage = response.data.errors

        // Assert Errors
        expect(errorMessage[0].message).toBe('Variable "$modelFile" got invalid value "" at "modelFile.status"; Value "" does not exist in "ModelFileStatusType" enum.')
        expect(errorMessage[1].message).toBe('Variable "$modelFile" got invalid value "" at "modelFile.modelType"; Value "" does not exist in "ModelType" enum.')

    })

})

test.describe('Delete Model', () => {

    let modelID

    test.beforeAll(async () => {

        const form_data = new FormData()
        form_data.append('myModelFiles', fs.createReadStream('./fixtures/pickle_scikit_multiclasslr_loan.sav'));

        await axios.post(ENDPOINT + '/api/upload/model', form_data, {
            headers: {
                ...form_data.getHeaders()
            },
            data: form_data,
        })

        await setTimeout(2000)

    })

    test('Delete Model With Valid Model ID', async () => {

        await axios.post(ENDPOINT + '/api/graphql', {
            query: model_data.DELETE_MODEL,
            variables: {
                "deleteModelFileId": modelID
            }
        })

        // Get Dataset directly from MongoDB
        const query = { _id: ObjectId(modelID) }
        const modelObj = await models.findOne(query)

        expect(modelObj).toBeNull()

    })

    test('Delete Model with Invalid Model ID', async () => {

        // Null Model ID
        let response = await axios.post(ENDPOINT + '/api/graphql', {
            query: model_data.DELETE_MODEL,
            variables: {
                "deleteModelFileId": null
            }
        })

        let errorMessage = response.data.errors[0].message
        expect(errorMessage).toBe('Variable "$deleteModelFileId" of non-null type "ObjectID!" must not be null.')

        // Non-Existing Dataset ID
        response = await axios.post(ENDPOINT + '/api/graphql', {
            query: model_data.DELETE_MODEL,
            variables: {
                "deleteModelFileId": modelID
            }
        })

        errorMessage = response.data.errors[0].message
        expect(errorMessage).toBe('Variable \"$deleteModelFileId\" of required type \"ObjectID!\" was not provided.')

    })

    test('Delete Dataset with Empty Dataset ID', async () => {

        const response = await axios.post(ENDPOINT + '/api/graphql', {
            query: model_data.DELETE_MODEL,
            variables: {
                "deleteModelFileId": ""
            }
        })

        const errorMessage = response.data.errors[0].message
        expect(errorMessage).toBe('Variable \"$deleteModelFileId\" got invalid value \"\"; Value is not a valid mongodb object id of form: ')

    })

})