export const GET_PROJECT_TEMPLATES = `query ProjectTemplates {
  projectTemplates {
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

export const GET_PROJECT_TEMPLATE_BY_PROJECT_TEMPLATE_ID = `query Query($projectTemplateId: ObjectID!) {
  projectTemplate(id: $projectTemplateId) {
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

export const CLONE_PROJECT_TEMPLATE = `mutation CloneProjectTemplate($cloneProjectTemplateId: ObjectID!) {
  cloneProjectTemplate(id: $cloneProjectTemplateId) {
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

export const DELETE_PROJECT_TEMPLATE = `mutation DeleteProjectTemplate($deleteProjectTemplateId: ObjectID!) {
  deleteProjectTemplate(id: $deleteProjectTemplateId)
}`

export const UPDATE_PROJECT_TEMPLATE = `mutation UpdateProjectTemplate($updateProjectTemplateId: ObjectID!, $projectTemplate: ProjectTemplateInput!) {
  updateProjectTemplate(id: $updateProjectTemplateId, projectTemplate: $projectTemplate) {
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
          "maxH": 35,
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