import {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios"

let serverResponse: AxiosResponse

const timeThreshold = (interval: number) =>
  new Promise((resolve) => setTimeout(resolve, interval))

const batchRequestInterceptor = (instance: AxiosInstance) => {
  let requestQueue: InternalAxiosRequestConfig[] = []
  let requestedIDs: string[] = []
  const TIME_LIMIT = 750

  instance.interceptors.request.use(
    async (request: InternalAxiosRequestConfig) => {
      if (
        request.method?.toLowerCase() === "get" &&
        request.url === "/file-batch-api"
      ) {
        requestQueue.push(request)

        await timeThreshold(TIME_LIMIT)

        requestQueue.forEach(
          (request: InternalAxiosRequestConfig, index: number) => {
            const controller = new AbortController()
            request.signal = controller.signal

            request.params.ids.forEach((id: string) => {
              if (!requestedIDs.includes(id)) {
                requestedIDs.push(id)
              }
            })

            if (index === 0) {
              request.params.ids = requestedIDs
            } else {
              controller.abort({
                index,
                requestedIds: request.params.ids,
                description:
                  "All requests are being consolidated into a single batch for improved efficiency and performance.",
              })
            }
          },
        )

        requestedIDs = []
        requestQueue = []
      }
      return request
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    },
  )
}

const batchResponseInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      serverResponse = response
      if (response.data.items.length === 0) {
        return Promise.reject({
          status: "rejected",
          reason: "The requested file has not been found.",
        })
      }
      return Promise.resolve(response)
    },
    async (error) => {
      await timeThreshold(1250)
      let matchedIds: Array<{ id: string }> = []

      serverResponse.data.items.forEach((file: { id: string }) => {
        if (error.config.signal.reason.requestedIds.includes(file.id)) {
          matchedIds.push(file)
        }
      })

      if (matchedIds.length > 0) {
        return Promise.resolve({ data: { items: matchedIds } })
      }
      return Promise.reject({
        status: "rejected",
        reason: "The requested file has not been found.",
      })
    },
  )
}

export { batchRequestInterceptor, batchResponseInterceptor }
