import axios from '../axios/axios'
import { TenancyModelPagedResult } from '@reapit/foundations-ts-definitions'
import { useQuery, QueryKey } from 'react-query'
import { URLS } from '../constants/api'
import { useGetApplicantById } from '../platform-api/applicant-api'

//=======================Tenancy list===========================

interface TenancyApplicantModal extends TenancyModelPagedResult {
  applicantName: string | undefined
}

export const getTenancyList = async () => {
  try {
    const result = await axios.get(`${URLS.TENANCIES}/?embed=property&status=arranging`)
    if (result.status < 400) {
      return result.data
    }

    console.log(result.data)
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

  console.log('Data Tenancies', getTenancyListResult.data?._embedded)

  //Dont Delete this source, ini ditampilkan di search-page applicantName
  // getTenancyListResult.data?._embedded = getTenancyListResult.data?._embedded?.map((x) => {
  //   const resultApplicant = useGetApplicantById(x.applicantId!)

  //   return { ...x, applicantName: resultApplicant?.data?.related[0]?.name }
  // })

  const related = getTenancyListResult.data?._embedded?.map((x) => {
    console.log('ApplicantId', x.applicantId)
    // const resultApplicant = useGetApplicantById(x.applicantId!)

    // console.log('resultApplicant', resultApplicant)
  })

  console.log(related)

  // return related
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
