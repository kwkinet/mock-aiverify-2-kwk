export const GET_PROJECTS = `query Query {
    projects {
      projectInfo {
        company
        description
        name
        reportTitle
      }
    }
  }`

export const GET_PROJECT_BY_ID = `query Query($projectId: ObjectID!) {
    project(id: $projectId) {
      projectInfo {
        name
        description
        company
        reportTitle
      }
    }
  }`

export const GET_REPORT_BY_PROJECT_ID = `query Report($projectId: ObjectID!) {
  report(projectID: $projectId) {
    projectID
    projectSnapshot {
      id
      template {
        id
        fromPlugin
        projectInfo {
          name
          description
          reportTitle
          company
        }
        globalVars {
          key
          value
        }
        pages {
          layouts {
            i
            x
            y
            w
            h
            maxW
            maxH
            minW
            minH
            static
            isDraggable
            isResizable
            resizeHandles
            isBounded
          }
          reportWidgets {
            widgetGID
            key
            layoutItemProperties {
              justifyContent
              alignItems
              color
              bgcolor
            }
            properties
          }
        }
        createdAt
        updatedAt
      }
      projectInfo {
        name
        description
        reportTitle
        company
      }
      globalVars {
        key
        value
      }
      pages {
        layouts {
          i
          x
          y
          w
          h
          maxW
          maxH
          minW
          minH
          static
          isDraggable
          isResizable
          resizeHandles
          isBounded
        }
        reportWidgets {
          widgetGID
          key
          layoutItemProperties {
            justifyContent
            alignItems
            color
            bgcolor
          }
          properties
        }
      }
      inputBlockData
      testInformationData {
        algorithmGID
        testArguments
      }
      report {
        projectID
        status
        timeStart
        timeTaken
        totalTestTimeTaken
        inputBlockData
        tests {
          algorithmGID
          algorithm {
            mdxPath
            gid
            cid
            pluginGID
            name
            description
            tags
            inputSchema
            outputSchema
            requirements
          }
          testArguments
          status
          progress
          timeStart
          timeTaken
          output
        }
      }
      createdAt
      updatedAt
      modelAndDatasets {
        groundTruthColumn
      }
    }
    status
    timeStart
    timeTaken
    totalTestTimeTaken
    inputBlockData
    tests {
      algorithmGID
      algorithm {
        mdxPath
        gid
        cid
        pluginGID
        name
        description
        tags
        inputSchema
        outputSchema
        requirements
      }
      testArguments
      status
      progress
      timeStart
      timeTaken
      output
    }
  }
}`

export const CREATE_PROJECT = `mutation CreateProject($project: ProjectInput!) {
  createProject(project: $project) {
    id
    template {
      id
      fromPlugin
      projectInfo {
        name
        description
        reportTitle
        company
      }
      globalVars {
        key
        value
      }
      pages {
        layouts {
          i
          x
          y
          w
          h
          maxW
          maxH
          minW
          minH
          static
          isDraggable
          isResizable
          resizeHandles
          isBounded
        }
        reportWidgets {
          widgetGID
          key
          layoutItemProperties {
            justifyContent
            alignItems
            color
            bgcolor
          }
          properties
        }
      }
      createdAt
      updatedAt
    }
    projectInfo {
      name
      description
      reportTitle
      company
    }
    globalVars {
      key
      value
    }
    pages {
      layouts {
        i
        x
        y
        w
        h
        maxW
        maxH
        minW
        minH
        static
        isDraggable
        isResizable
        resizeHandles
        isBounded
      }
      reportWidgets {
        widgetGID
        key
        layoutItemProperties {
          justifyContent
          alignItems
          color
          bgcolor
        }
        properties
      }
    }
    inputBlockData
    testInformationData {
      algorithmGID
      testArguments
    }
    report {
      projectID
      status
      timeStart
      timeTaken
      totalTestTimeTaken
      inputBlockData
      tests {
        algorithmGID
        algorithm {
          mdxPath
          gid
          cid
          pluginGID
          name
          description
          tags
          inputSchema
          outputSchema
          requirements
        }
        testArguments
        status
        progress
        timeStart
        timeTaken
        output
      }
    }
    createdAt
    updatedAt
    modelAndDatasets {
      model {
        id
        filename
        name
        filePath
        ctime
        description
        status
        size
        modelType
        serializer
        modelFormat
        errorMessages
        type
      }
      testDataset {
        id
        filename
        name
        filePath
        type
        ctime
        dataColumns {
          id
          name
          datatype
          label
        }
        numRows
        numCols
        description
        status
        size
        serializer
        dataFormat
        errorMessages
      }
      groundTruthDataset {
        id
        filename
        name
        filePath
        type
        ctime
        dataColumns {
          id
          name
          datatype
          label
        }
        numRows
        numCols
        description
        status
        size
        serializer
        dataFormat
        errorMessages
      }
      groundTruthColumn
    }
  }
}`

