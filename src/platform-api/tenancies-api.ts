import axios from '../axios/axios'
import { TenancyModelPagedResult } from '@reapit/foundations-ts-definitions'
import { useQuery, QueryKey } from 'react-query'
import { URLS } from '../constants/api'
import { useGetApplicantById, getApplicantById } from '../platform-api/applicant-api'

//=======================Tenancy list===========================

interface TenancyApplicantModal extends TenancyModelPagedResult {
  applicantName: string | undefined
}

export const getTenancyList = async () => {
  try {
    const result = await axios.get(`${URLS.TENANCIES}/?embed=property&status=arranging`)
    if (result.status < 400) {
      const data = result.data
      // data._embedded = await Promise.all(
      //   data?._embedded?.map(async (item) => {
      //     let applicantName = ''
      //     if (item?.applicantId) {
      //       const aplicant = await getApplicantById(item?.applicantId)
      //       applicantName = aplicant ? aplicant?.related[0]?.name : ''
      //     }
      //     return { ...item, applicantName }
      //   }),
      // )
      const embededdArr: TenancyModelPagedResult[] = []
      for (let i = 0; i < data._embedded.length; i++) {
        const item = data._embedded[i]
        let applicantName = ''
        if (item?.applicantId) {
          const aplicant = await getApplicantById(item?.applicantId)
          applicantName = aplicant ? aplicant?.related[0]?.name : ''
        }
        embededdArr.push({ ...item, applicantName })
      }
      data._embedded = embededdArr

      console.log('embededdArr', embededdArr)

      return result.data
    }
  } catch (error) {
    console.error(error)
  }
}

export const useGetTenancyList = (pageNumber = 1) => {
  const getTenancyListResult = useQuery<TenancyApplicantModal, Error, TenancyApplicantModal, QueryKey>(
    ['getTenancy', pageNumber],
    () => getTenancyList(),
    {
      onError: (error) => {
        throw new Error(error.message)
      },
    },
  )
  return getTenancyListResult
}

//=======================Tenancy Check===========================
export const getTenancyChecks = async (tenancyId: string) => {
  try {
    const result = await axios.get(`${URLS.TENANCIES}/${tenancyId}/checks`)
    if (result.status < 400) {
      return result.data
    }

    console.log(result.data)
  } catch (error) {
    console.error(error)
  }
}

export const useGetTenancyChecks = (tenancyId: string) => {
  const getTenancyCheckResult = useQuery<TenancyModelPagedResult, Error, TenancyModelPagedResult, QueryKey>(
    ['getTenancyChecks', tenancyId],
    () => getTenancyChecks(tenancyId),
    {
      onError: (error) => {
        throw new Error(error.message)
      },
    },
  )

  return getTenancyCheckResult
}
