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

test.describe('Get Project Template', () => {

  let projectTemplateId, projectTemplate

  test.beforeAll(async () => {

    const response = await axios.post(ENDPOINT, {
      query: project_template_data.CREATE_PROJECT_TEMPLATE,
      variables: project_template_data.PROJECT_TEMPLATE_VARIABLES
    })

    projectTemplate = response.data.data.createProjectTemplate

    projectTemplateId = projectTemplate.id

  })

  test('Get Project Templates', async () => {

    // Get All Project Templates
    const response = await axios.post(ENDPOINT, {
      query: project_template_data.GET_PROJECT_TEMPLATES
    })

    const output = response.data.data.projectTemplates

    let projectTemplateId = output[0].id

    // Get  Project Template Info directly from MongoDB
    let query = { _id: ObjectId(projectTemplateId) }
    let projectTemplateInfoObj = await projects.findOne(query)
    

    // Assert 1st Project Template
    expect(output[0].projectInfo.name).toBe(projectTemplateInfoObj.projectInfo.name)
    expect(output[0].projectInfo.description).toBe(projectTemplateInfoObj.projectInfo.description)

    expect(output[0].pages[0].layouts).toMatchObject(projectTemplateInfoObj.pages[0].layouts)
    expect(output[0].pages[0].reportWidgets[0].widgetGID).toBe(projectTemplateInfoObj.pages[0].reportWidgets[0].widgetGID)
    expect(output[0].pages[0].reportWidgets[0].key).toBe(projectTemplateInfoObj.pages[0].reportWidgets[0].key)
    expect(output[0].pages[0].reportWidgets[0].layoutItemProperties).toMatchObject(projectTemplateInfoObj.pages[0].reportWidgets[0].layoutItemProperties)

    expect(Date(output[0].createdAt)).toBe(Date(projectTemplateInfoObj.createdAt))
    expect(Date(output[0].updatedAt)).toBe(Date(projectTemplateInfoObj.updatedAt))

  })

  test('Get Project Template by Project Template Id', async () => {

    // Get Response
    const response = await axios.post(ENDPOINT, {
      query: project_template_data.GET_PROJECT_TEMPLATE_BY_PROJECT_TEMPLATE_ID,
      variables: {
        "projectTemplateId": projectTemplateId
      }
    })

    const projectTemplateInfo = response.data.data.projectTemplate

    // Get Project Info directly from MongoDB
    const query = { _id: ObjectId(projectTemplateId) }
    const projectTemplateInfoObj = await projects.findOne(query)

    // Assert Response
    expect(projectTemplateInfo.projectInfo.name).toBe(projectTemplateInfoObj.projectInfo.name)
    expect(projectTemplateInfo.projectInfo.description).toBe(projectTemplateInfoObj.projectInfo.description)
    expect(projectTemplateInfo.projectInfo.company).toBe(projectTemplateInfoObj.projectInfo.company)

    expect(projectTemplateInfo.pages[0].layouts).toMatchObject(projectTemplateInfoObj.pages[0].layouts)
    expect(projectTemplateInfo.pages[0].reportWidgets[0].widgetGID).toBe(projectTemplateInfoObj.pages[0].reportWidgets[0].widgetGID)
    expect(projectTemplateInfo.pages[0].reportWidgets[0].key).toBe(projectTemplateInfoObj.pages[0].reportWidgets[0].key)
    expect(projectTemplateInfo.pages[0].reportWidgets[0].layoutItemProperties).toMatchObject(projectTemplateInfoObj.pages[0].reportWidgets[0].layoutItemProperties)
    expect(projectTemplateInfo.pages[0].reportWidgets[0].properties).toBe(projectTemplateInfoObj.pages[0].reportWidgets[0].properties)

    expect(Date(projectTemplateInfo.createdAt)).toBe(Date(projectTemplateInfoObj.createdAt))
    expect(Date(projectTemplateInfo.updatedAt)).toBe(Date(projectTemplateInfoObj.updatedAt))

  })

  test('Get Project Template by Invalid Project Template Id', async () => {

    // Test For NULL Project Template ID
    let response = await axios.post(ENDPOINT, {
      query: project_template_data.GET_PROJECT_TEMPLATE_BY_PROJECT_TEMPLATE_ID,
      variables: {
        "projectTemplateId": null
      }
    })

    let errorMessage = response.data.errors

    // Assert Response
    expect(errorMessage[0].message).toBe('Variable "$projectTemplateId" of non-null type "ObjectID!" must not be null.')

    // Test For Integer Project Template ID
    response = await axios.post(ENDPOINT, {
      query: project_template_data.GET_PROJECT_TEMPLATE_BY_PROJECT_TEMPLATE_ID,
      variables: {
        "projectTemplateId": 0
      }
    })

    errorMessage = response.data.errors

    // Assert Response
    expect(errorMessage[0].message).toBe('Variable "$projectTemplateId" got invalid value 0; Value is not a valid mongodb object id of form: 0')

    // Test For Non-existing Project Template ID
    response = await axios.post(ENDPOINT, {
      query: project_template_data.GET_PROJECT_TEMPLATE_BY_PROJECT_TEMPLATE_ID,
      variables: {
        "projectTemplateId": "63e207c7fb46f9de3ab2508"
      }
    })

    errorMessage = response.data.errors

    // Assert Response
    expect(errorMessage[0].message).toBe('Variable "$projectTemplateId" got invalid value "63e207c7fb46f9de3ab2508"; Value is not a valid mongodb object id of form: 63e207c7fb46f9de3ab2508')
  })

  test('Get Project Template by Empty Project Template Id', async () => {

    // Get Response
    const response = await axios.post(ENDPOINT, {
      query: project_template_data.GET_PROJECT_TEMPLATE_BY_PROJECT_TEMPLATE_ID,
      variables: {
        "projectTemplateId": ""
      }
    })

    const errorMessage = response.data.errors

    // Assert Response
    expect(errorMessage[0].message).toBe('Variable "$projectTemplateId" got invalid value ""; Value is not a valid mongodb object id of form: ')
  })

})