export const CREATE_PROJECT_FROM_TEMPLATE = `mutation CreateProjectFromTemplate($project: ProjectInput!, $templateId: String!) {
  createProjectFromTemplate(project: $project, templateId: $templateId) {
    id
    template {
      id
      fromPlugin
      projectInfo {
        name
        description
        reportTitle
        company
      }
      globalVars {
        key
        value
      }
      pages {
        layouts {
          i
          x
          y
          w
          h
          maxW
          maxH
          minW
          minH
          static
          isDraggable
          isResizable
          resizeHandles
          isBounded
        }
        reportWidgets {
          widgetGID
          key
          layoutItemProperties {
            justifyContent
            alignItems
            color
            bgcolor
          }
          properties
        }
      }
      createdAt
      updatedAt
    }
    projectInfo {
      name
      description
      reportTitle
      company
    }
    globalVars {
      key
      value
    }
    pages {
      layouts {
        i
        x
        y
        w
        h
        maxW
        maxH
        minW
        minH
        static
        isDraggable
        isResizable
        resizeHandles
        isBounded
      }
      reportWidgets {
        widgetGID
        key
        layoutItemProperties {
          justifyContent
          alignItems
          color
          bgcolor
        }
        properties
      }
    }
    inputBlockData
    testInformationData {
      algorithmGID
      testArguments
    }
    report {
      projectID
      status
      timeStart
      timeTaken
      totalTestTimeTaken
      inputBlockData
      tests {
        algorithmGID
        algorithm {
          mdxPath
          gid
          cid
          pluginGID
          name
          description
          tags
          inputSchema
          outputSchema
          requirements
        }
        testArguments
        status
        progress
        timeStart
        timeTaken
        output
      }
    }
    createdAt
    updatedAt
  }
}`

export const UPDATE_PROJECT = `mutation Mutation($updateProjectId: ObjectID!, $project: ProjectInput!) {
    updateProject(id: $updateProjectId, project: $project) {
      projectInfo {
        name
        description
        company
        reportTitle
      }
    }
  }`

export const DELETE_PROJECT = `mutation DeleteProject($deleteProjectId: ObjectID!) {
    deleteProject(id: $deleteProjectId)
  }`

export const CLONE_PROJECT = `mutation Mutation($cloneProjectId: ObjectID!) {
    cloneProject(id: $cloneProjectId) {
      projectInfo {
        name
        description
        reportTitle
        company
      }
    }
  }`

export const GENERATE_REPORT = `mutation Mutation($projectId: ObjectID!, $algorithms: [String]!) {
    generateReport(projectID: $projectId, algorithms: $algorithms) {
      projectSnapshot {
        report {
          projectID
          status
          timeStart
          timeTaken
          totalTestTimeTaken
          inputBlockData
        }
      }
    }
  }`

export const GENERATE_REPORT_TO_GENERATE_REPORT_STATUS = `mutation GenerateReport($projectId: ObjectID!, $algorithms: [String]!) {
  generateReport(projectID: $projectId, algorithms: $algorithms) {
    projectID
    status
  }
}`

export const CREATE_PROJECT_TEMPLATE = `mutation CreateProjectTemplate($projectTemplate: ProjectTemplateInput!) {
  createProjectTemplate(projectTemplate: $projectTemplate) {
    id
    fromPlugin
    projectInfo {
      name
      description
      reportTitle
      company
    }
    globalVars {
      key
      value
    }
    pages {
      layouts {
        i
        x
        y
        w
        h
        maxW
        maxH
        minW
        minH
        static
        isDraggable
        isResizable
        resizeHandles
        isBounded
      }
      reportWidgets {
        widgetGID
        key
        layoutItemProperties {
          justifyContent
          alignItems
          color
          bgcolor
        }
        properties
      }
    }
    createdAt
    updatedAt
  }
}`

export const CANCEL_TEST_RUNS = `mutation Mutation($projectId: ObjectID!, $algorithms: [String]!) {
    cancelTestRuns(projectID: $projectId, algorithms: $algorithms) {
      projectID
      status
      timeStart
      timeTaken
      totalTestTimeTaken
      inputBlockData
    }
  }`

