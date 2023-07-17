export const MODELS = `query Query {
  modelFiles {
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
}`

export const UPDATE_MODEL = `mutation Mutation($modelFileId: ObjectID!, $modelFile: ModelFileInput) {
  updateModel(modelFileID: $modelFileId, modelFile: $modelFile) {
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
}`

export const DELETE_MODEL = `mutation Mutation($deleteModelFileId: ObjectID!) {
    deleteModelFile(id: $deleteModelFileId)
  }`