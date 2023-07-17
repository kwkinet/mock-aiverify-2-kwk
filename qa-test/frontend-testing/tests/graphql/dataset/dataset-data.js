export const DATASETS = `query Datasets {
  datasets {
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
}`

export const UPDATE_DATASET = `mutation UpdateDataset($datasetId: ObjectID!, $dataset: DatasetInput) {
  updateDataset(datasetID: $datasetId, dataset: $dataset) {
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
}`

export const DELETE_DATASET = `mutation Mutation($deleteDatasetId: ObjectID!) {
    deleteDataset(id: $deleteDatasetId)
  }`