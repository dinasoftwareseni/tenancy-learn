import axios from '../axios/axios'
import { ApplicantModel } from '@reapit/foundations-ts-definitions'
import { useQuery, QueryKey } from 'react-query'
import { URLS } from '../constants/api'

export const getApplicantById = async (applicantId: string) => {
  console.log(applicantId)
  try {
    const result = await axios.get(`${URLS.APPLICANT}/${applicantId}`)
    if (result.status < 400) {
      return result.data
    }

    console.log(result.data)
  } catch (error) {
    console.error(error)
  }
}

export const useGetApplicantById = (applicantId: string) => {
  const getApplicantResult = useQuery<ApplicantModel, Error, ApplicantModel, QueryKey>(
    ['getApplicantById'],
    () => getApplicantById(applicantId),
    {
      onError: (error) => {
        throw new Error(error.message)
      },
    },
  )

  console.log('applicantId', getApplicantResult)

  return getApplicantResult
}
