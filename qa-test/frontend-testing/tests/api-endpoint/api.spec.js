import { test, expect } from '@playwright/test'
import { MongoClient, ObjectId } from 'mongodb'
import * as api_data from './api-data.js'

import axios from 'axios'
import qs from 'querystring'
import fs from 'fs'
import FormData from 'form-data'
import { setTimeout } from "timers/promises"

const uri =
    "mongodb://mongodb:mongodb@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.1";
const mongoClient = new MongoClient(uri)
const database = mongoClient.db('aiverify')
const models = database.collection('modelfilemodels')
const datasets = database.collection('datasetmodels')

const ENDPOINT = "http://127.0.0.1:3000"

const baseDir = process.env.BASEDIR ?? "/app/portal"

test.describe.configure({ mode: 'serial' });

test.describe('Get Report', () => {

    let project, projectID

    test.beforeAll(async () => {

        // Send Request
        const response = await axios.post(ENDPOINT + "/api/graphql", {
            query: api_data.CREATE_PROJECT,
            variables: api_data.PROJECT_VARIABLES
        })

        project = response.data.data.createProject
        projectID = project.id

    })

    test('Get Non-Generated Report with Valid Project ID', async () => {

        const response = await axios.get(ENDPOINT + "/api/report/" + projectID, {
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(400)
    })

    test.skip('Get Generated Report with Valid Project ID', async () => {

        let response = await axios.post(ENDPOINT + "/api/graphql", {
            query: api_data.GENERATE_REPORT_TO_GENERATE_REPORT_STATUS,
            variables: {
                "projectId": projectID,
                "algorithms": "aiverify.stock.algorithms.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
                "modelAndDatasets": {
                    "modelFileName": baseDir + "/uploads/model/pickle_scikit_multiclasslr_loan_2.sav",
                    "groundTruthColumn": "Interest_Rate",
                    "groundTruthDatasetFileName": baseDir + "/uploads/data/pickle_pandas_tabular_loan_testing_3.sav",
                   // "modelFileName": baseDir + "/uploads/model/pickle_scikit_multiclasslr_loan_2.sav",
                    "modelType": "Classification",
                    "testDatasetFileName": baseDir + "/uploads/data/pickle_pandas_tabular_loan_testing_1.sav"
                }
            }
        })

        response = await axios.get(ENDPOINT + "/api/report/" + projectID, {
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        // Assert Response
        expect.soft(response.status).toBe(200)

    })

    test('Get Generated Report with Invalid Project ID', async () => {

        const projectID = "6416da997de481f468cd535"

        const response = await axios.get(ENDPOINT + "/api/report/" + projectID, {
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(400)
    })

    test('Get Generated Report with Empty Project ID', async () => {

        const response = await axios.get(ENDPOINT + "/api/report/ ", {
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(404)
    })

})

test.describe('Export As Plugin', () => {

    let template, templateID

    test.beforeAll(async () => {

        const response = await axios.post(ENDPOINT + "/api/graphql", {
            query: api_data.CREATE_PROJECT_TEMPLATE,
            variables: api_data.PROJECT_TEMPLATE_VARIABLES
        })

        template = response.data.data.createProjectTemplate
        templateID = template.id

    })

    test('Export As Plugin with Valid Inputs', async () => {

        const data = qs.stringify({
            'templateId': templateID,
            'pluginGID': 'cd743373-b5bb-4b6c-98e3-2a36a7d5f6b5',
            'templateCID': 'project-0-5598544214335246'
        });

        const response = await axios.post(ENDPOINT + '/api/template/export', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(200)

    })

    test('Export As Plugin with Invalid Template ID', async () => {

        // Non-existing Template ID
        let data = qs.stringify({
            'templateId': '123',
            'pluginGID': 'cd743373-b5bb-4b6c-98e3-2a36a7d5f6b5',
            'templateCID': 'project-0-5598544214335246'
        });

        let response = await axios.post(ENDPOINT + '/api/template/export', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(500)

        // NULL Template ID
        data = qs.stringify({
            'templateId': null,
            'pluginGID': 'cd743373-b5bb-4b6c-98e3-2a36a7d5f6b5',
            'templateCID': 'project-0-5598544214335246'
        });

        response = await axios.post(ENDPOINT + '/api/template/export', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(400)

        // Invalid Template ID Data Type
        data = qs.stringify({
            'templateId': true,
            'pluginGID': 'cd743373-b5bb-4b6c-98e3-2a36a7d5f6b5',
            'templateCID': 'project-0-5598544214335246'
        });

        response = await axios.post(ENDPOINT + '/api/template/export', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(500)

    })

    test('Export As Plugin with Empty Template ID', async () => {

        const data = qs.stringify({
            'templateId': '',
            'pluginGID': 'cd743373-b5bb-4b6c-98e3-2a36a7d5f6b5',
            'templateCID': 'project-0-5598544214335246'
        });

        const response = await axios.post(ENDPOINT + '/api/template/export', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(400)

    })

    test('Export As Plugin with Invalid Plugin GID', async () => {

        // Non-Existing Plugin GID
        let data = qs.stringify({
            'templateId': templateID,
            'pluginGID': '123',
            'templateCID': 'test-1'
        });

        let response = await axios.post(ENDPOINT + '/api/template/export', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(200)

        // NULL Plugin GID
        data = qs.stringify({
            'templateId': templateID,
            'pluginGID': null,
            'templateCID': 'project-0-5598544214335246'
        });

        response = await axios.post(ENDPOINT + '/api/template/export', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(400)

        // Invalid Plugin GID Data Type
        data = qs.stringify({
            'templateId': templateID,
            'pluginGID': true,
            'templateCID': 'project-10'
        });

        response = await axios.post(ENDPOINT + '/api/template/export', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(200)

    })

    test('Export As Plugin with Empty Plugin GID', async () => {

        const data = qs.stringify({
            'templateId': templateID,
            'pluginGID': '',
            'templateCID': 'project-0-5598544214335246'
        });

        const response = await axios.post(ENDPOINT + '/api/template/export', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(400)

    })

    test('Export As Plugin with Invalid Template CID', async () => {

        // Non-Existing Template CID
        let data = qs.stringify({
            'templateId': templateID,
            'pluginGID': 'cd743373-b5bb-4b6c-98e3-2a36a7d5f6b5',
            'templateCID': '123'
        });

        let response = await axios.post(ENDPOINT + '/api/template/export', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(200)

        // NULL Template CID
        data = qs.stringify({
            'templateId': templateID,
            'pluginGID': 'cd743373-b5bb-4b6c-98e3-2a36a7d5f6b5',
            'templateCID': null
        });

        response = await axios.post(ENDPOINT + '/api/template/export', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(400)

        // Invalid Template CID Data Type
        data = qs.stringify({
            'templateId': templateID,
            'pluginGID': 'cd743373-b5bb-4b6c-98e3-2a36a7d5f6b5',
            'templateCID': true
        });

        response = await axios.post(ENDPOINT + '/api/template/export', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(200)

    })

    test('Export As Plugin with Empty Template CID', async () => {

        const data = qs.stringify({
            'templateId': templateID,
            'pluginGID': 'cd743373-b5bb-4b6c-98e3-2a36a7d5f6b5',
            'templateCID': ''
        });

        const response = await axios.post(ENDPOINT + '/api/template/export', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(400)

    })

})

test.describe('Upload Dataset', () => {

    test('Upload Dataset with Valid Dataset', async () => {

        const form_data = new FormData()
        form_data.append('myFiles', fs.createReadStream('./fixtures/pickle_pandas_tabular_loan_testing.sav'));

        const response = await axios.post(ENDPOINT + '/api/upload/data', form_data, {
            headers: {
                ...form_data.getHeaders()
            },
            data: form_data,
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(201)

    })

    test('Upload Dataset with Invalid Dataset', async () => {

        const form_data = new FormData()

        // TODO Need invalid dataset
        form_data.append('myFiles', fs.createReadStream('./fixtures/pickle_pandas_tabular_loan_testing.sav'));

        const response = await axios.post(ENDPOINT + '/api/upload/data', form_data, {
            headers: {
                ...form_data.getHeaders()
            },
            data: form_data,
        })

        const dataset = response.data[0]
        const datasetID = dataset._id

        // Get Model directly from MongoDB
        const query = { _id: ObjectId(datasetID) }
        const datasetObj = await datasets.findOne(query)

        await setTimeout(1000)

        // FIXME Should Status be 'Pending' if invalid?
        // console.log(datasetObj)

    })

    test('Upload Dataset with Empty Dataset', async () => {

        const form_data = new FormData()

        const response = await axios.post(ENDPOINT + '/api/upload/data', form_data, {
            headers: {
                ...form_data.getHeaders()
            },
            data: form_data,
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(500)

    })

    test('Upload Unsupported File Format Dataset', async () => {

        const form_data = new FormData()
        form_data.append('myFiles', fs.createReadStream('./fixtures/combine_all.sh'));

        const response = await axios.post(ENDPOINT + '/api/upload/data', form_data, {
            headers: {
                ...form_data.getHeaders()
            },
            data: form_data,
        })

        const dataset = response.data[0]
        const datasetID = dataset._id

        // Get Model directly from MongoDB
        const query = { _id: ObjectId(datasetID) }
        const datasetObj = await datasets.findOne(query)

        await setTimeout(1000)

        // FIXME Should Status be 'Pending' if invalid?
        // console.log(datasetObj)

    })
})

test.describe('Upload Model', () => {

    test('Upload Model with Valid Model', async () => {

        const form_data = new FormData()
        form_data.append('myModelFiles', fs.createReadStream('./fixtures/pickle_scikit_multiclasslr_loan.sav'));

        const response = await axios.post(ENDPOINT + '/api/upload/model', form_data, {
            headers: {
                ...form_data.getHeaders()
            },
            data: form_data,
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(201)

    })

    test('Upload Model with Invalid Model', async () => {

        const form_data = new FormData()

        // TODO Need invalid model
        form_data.append('myModelFiles', fs.createReadStream('./fixtures/combine_all.sh'));

        const response = await axios.post(ENDPOINT + '/api/upload/model', form_data, {
            headers: {
                ...form_data.getHeaders()
            },
            data: form_data,
        })

        const model = response.data[0]
        const modelID = model._id

        // Get Model directly from MongoDB
        const query = { _id: ObjectId(modelID) }
        const modelObj = await models.findOne(query)

        await setTimeout(1000)

        // FIXME Should Status be 'Pending' if invalid?
        // console.log(modelObj)

    })

    test('Upload Model with Empty Model', async () => {

        const form_data = new FormData()

        const response = await axios.post(ENDPOINT + '/api/upload/model', form_data, {
            headers: {
                ...form_data.getHeaders()
            },
            data: form_data,
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(400)

    })

    test('Upload Model Unsupported File Format Model', async () => {

        const form_data = new FormData()
        form_data.append('myModelFiles', fs.createReadStream('./fixtures/combine_all.sh'));

        const response = await axios.post(ENDPOINT + '/api/upload/model', form_data, {
            headers: {
                ...form_data.getHeaders()
            },
            data: form_data,
        })

        const model = response.data[0]
        const modelID = model._id

        // Get Model directly from MongoDB
        const query = { _id: ObjectId(modelID) }
        const modelObj = await models.findOne(query)

        await setTimeout(1000)

        // FIXME Should Status be 'Pending' if invalid?
        // console.log(modelObj)

    })
})

test.describe('List Plugins', () => {

    test('List All Plugins', async () => {
        const response = await axios.post(ENDPOINT + '/api/plugins/list')
        const plugins = response.data.plugins

        let i = 0

        while (plugins[i]) {
            i++
        }

        expect.soft(i).toBe(9)
    })

})

test.describe('Upload Plugins', () => {

    test.skip('Upload Plugins', async () => {

        const form_data = new FormData()
        form_data.append('myFile', fs.createReadStream('./fixtures/partial_dependence_plot-0.1.0'));

        const response = await axios.post(ENDPOINT + '/api/plugins/upload', form_data, {
            headers: {
                ...form_data.getHeaders()
            },
            data: form_data,
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(200)
    })

    test('Upload Invalid File', async () => {

        const form_data = new FormData()
        form_data.append('myFile', fs.createReadStream('./fixtures/combine_all.sh'));

        const response = await axios.post(ENDPOINT + '/api/plugins/upload', form_data, {
            headers: {
                ...form_data.getHeaders()
            },
            data: form_data,
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(400)
    })

    test('Corrupted Plugin Meta JSON File', async () => {
        const form_data = new FormData()
        form_data.append('myFile', fs.createReadStream('./fixtures/aiverify.stock.process-checklist-corrupted.zip'));

        const response = await axios.post(ENDPOINT + '/api/plugins/upload', form_data, {
            headers: {
                ...form_data.getHeaders()
            },
            data: form_data,
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        expect.soft(response.status).toBe(400)
    })
})

test.describe('Delete Plugin', () => {

    test('Delete Plugin by Plugin GID', async () => {

        const pluginGID = "partial_dependence_plot-0.1.0"

        let response = await axios.post(ENDPOINT + '/api/plugins/list')
        let plugins = response.data.plugins

        let i = 0, isPluginExist = false

        while (plugins[i]) {
            if (plugins[i].gid == "partial_dependence_plot-0.1.0") {
                isPluginExist = true
                break;
            }
            i++
        }

        response = await axios.delete(ENDPOINT + "/api/plugins/delete/" + pluginGID, {
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        isPluginExist = false

        response = await axios.post(ENDPOINT + '/api/plugins/list')
        plugins = response.data.plugins

        while (plugins[i]) {
            if (plugins[i].gid == "partial_dependence_plot-0.1.0") {
                isPluginExist = true
                break;
            }
            i++
        }

        // Assert Response
        expect.soft(isPluginExist).toBeFalsy()
    })

    test('Delete Plugin with Non-existing Plugin GID', async () => {

        const pluginGID = "aiverify.stock.process-checklist"

        const response = await axios.delete(ENDPOINT + "/api/plugins/delete/" + pluginGID, {
            validateStatus: function (status) {
                return status < 600; // Resolve only if the status code is less than 600
            }
        })

        // Assert Response
        expect.soft(response.status).toBe(400)
    })

})