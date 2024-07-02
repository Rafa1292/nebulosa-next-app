import { Bill, PayMethod } from '@/interfaces'
import axios from 'axios'
import Swal from 'sweetalert2'

class CustomResponse<T> {
  public data!: T
  public error!: boolean
  public message!: string[]

  constructor() {
    this.data = {} as T
    this.error = false
    this.message = ['']
  }

  public badResponse(errors: string[]): CustomResponse<T> {
    const response = new CustomResponse<T>()
    response.error = true
    response.message = errors
    return response
  }

  public setResponse(data: T, error: boolean, message: string[]): CustomResponse<T> {
    const response = new CustomResponse<T>()
    response.data = data
    response.error = error
    response.message = message
    return response
  }
}

const publicBillingApi = 'http://192.168.100.7:4001/api/v1/'
const publicDashboardApi = 'http://192.168.100.7:4008/api/v1/'
const billingApi = 'http://localhost:5000/'
const dashboardApi = 'http://localhost:5000/'

const useGetList = async <T>(route: string, api: boolean): Promise<CustomResponse<T>> => {
  return await useCustom<T>(route, 'get', {} as T, api)
}

const usePost = async <T>(route: string, data: T, api: boolean): Promise<CustomResponse<T>> => {
  return await useCustom<T>(route, 'post', data, api)
}
// eslint-disable-next-line
const usePostWithResponse = async (route: string, data: any, api: boolean): Promise<CustomResponse<any>> => {
  // eslint-disable-next-line
  return await useCustom<any>(route, 'post', data, api)
}

const useDelete = async <T>(route: string, api: boolean): Promise<CustomResponse<T>> => {
  return await useCustom<T>(route, 'delete', {} as T, api)
}

const useGet = async <T>(route: string, api: boolean): Promise<CustomResponse<T>> => {
  return await useCustom<T>(route, 'get', {} as T, api)
}

const usePatch = async <T>(route: string, data: T, api: boolean): Promise<CustomResponse<T>> => {
  return await useCustom<T>(route, 'patch', data, api)
}

const getCredentials = (): string => {
  const credentials = localStorage.getItem('credentials')
  if (credentials) {
    const token = JSON.parse(credentials).token
    return token
  }
  return ''
}

const commandBillApi = async <T>(
  cedula: string,
  cashier: string,
  payWith: number,
  payMethod: PayMethod,
  bill: Bill,
  needsReprint: boolean,
): Promise<CustomResponse<T>> => {
  const customResponse = new CustomResponse<T>()

  try {
    const response = await axios({
      headers: {
        Authorization: `bearer ${getCredentials()}`,
      },
      data: {
        cedula: cedula,
        cashier: cashier,
        payWith: payWith,
        payMethod: payMethod,
        needsReprint: needsReprint,
        ...bill,
      },
      method: 'post',
      url: `http://localhost:5000/command`,
    })
    if (response?.data?.error) {
      if (response.data.message.toString().includes('Token expired')) {
        localStorage.removeItem('credentials')
        window.location.href = '/login'
      } else {
        Swal.fire('Error', response.data.message.toString(), 'error')
        return customResponse.badResponse(response.data.message)
      }
    }

    return customResponse.setResponse(response.data.content, false, [''])
  } catch (error) {
    console.log(error)
    return customResponse.badResponse(['error'])
  }
}

const useCustom = async <T>(route: string, method: string, data: T, api: boolean): Promise<CustomResponse<T>> => {
  const customResponse = new CustomResponse<T>()
  const currentApi = api ? billingApi : dashboardApi
  try {
    const response = await axios({
      headers: {
        Authorization: `bearer ${getCredentials()}`,
      },
      method: method,
      url: `${currentApi}${route}`,
      data: data,
    })
    if (response?.data?.error) {
      if (response.data.message.toString().includes('Token expired')) {
        localStorage.removeItem('credentials')
        window.location.href = '/login'
      } else {
        Swal.fire('Error', response.data.message.toString(), 'error')
        return customResponse.badResponse(response.data.message)
      }
    }

    return customResponse.setResponse(response.data.content, false, [''])
  } catch (error) {
    const currentapi2 = api ? publicBillingApi : publicDashboardApi
    const response2 = await axios({
      headers: {
        Authorization: `bearer ${getCredentials()}`,
      },
      method: method,
      url: `${currentapi2}${route}`,
      data: data,
    })
    if (response2.data.error) {
      Swal.fire('Error', response2.data.message.toString(), 'error')
      return customResponse.badResponse(response2.data.message)
    } else {
      return customResponse.setResponse(response2.data.content, false, [''])
    }
  }
}

export { useGetList, usePost, useDelete, useGet, useCustom, usePatch, usePostWithResponse, commandBillApi }
