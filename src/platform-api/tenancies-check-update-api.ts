import axios from '../axios/axios'
import { UpdateTenancyCheckModel } from '@reapit/foundations-ts-definitions'
import { useMutation, useQuery, QueryKey } from 'react-query'
import { URLS } from '../constants/api'

export interface UpdateTenancyCheckParams extends UpdateTenancyCheckModel {
  tenancyId: string
  checkId: string
  _eTag: string
}

export const patchTenancyCheck = async (params: UpdateTenancyCheckParams): Promise<string> => {
  const { tenancyId, checkId, _eTag, ...bodyParams } = params

  await axios.patch(`${URLS.TENANCIES}/${tenancyId}/checks/${checkId}`, bodyParams, {
    headers: {
      'If-Match': _eTag,
    },
  })
  return tenancyId
}

export const usePatchTenancyCheck = () => {
  const result = useMutation((params: UpdateTenancyCheckParams) => {
    return patchTenancyCheck(params)
  })
  return {
    ...result,
    updateTenancyCheck: result.mutateAsync,
  }
}
