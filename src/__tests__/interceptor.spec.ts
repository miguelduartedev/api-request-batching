import { AxiosResponse } from "axios"
import apiClient from "../apiClient"

type ExtendedPromiseSettledResult<T> = PromiseSettledResult<T> & {
  reason?: any
  value?: T
}

type ResponseType<T> = Array<ExtendedPromiseSettledResult<T>>

const batchUrl = "/file-batch-api"

describe("Interceptor tests", () => {
  it("Test batch with fileid1, fileid2, fileid3 ", () => {
    // those calls should trigger only one request in the network tab
    const call1_part1 = apiClient.get(batchUrl, {
      params: {
        ids: ["fileid1", "fileid2"],
      },
    })

    const call1_part2 = apiClient.get(batchUrl, {
      params: {
        ids: ["fileid2"],
      },
    })

    // Should reject as the fileid3 is missing from the response
    const call1_part3 = apiClient.get(batchUrl, {
      params: {
        ids: ["fileid3"],
      },
    })

    return Promise.allSettled([call1_part1, call1_part2, call1_part3]).then(
      (response: ResponseType<AxiosResponse>) => {
        expect(response[0].status).toEqual("fulfilled")
        expect(response[0]?.value?.data.items).toEqual([
          { id: "fileid1" },
          { id: "fileid2" },
        ])
        expect(response[1].status).toEqual("fulfilled")
        expect(response[1]?.value?.data.items).toEqual([{ id: "fileid2" }])
        expect(response[2].reason).toEqual({
          status: "rejected",
          reason: "The requested file has not been found.",
        })
      },
    )
  })

  it("Test batch in different calls with fileid1, fileid2, fileid3", async () => {
    const myTimeout = 3000

    const call1 = apiClient.get(batchUrl, {
      params: {
        ids: ["fileid3"],
      },
    })

    await Promise.allSettled([
      call1,
      new Promise((resolve) => {
        setTimeout(() => {
          const call2 = apiClient.get(batchUrl, {
            params: {
              ids: ["fileid1", "fileid2", "fileid3"],
            },
          })

          Promise.allSettled([call2])
            .then((response: ResponseType<AxiosResponse>) => {
              expect(response[0].status).toEqual("fulfilled")
              expect(response[0]?.value?.data.items).toEqual([
                { id: "fileid1" },
                { id: "fileid2" },
              ])
            })
            .catch((error) => {
              console.log(error)
            })
            // @ts-ignore
            .finally(resolve)
        }, myTimeout)
      }),
    ])
      .then((response: ResponseType<unknown>) => {
        expect(response[0].reason).toStrictEqual({
          status: "rejected",
          reason: "The requested file has not been found.",
        })
      })
      .catch((error) => {
        console.log(error)
      })
  })

  it("Test batch with empty file IDs", () => {
    const call = apiClient.get(batchUrl, {
      params: {
        ids: [],
      },
    })

    return call
      .then((response) => {
        expect(response.status).toEqual(200)
      })
      .catch((error) =>
        expect(error).toStrictEqual({
          status: "rejected",
          reason: "The requested file has not been found.",
        }),
      )
  })

  it("Test batch with 100 file ID requests", () => {
    const fileIds = Array.from({ length: 100 }, (_, i) => `fileid${i}`)
    const call = apiClient.get(batchUrl, {
      params: {
        ids: fileIds,
      },
    })

    return call
      .then((response) => {
        expect(response.status).toEqual(200)
        expect(response.data.items.length).toEqual(99)
      })
      .catch((error) => {
        console.log(error)
      })
  })

  it("Test batch with duplicate file IDs", () => {
    const call = apiClient.get(batchUrl, {
      params: {
        ids: ["fileid1", "fileid2", "fileid1", "fileid3"],
      },
    })

    return call
      .then((response) => {
        expect(response.status).toEqual(200)
        expect(response.data.items).toStrictEqual([
          { id: "fileid1" },
          { id: "fileid2" },
        ])
      })
      .catch((error) => {
        console.log(error)
      })
  })
})
