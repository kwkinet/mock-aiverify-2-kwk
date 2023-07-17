import { test, expect } from '@playwright/test'
import * as dataset_data from './dataset-data.js'

import axios from 'axios'
import fs from 'fs'
import FormData from 'form-data'
import {setTimeout} from "timers/promises"

const ENDPOINT = "http://127.0.0.1:3000"

test.describe('Get Datasets', () => {

    let datasetID

    test.beforeAll(async () => {

        const form_data = new FormData()
        form_data.append('myFiles', fs.createReadStream('./fixtures/pickle_pandas_tabular_loan_testing.sav'));

        await axios.post(ENDPOINT + '/api/upload/data', form_data, {
            headers: {
                ...form_data.getHeaders()
            },
            data: form_data,
        })

    })

    test('Get All Datasets', async () => {

        await setTimeout(2000);

        const response = await axios.post(ENDPOINT + "/api/graphql", {
            query: dataset_data.DATASETS,
        })

        let dataset1 = response.data.data.datasets[0]
        let dataset2 = response.data.data.datasets[1]

        datasetID = dataset1.id
        expect(dataset1).toBeDefined()
        expect(dataset2).toBeDefined()

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