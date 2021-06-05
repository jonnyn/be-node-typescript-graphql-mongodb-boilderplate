/* eslint-disable @typescript-eslint/no-explicit-any */
import urljoin from 'url-join'
import CONFIG from 'utils/config'
import api from './api'

const toCompany = (data: { id: string | number; name: string; companyLogoUri: string }) => ({
  id: data.id,
  name: data.name,
  logo: data.companyLogoUri,
})

const coreApi = async (endpoint: string, options: any = {}) => {
  const { URL, TOKEN } = CONFIG.CORE_API
  const joinedUrl = urljoin(URL, endpoint)

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${TOKEN}`,
  }

  return api(joinedUrl, { ...options, headers })
}

const getCompany = async (id: string | number): Promise<any> => {
  const data = await coreApi(`/companies/${id}`)

  return toCompany(data)
}


export default {
  getCompany,
}
