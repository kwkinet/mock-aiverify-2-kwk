import { test, expect } from '@playwright/test'
import { MongoClient, ObjectId } from 'mongodb'
import * as dataset_data from './dataset-data.js'

import axios from 'axios'
import fs from 'fs'
import FormData from 'form-data'
import { setTimeout } from "timers/promises"

const uri =
    "mongodb://mongodb:mongodb@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.1";
const mongoClient = new MongoClient(uri)
const database = mongoClient.db('aiverify')
const datasets = database.collection('datasetmodels')

const ENDPOINT = "http://127.0.0.1:3000"

test.describe.configure({ mode: 'serial' });

test.describe('Update Dataset', () => {

    let dataset, datasetID

    test.beforeAll(async () => {

        const form_data = new FormData()
        form_data.append('myFiles', fs.createReadStream('./fixtures/pickle_pandas_tabular_loan_testing.sav'));

        await axios.post(ENDPOINT + '/api/upload/data', form_data, {
            headers: {
                ...form_data.getHeaders()
            },
            data: form_data,
        })

        await setTimeout(2000);

        const response = await axios.post(ENDPOINT + "/api/graphql", {
            query: dataset_data.DATASETS,
        })

        dataset = response.data.data.datasets[0]
        datasetID = dataset.id
    })

    test('Update Dataset with Valid Dataset ID', async () => {
        const response = await axios.post(ENDPOINT + "/api/graphql", {
            query: dataset_data.UPDATE_DATASET,
            variables: {
                "datasetId": datasetID,
                "dataset": {
                    "name": "test2",
                    "description": "test2",
                    "status": "Pending"
                }
            }
        })

        const updateDataset = response.data.data.updateDataset

        // Get Dataset directly from MongoDB
        const query = { _id: ObjectId(datasetID) }
        const updateDatasetObj = await datasets.findOne(query)

        // Assert Update
        expect(updateDataset.name).toBe(updateDatasetObj.name)
        expect(updateDataset.description).toBe(updateDatasetObj.description)
        expect(updateDataset.filename).toBe(updateDatasetObj.filename)
        expect(updateDataset.filename).not.toBe('test')

    })

    test('Update Dataset with Invalid Dataset ID', async () => {

        // Null Dataset ID
        let response = await axios.post(ENDPOINT + "/api/graphql", {
            query: dataset_data.UPDATE_DATASET,
            variables: {
                "datasetId": null,
                "dataset": {
                    "filename": "test2",
                    "name": "test2",
                    "description": "test2"
                }
            }
        })

        let errorMessage = response.data.errors[0].message

        // Assert Response
        expect(errorMessage).toBe('Variable "$datasetId" of non-null type "ObjectID!" must not be null.')

        // Non-Existing Dataset ID
        response = await axios.post(ENDPOINT + "/api/graphql", {
            query: dataset_data.UPDATE_DATASET,
            variables: {
                "datasetId": "3R&",
                "dataset": {
                    "filename": "test2",
                    "name": "test2",
                    "description": "test2"
                }
            }
        })

        errorMessage = response.data.errors[0].message

        // Assert Response
        expect(errorMessage).toBe('Variable "$datasetId" got invalid value "3R&"; Value is not a valid mongodb object id of form: 3R&')

    })

    test('Update Dataset with Empty Dataset ID', async () => {

        const response = await axios.post(ENDPOINT + "/api/graphql", {
            query: dataset_data.UPDATE_DATASET,
            variables: {
                "datasetId": "",
                "dataset": {
                    "filename": "test2",
                    "name": "test2",
                    "description": "test2"
                }
            }
        })

        const errorMessage = response.data.errors[0].message
        
        // Assert Response
        expect(errorMessage).toBe('Variable "$datasetId" got invalid value ""; Value is not a valid mongodb object id of form: ')

    })

    test.afterAll(async () => {

        await axios.post(ENDPOINT + "/api/graphql", {
            query: dataset_data.DELETE_DATASET,
            variables: {
                "deleteDatasetId": datasetID
            }
        })

    })
})

test.describe('Delete Dataset', () => {

    let dataset, datasetID

    test.beforeAll(async () => {

        const form_data = new FormData()
        form_data.append('myFiles', fs.createReadStream('./fixtures/pickle_pandas_tabular_loan_testing.sav'));

        await axios.post(ENDPOINT + '/api/upload/data', form_data, {
            headers: {
                ...form_data.getHeaders()
            },
            data: form_data,
        })

        await setTimeout(3000);

        const response = await axios.post(ENDPOINT + "/api/graphql", {
            query: dataset_data.DATASETS,
        })

        dataset = response.data.data.datasets[0]
        datasetID = dataset.id

    })

    test('Delete Dataset With Valid Dataset ID', async () => {

        await axios.post(ENDPOINT + "/api/graphql", {
            query: dataset_data.DELETE_DATASET,
            variables: {
                "deleteDatasetId": datasetID
            }
        })

        // Get Dataset directly from MongoDB
        const query = { _id: ObjectId(datasetID) }
        const datasetObj = await datasets.findOne(query)

        expect(datasetObj).toBeNull()

    })

    test('Delete Dataset with Invalid Dataset ID', async () => {

        // Null Dataset ID
        let response = await axios.post(ENDPOINT + "/api/graphql", {
            query: dataset_data.DELETE_DATASET,
            variables: {
                "deleteDatasetId": null
            }
        })

        let errorMessage = response.data.errors[0].message
        expect(errorMessage).toBe('Variable \"$deleteDatasetId\" of non-null type \"ObjectID!\" must not be null.')

        // Non-Existing Dataset ID
        response = await axios.post(ENDPOINT + "/api/graphql", {
            query: dataset_data.DELETE_DATASET,
            variables: {
                "deleteDatasetId": datasetID
            }
        })

        errorMessage = response.data.errors[0].message
        expect.soft(errorMessage).toBe('Unexpected error value: \"Invalid Dataset ID\"')

    })

    test('Delete Dataset with Empty Dataset ID', async () => {

        const response = await axios.post(ENDPOINT + "/api/graphql", {
            query: dataset_data.DELETE_DATASET,
            variables: {
                "deleteDatasetId": ""
            }
        })

        const errorMessage = response.data.errors[0].message
        expect(errorMessage).toBe('Variable \"$deleteDatasetId\" got invalid value \"\"; Value is not a valid mongodb object id of form: ')

    })

})