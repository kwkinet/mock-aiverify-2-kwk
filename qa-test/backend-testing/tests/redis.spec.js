import { Client } from 'redis-om'
import { createClient } from 'redis'
import { test, expect } from '@playwright/test'

const URI = 'redis://127.0.0.1:6379'
const connection = createClient({ URI })

let task, validateDataset, validateModel

const baseDir = process.env.BASEDIR ?? "/app/portal";

test.describe.configure({ mode: 'serial' });
test.describe('Test Engine Task', () => {

    test('Test Engine Task with Valid Inputs (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "task:642691211b68cd044de3001e-642691211b68cd044de30023",
            "algorithmId": "algo:aiverify.stock.partial_dependence_plot:partial_dependence_plot",
            "algorithmArgs": {},
            "testDataset": baseDir + "/uploads/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/uploads/model/pickle_scikit_multiclasslr_loan.sav",
            "groundTruthDataset": +baseDir + "/uploads/data/pickle_pandas_tabular_loan_testing.sav",
            "modelType":"classification",
            "groundTruth":"Interest_Rate"
        })

        // Create Connection to App via Redis
        await connection.connect()

        console.log("connected")

        // Register Plugin
        await connection.hSet("algo:aiverify.stock.algorithms.partial_dependence_plot:partial_dependence_plot", "inputSchema", "{\"$schema\":\"https://json-schema.org/draft/2020-12/schema\",\"$id\":\"https://gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-stock-plugins/partial_dependence_plot/input.schema.json\",\"title\":\"Algorithm Plugin Input Arguments\",\"description\":\"A schema for algorithm plugin input arguments\",\"type\":\"object\",\"required\":[\"target_feature_name\",\"percentiles\",\"grid_resolution\"],\"properties\":{\"target_feature_name\":{\"title\":\"Target Feature Name\",\"description\":\"Target Feature Name (e.g. Interest_Rate)\",\"type\":\"string\"},\"percentiles\":{\"title\":\"Cut-off percentiles\",\"description\":\"Cut-off percentiles (e.g. [0.01, 0.99])\",\"type\":\"array\",\"minItems\":2,\"maxItems\":2,\"items\":{\"type\":\"number\"}},\"grid_resolution\":{\"title\":\"Grid Resolution\",\"description\":\"Grid Resolution (e.g. 25)\",\"type\":\"number\"}}}")
        await connection.hSet("algo:aiverify.stock.algorithms.partial_dependence_plot:partial_dependence_plot", "requirements", "[\"numpy==1.23.5 ; python_version >= \\\"3.10\\\" and python_version < \\\"3.11\\\"\",\"scipy==1.10.1 ; python_version >= \\\"3.10\\\" and python_version < \\\"3.11\\\"\"]")
        await connection.hSet("algo:aiverify.stock.algorithms.partial_dependence_plot:partial_dependence_plot", "outputSchema", "{\"$schema\":\"https://json-schema.org/draft/2020-12/schema\",\"$id\":\"/partial_dependence_plot/output.schema.json\",\"title\":\"Algorithm Plugin Output Arguments\",\"description\":\"A schema for algorithm plugin output arguments\",\"type\":\"object\",\"required\":[\"feature_names\",\"results\"],\"properties\":{\"feature_names\":{\"type\":\"array\",\"description\":\"Array of feature names\",\"minItems\":1,\"items\":{\"type\":\"string\"}},\"output_classes\":{\"description\":\"Array of output classes\",\"type\":\"array\",\"minItems\":1,\"items\":{\"type\":[\"string\",\"number\",\"integer\",\"boolean\"]}},\"results\":{\"description\":\"Matrix of feature values (# feature names)\",\"type\":\"array\",\"minItems\":1,\"items\":{\"description\":\"Matrix of PDP plot data (# output classes)\",\"type\":\"array\",\"minItems\":1,\"items\":{\"type\":\"array\",\"description\":\"Array of PDP values for each feature value (# feature values)\",\"minItems\":1,\"items\":{\"type\":\"object\",\"description\":\"Array of feature and PDP value\",\"required\":[\"feature_value\",\"pdp_value\"],\"properties\":{\"feature_value\":{\"type\":\"number\"},\"pdp_value\":{\"type\":\"number\"}}}}}}}}")
        await connection.hSet("algo:aiverify.stock.algorithms.partial_dependence_plot:partial_dependence_plot", "data", "{\"cid\":\"partial_dependence_plot\",\"name\":\"partial dependence plot\",\"modelType\":[\"classification\",\"regression\"],\"version\":\"0.1.0\",\"author\":\"IMDA-T2E\",\"description\":\"A Partial Dependence Plot (PDP) explains how each feature and its feature value contribute to the predictions.\",\"tags\":[\"partial dependence plot\",\"classification\",\"regression\"],\"requireGroundTruth\":false,\"requiredFiles\":[\"AUTHORS.rst\",\"CHANGELOG.md\",\"input.schema.json\",\"LICENSE\",\"output.schema.json\",\"partial_dependence_plot.meta.json\",\"partial_dependence_plot.py\",\"README.md\",\"requirements.txt\",\"syntax_checker.py\"],\"type\":\"Algorithm\",\"gid\":\"aiverify.stock.algorithms.partial_dependence_plot:partial_dependence_plot\",\"pluginGID\":\"aiverify.stock.algorithms.partial_dependence_plot\",\"algoPath\":{\"" + baseDir + "/ai-verify-portal/plugins/aiverify.stock.partial-dependence-plot" +"\"}")

        console.log("registered plugins")

        // Open API Connection to App via Redis
        const client = await new Client().use(connection)

        console.log("connected to api")

        // Send Task to Task Listener in App via Redis Stream
        const eventId = await connection.xAdd('TestEngineTask', '*', { task })

        console.log("sent task")

        // App returns HSET response via Redis Stream
        const output = await connection.xRange('TestEngineTask', eventId, eventId)

        console.log("responded")

        // Parse HSET Response
        const taskId = JSON.parse(output[0].message.task).id

        // Get HSET Response
        let taskResponse = await connection.hGetAll(taskId)

        console.log("got all responses")

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
        }

        // Assert Response
        expect(taskResponse.status).toBe('Success')

        console.log("asserted")

        // Close API Connection
        await client.close()

    });

    test('Invalid Data File (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "task:642691211b68cd044de3001e-642691211b68cd044de30024",
            "algorithmId": "algo:aiverify.stock.algorithms.partial_dependence_plot:partial_dependence_plot",
            "algorithmArgs": { "percentiles": [0.05, 0.95], "target_feature_name": "Interest_Rate", "grid_resolution": 100 },
            "testDataset": baseDir + "/uploads/data/combine_all.sh",
            "modelFile": baseDir + "/uploads/model/pickle_scikit_multiclasslr_loan.sav",
            "modelType": "classification",
        })

        // Create Connection to App via Redis
        await connection.connect()

        // Open API Connection to App via Redis
        const client = await new Client().use(connection)

        // Send Task to Task Listener in App via Redis Stream
        const eventId = await connection.xAdd('TestEngineTask', '*', { task })

        // App returns HSET response via Redis Stream
        const output = await connection.xRange('TestEngineTask', eventId, eventId)

        // Parse HSET Response
        const taskId = JSON.parse(output[0].message.task).id

        // Get HSET Response
        let taskResponse = await connection.hGetAll(taskId)

        // Assert Response
        // expect(taskResponse.status).toBe('Success')

        // Close API Connection
        await client.close()

    })

    test('Invalid Model File (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "task:642691211b68cd044de3001e-642691211b68cd044de30025",
            "algorithmId": "algo:aiverify.stock.algorithms.partial_dependence_plot:partial_dependence_plot",
            "algorithmArgs": { "percentiles": [0.05, 0.95], "target_feature_name": "Interest_Rate", "grid_resolution": 100 },
            "testDataset": baseDir + "/uploads/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/uploads/data/combine_all.sh",
            "modelType": "classification",
        })

        // Create Connection to App via Redis
        await connection.connect()

        // Open API Connection to App via Redis
        const client = await new Client().use(connection)

        // Send Task to Task Listener in App via Redis Stream
        const eventId = await connection.xAdd('TestEngineTask', '*', { task })

        // App returns HSET response via Redis Stream
        const output = await connection.xRange('TestEngineTask', eventId, eventId)

        // Parse HSET Response
        const taskId = JSON.parse(output[0].message.task).id

        // Get HSET Response
        let taskResponse = await connection.hGetAll(taskId)

        // Assert Response
        // expect(taskResponse.status).toBe('Success')

        // Close API Connection
        await client.close()

    })

    test('Invalid Input Schema (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "task:642691211b68cd044de3001e-642691211b68cd044de30026",
            "algorithmId": "algo:aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox",
            "algorithmArgs": { "sensitive_feature": ["Gender", "Home_Owner"] },
            "testDataset": "/home/benflop/GitHub/backend-testing/fixtures/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": "/home/benflop/uploads/model/combine_all.sh",
            "groundTruthDataset": "/home/benflop/GitHub/backend-testing/fixtures/pickle_pandas_tabular_loan_testing.sav",
            "modelType": "classification",
            "groundTruth": "Interest_Rate"
        })

        // Create Connection to App via Redis
        await connection.connect()

        // Open API Connection to App via Redis
        const client = await new Client().use(connection)

        // Send Task to Task Listener in App via Redis Stream
        const eventId = await connection.xAdd('TestEngineTask', '*', { task })

        // App returns HSET response via Redis Stream
        const output = await connection.xRange('TestEngineTask', eventId, eventId)

        // Parse HSET Response
        const taskId = JSON.parse(output[0].message.task).id

        // Get HSET Response
        let taskResponse = await connection.hGetAll(taskId)

        // Assert Response
        // expect(taskResponse.status).toBe('Success')

        // Close API Connection
        await client.close()

    })

    test('Invalid Algorithm ID (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "task:642691211b68cd044de3001e-642691211b68cd044de30027",
            "algorithmId": "aiverify.algorithms.partial_dependence_plot:partial_dependence_plot",
            "algorithmArgs": { "percentiles": [0.05, 0.95], "target_feature_name": "Interest_Rate", "grid_resolution": 100 },
            "testDataset": baseDir + "/uploads/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/uploads/model/pickle_scikit_multiclasslr_loan.sav",
            "modelType": "classification",
        })

        // Create Connection to App via Redis
        await connection.connect()

        // Open API Connection to App via Redis
        const client = await new Client().use(connection)

        // Send Task to Task Listener in App via Redis Stream
        const eventId = await connection.xAdd('TestEngineTask', '*', { task })

        // App returns HSET response via Redis Stream
        const output = await connection.xRange('TestEngineTask', eventId, eventId)

        // Parse HSET Response
        const taskId = JSON.parse(output[0].message.task).id

        // Get HSET Response
        let taskResponse = await connection.hGetAll(taskId)

        // Assert Response
        // expect(taskResponse.status).toBe('Success')

        // Close API Connection
        await client.close()

    })

})