export const SAVE_PROJECT_AS_TEMPLATE = `mutation SaveProjectAsTemplate($projectId: ObjectID!, $templateInfo: ProjectInformationInput!) {
  saveProjectAsTemplate(projectId: $projectId, templateInfo: $templateInfo) {
    id
    fromPlugin
    projectInfo {
      name
      description
      reportTitle
      company
    }
    globalVars {
      key
      value
    }
    pages {
      layouts {
        i
        x
        y
        w
        h
        maxW
        maxH
        minW
        minH
        static
        isDraggable
        isResizable
        resizeHandles
        isBounded
      }
      reportWidgets {
        widgetGID
        key
        layoutItemProperties {
          justifyContent
          alignItems
          color
          bgcolor
        }
        properties
      }
    }
    createdAt
    updatedAt
  }
}`

export const PROJECT_VARIABLES = {
  "project": {
    "projectInfo": {
      "name": "Project 301",
      "company": "Project 301",
      "description": "Project 301",
      "reportTitle": "Project 301"
    },
    "globalVars": [
      {
        "key": "20",
        "value": "30"
      },
      {
        "key": "30",
        "value": "30"
      }
    ],
    "inputBlockData": {
      "aiverify.stock.algorithms.partial_dependence_plot:partial_dependence_plot": {}
    },
    "testInformationData": [
      {
        "algorithmGID": "aiverify.stock.algorithms.partial_dependence_plot:partial_dependence_plot",
        "testArguments": {
          "sensitive_feature": [
            "Gender",
            "Home_Owner"
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
            "x": 0,
            "y": 0,
            "i": "1678694721822",
            "minW": 12,
            "maxW": 12,
            "minH": 12,
            "maxH": 36,
            "static": false
          },
          {
            "w": 12,
            "h": 1,
            "x": 0,
            "y": 35,
            "i": "_youcantseeme",
            "static": false
          }
        ],
        "reportWidgets": [
          {
            "widgetGID": "aiverify.stock.algorithms.partial_dependence_plot:partial_dependence_plot",
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
    "modelAndDatasets": {
      "groundTruthColumn": "Interest_Rate",
      "groundTruthDatasetId": "647967485b7aa8dcb8796048",
      "modelId": "647967545b7aa8dcb8796061",
      "testDatasetId": "647967485b7aa8dcb8796048"
    },
  }
}

export const PROJECT_BY_TEMPLATE_VARIABLES = {
  "projectInfo": {
    "name": "Project 301",
    "company": "Project 301",
    "description": "Project 301",
    "reportTitle": "Project 301"
  },
  "globalVars": [
    {
      "key": "20",
      "value": "30"
    },
    {
      "key": "30",
      "value": "30"
    }
  ],
  "pages": [
    {
      "layouts": [
        {
          "w": 12,
          "h": 12,
          "x": 0,
          "y": 0,
          "i": "1678694721822",
          "minW": 12,
          "maxW": 12,
          "minH": 12,
          "maxH": 36,
          "static": false
        },
        {
          "w": 12,
          "h": 1,
          "x": 0,
          "y": 35,
          "i": "_youcantseeme",
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
  "inputBlockData": {
    "aiverify.stock.fairness-metrics-toolbox-widgets:fairness-tree": {}
  },
  "modelAndDatasets": {
    "groundTruthColumn": "Interest_Rate",
  },
  "testInformationData": [
    {
      "algorithmGID": "aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox",
      "testArguments": {
        "sensitive_feature": [
          "Gender",
          "Home_Owner"
        ]
      },
    }
  ],
}

export const PROJECT_TEMPLATE_VARIABLES = {
  "projectTemplate": {
    "projectInfo": {
      "name": "Template 3",
      "company": "Template 3",
      "description": "Template 3",
      "reportTitle": "Template 3"
    },
    "globalVars": [
      {
        "key": "20",
        "value": "30"
      },
      {
        "key": "30",
        "value": "30"
      }
    ],
    "pages": [
      {
        "layouts": {
          "w": 1,
          "h": 4,
          "x": 5,
          "y": 9,
          "i": "1674113927768",
          "minW": 1,
          "maxW": 12,
          "minH": 4,
          "maxH": 36,
          "static": false
        },
        "reportWidgets": {
          "widgetGID": "aiverify.tests:test2",
          "key": "1675757519254",
          "layoutItemProperties": {
            "justifyContent": "left",
            "alignItems": "top",
            "color": null,
            "bgcolor": null
          },
          "properties": null
        }
      }
    ],
  }
}