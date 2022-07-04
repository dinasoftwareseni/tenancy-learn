import { cx } from '@linaria/core'
import {
  Button,
  ButtonGroup,
  InputWrapFull,
  InputGroup,
  elWFull,
  elFlexJustifyCenter,
  elFlex,
  elFlexColumn,
  elHFull,
  FlexContainer,
  Loader,
  PageContainer,
  Table,
  Title,
  FormLayout,
  InputWrap,
} from '@reapit/elements'
import React from 'react'
import { useHistory } from 'react-router'
import { useGetTenancyList } from '../../platform-api/tenancies-api'
import { useGetApplicantById } from '../../platform-api/applicant-api'
// import { useParams } from 'react-router'

type SearchPageProps = {
  controlsButton?: React.ReactNode
}

export const SearchPage: React.FC<SearchPageProps> = ({ controlsButton }) => {
  const history = useHistory()

  const tenanciesListResult = useGetTenancyList()

  // const { applicantId } = useParams<{ applicantId: string }>()
  // console.log('applicantId:', applicantId)
  // const applicantResult = useGetApplicantById(applicantId)
  // console.log('applicant: ', applicantResult?.data?.related)

  return (
    <FlexContainer isFlexAuto>
      <PageContainer className={elHFull}>
        <Title>Tenancies Search</Title>
        <FlexContainer className={cx(elWFull)}>
          <form className={cx(elWFull, elFlexJustifyCenter)} data-testid="form">
            <FormLayout hasMargin>
              <InputWrap>
                <InputGroup
                  label="Search by name"
                  type="text"
                  id="name"
                  placeholder="Firstname or Surname"
                  data-testid={'test.input.searchName'}
                  icon="searchSystem"
                />
              </InputWrap>
              <InputWrap>
                <InputGroup
                  label="Search by address"
                  type="text"
                  id="address"
                  placeholder="Streetname, Village, Town or Postcode"
                  data-testid={'test.input.searchAddress'}
                  icon="searchSystem"
                />
              </InputWrap>
              <InputWrapFull>
                <ButtonGroup alignment="left">
                  <Button type="reset" intent="low" data-testid={'test.button.reset'}>
                    Reset form
                  </Button>
                  <Button type="submit" intent="primary" chevronRight data-testid={'test.button.search'}>
                    Search
                  </Button>
                </ButtonGroup>
              </InputWrapFull>
            </FormLayout>
          </form>
        </FlexContainer>
        {tenanciesListResult.isFetching ? (
          <Loader label={`${tenanciesListResult.isLoading ? 'Please Wait' : ' '}`} />
        ) : (
          <div className={cx(elFlex, elFlexColumn)}>
            <Table
              numberColumns={6}
              rows={tenanciesListResult.data?._embedded?.map(({ id, negotiatorId, propertyId, applicantId }) => {
                // const applicantName = applicantResult.data?.related?.map((x) => x.name)
                // console.log('applicantName', applicantName)
                // const applicantResult = useGetApplicantById(applicantId!)

                // if(applicantResult != undefined){
                //   console.log('applicantResult', applicantResult.data?.related[0]?.name
                // }

                // const applicantName = applicantResult.data?.related[0].name

                // console.log(applicantId)

                return {
                  cells: [
                    {
                      label: 'ID',
                      value: id?.length ? id : '-',
                      narrowTable: {
                        showLabel: true,
                      },
                    },
                    {
                      label: 'Negotiator ID',
                      value: negotiatorId,
                      narrowTable: {
                        showLabel: true,
                      },
                    },
                    {
                      label: 'Property ID',
                      value: propertyId,
                      narrowTable: {
                        showLabel: true,
                      },
                    },
                    {
                      label: 'Applicant ID',
                      value: applicantId,
                      narrowTable: {
                        showLabel: true,
                      },
                    },
                    {
                      label: 'Applicant Name',
                      value: 'tes',
                      narrowTable: {
                        showLabel: true,
                      },
                    },
                  ],
                  ctaContent: {
                    icon: 'editSystem',
                    headerContent: <div className="">Checks</div>,
                    onClick: () => history.push(`/tenancies-check/${id}`),
                  },
                }
              })}
            />
          </div>
        )}
      </PageContainer>
    </FlexContainer>
  )
}

export default SearchPage
