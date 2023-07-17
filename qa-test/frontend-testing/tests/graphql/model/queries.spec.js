import { test, expect } from '@playwright/test'
import * as model_data from './model-data.js'

import axios from 'axios'
import fs from 'fs'
import FormData from 'form-data'
import {setTimeout} from "timers/promises"

const ENDPOINT = "http://127.0.0.1:3000"

test.describe.configure({ mode: 'serial' });

test.describe('Get Models', () => {

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

        await setTimeout(2000);
    })

    test('Get All Models', async () => {
        
        const response = await axios.post(ENDPOINT + '/api/graphql', {
            query: model_data.MODELS,
        })

        let model1 = response.data.data.modelFiles[0]
        let model2 = response.data.data.modelFiles[1]

        modelID = model1.id

        expect(model1).toBeDefined()
        expect(model2).toBeDefined()

    })

    test.afterAll(async () => {

        await axios.post(ENDPOINT + '/api/graphql', {
            query: model_data.DELETE_MODEL,
            variables: {
                "deleteModelFileId": modelID
            }
        })
    })
})