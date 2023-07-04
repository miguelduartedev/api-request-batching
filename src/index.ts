import apiClient from "./apiClient.ts"

// All requests should run at the same time and produce only one request to the backend. All requests should return or reject.
const runTest = (): void => {
  const batchUrl = "/file-batch-api"

  // Should return [{id:"fileid1"},{id:"fileid2"}]
  apiClient
    .get(batchUrl, { params: { ids: ["fileid1", "fileid2"] } })
    .then((response) => {
      console.log("First Request 1/3 Success: ", response)
    })
    .catch((error) => {
      console.log("Request Rejected: ", error)
    })
  // Should return [{id:"fileid2"}]
  apiClient
    .get(batchUrl, { params: { ids: ["fileid2"] } })
    .then((response) => {
      console.log("First Request 2/3 Success: ", response)
    })
    .catch((error) => {
      console.log("Request Rejected: ", error)
    })

  // Should reject as the fileid3 is missing from the response
  apiClient
    .get(batchUrl, { params: { ids: ["fileid3"] } })
    .then((response) => {
      console.log("First Request 3/3 Success: ", response)
    })
    .catch((error) => {
      console.log("Request Rejected: ", error)
    })

  setTimeout(() => {
    // Since this is sent after the time limit, a new request should be made and the response should be [{id:"fileid9"}]
    apiClient
      .get(batchUrl, {
        params: { ids: ["fileid9"] },
      })
      .then((response) => {
        console.log("Second Request 1/1 Success: ", response)
      })
      .catch((error) => {
        console.log("Request Rejected: ", error)
      })
  }, 1250) // Ensures a new request to the server

  setTimeout(() => {
    // Since this is sent after the time limit, a new request should be made and the response should reject as the fileid3 is missing from the response
    apiClient
      .get(batchUrl, {
        params: { ids: ["fileid3"] },
      })
      .then((response) => {
        console.log("Third Request 1/1 Success: ", response)
      })
      .catch((error) => {
        console.log("Request Rejected: ", error)
      })
  }, 2500) // Ensures a new request to the server
}

runTest()
