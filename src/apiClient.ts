import axios, { AxiosInstance } from "axios"
import {
  batchRequestInterceptor,
  batchResponseInterceptor,
} from "./interceptor.ts"

const instance: AxiosInstance = axios.create({
  baseURL: "https://europe-west1-quickstart-1573558070219.cloudfunctions.net",
})

batchRequestInterceptor(instance)
batchResponseInterceptor(instance)

export default instance