test.describe('Test Engine Service', () => {

    test('Validate Dataset', async () => {

        validateDataset = JSON.stringify({
            "serviceId": "service:64530",
            "filePath": baseDir + "/uploads/data/pickle_pandas_tabular_loan_testing.sav"
        })
        
        // Create Connection to App via Redis
        await connection.connect()

        const client = await new Client().use(connection)

        // Send Task to Task Listener in App via Redis Stream
        const eventId = await connection.xAdd('TestEngineService', '*', { validateDataset })

        // App returns HSET response via Redis Stream
        const output = await connection.xRange('TestEngineService', eventId, eventId)

        // Parse HSET Response
        const serviceId = JSON.parse(output[0].message.validateDataset).serviceId

        // Get HSET Response
        const serviceResponse = await connection.hGetAll(serviceId)

        // Assert Response
        expect(serviceResponse.validationResult).toBe('valid')

        // Close API Connection
        await client.close()
    })

    test.skip('Invalid Dataset', async () => {

        validateDataset = JSON.stringify({
            "serviceId": "service:64531",
            "filePath": baseDir + "/uploads/data/combine_all.sh"
        })
        
        // Create Connection to App via Redis
        await connection.connect()

        const client = await new Client().use(connection)

        // Send Task to Task Listener in App via Redis Stream
        const eventId = await connection.xAdd('TestEngineService', '*', { validateDataset })

        // App returns HSET response via Redis Stream
        const output = await connection.xRange('TestEngineService', eventId, eventId)

        // Parse HSET Response
        const serviceId = JSON.parse(output[0].message.validateDataset).serviceId

        // Get HSET Response
        const serviceResponse = await connection.hGetAll(serviceId)

        // Assert Response
        expect(serviceResponse.validationResult).toBe('invalid')

        // Close API Connection
        await client.close()

    })

    test('Validate Model', async () => {

        validateModel = JSON.stringify({
            "serviceId": "service:64530a39dc46da5656d1593k",
            "mode": "upload",
            "filePath": baseDir + "/uploads/model/pickle_scikit_multiclasslr_loan.sav"
        })

        // Create Connection to App via Redis
        await connection.connect()

        const client = await new Client().use(connection)

        // Send Task to Task Listener in App via Redis Stream
        const eventId = await connection.xAdd('TestEngineService', '*', { validateModel })

        // App returns HSET response via Redis Stream
        const output = await connection.xRange('TestEngineService', eventId, eventId)

        // Parse HSET Response
        const serviceId = JSON.parse(output[0].message.validateModel).serviceId

        // Get HSET Response
        const serviceResponse = await connection.hGetAll(serviceId)
        
        // Assert Response
        expect(serviceResponse.validationResult).toBe('valid')

        // Close API Connection
        await client.close()
    })

    test.skip('Invalid Model', async () => {
        
    })
    
})