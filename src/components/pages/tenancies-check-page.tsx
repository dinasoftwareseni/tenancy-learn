import { useParams } from 'react-router'
import { cx } from '@linaria/core'
import {
  elFlex,
  elWFull,
  elFlexColumn,
  elHFull,
  FlexContainer,
  Loader,
  PageContainer,
  Table,
  Title,
  RowProps,
  BodyText,
  Modal,
  Button,
  Select,
  ProgressBarContainer,
  ProgressBarInner,
  ProgressBarItem,
  elProgressBarItemDarkBlue,
  elProgressBarItemMediumBlue,
  elProgressBarItemLightBlue,
  elProgressBarItemLightestBlue,
  elProgressBarItemOrange,
  ProgressBarLabel,
  elProgressBarLabelLeft,
  elMy7,
  TableHeadersRow,
  TableHeader,
  TableRow,
  TableCell,
  ButtonGroup,
} from '@reapit/elements'
import React, { useState } from 'react'
import { useGetTenancyChecks } from '../../platform-api/tenancies-api'
import { TENANCIES_STATUS } from '../../constants/tenancy-status'
import { usePatchTenancyCheck } from '../../platform-api/tenancies-check-update-api'
import { useModal } from '@reapit/elements'

export default (): React.ReactNode => {
  const { tenancyId } = useParams<{ tenancyId: string }>()
  const tenanciesCheckResult = useGetTenancyChecks(tenancyId)
  console.log(tenancyId)
  console.log(tenanciesCheckResult.data)

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const { updateStatus } = usePatchTenancyCheck()

  const handleUpdateStatus = async (checkId: any, _eTag: any, status: any) => {
    await updateStatus({
      tenancyId: tenancyId,
      checkId: checkId,
      _eTag: _eTag,
      status: status,
    })

    console.log(tenancyId, checkId, _eTag, status)
  }

  const totalStatus = tenanciesCheckResult.data?._embedded?.map((x) => x.status).length
  const countOfCompletedStatus = tenanciesCheckResult.data?._embedded
    ?.map((x) => x.status)
    ?.filter((x) => x === 'completed').length

  const { Modal: ModalComponent, openModal, closeModal } = useModal('docs-root')
  const [indexExpandedRow, setIndexExpandedRow] = useState(0)

  return (
    <FlexContainer isFlexAuto>
      <PageContainer className={elHFull}>
        <Title>Tenancy Progression Checks</Title>
        <FlexContainer isFlexAuto className={cx(elMy7)}>
          <ProgressBarContainer>
            <ProgressBarInner
              style={{
                width: '50%',
                transitionDuration: '1s',
              }}
            >
              <ProgressBarItem className={elProgressBarItemDarkBlue} />
              <ProgressBarItem className={elProgressBarItemMediumBlue} />
              <ProgressBarItem className={elProgressBarItemLightBlue} />
              <ProgressBarItem className={elProgressBarItemLightestBlue} />
              <ProgressBarItem className={elProgressBarItemOrange} />
            </ProgressBarInner>
            <ProgressBarLabel className={elProgressBarLabelLeft}>
              {countOfCompletedStatus}/{totalStatus} Completed
            </ProgressBarLabel>
          </ProgressBarContainer>
        </FlexContainer>

        {tenanciesCheckResult.isFetching ? (
          <Loader label={`${tenanciesCheckResult.isLoading ? 'Please Wait' : ' '}`} />
        ) : (
          <>
            <div className={cx(elFlex, elFlexColumn)}>
              <Table
                indexExpandedRow={indexExpandedRow}
                setIndexExpandedRow={setIndexExpandedRow}
                className={cx(elWFull)}
                numberColumns={5}
                rows={tenanciesCheckResult.data?._embedded?.map(
                  ({ id, description, status, _eTag }): RowProps => ({
                    cells: [
                      {
                        label: 'Check Id',
                        value: id,
                        narrowTable: {
                          showLabel: true,
                        },
                      },
                      {
                        label: 'Description',
                        value: description,
                        narrowTable: {
                          showLabel: true,
                        },
                      },
                      {
                        label: 'eTag',
                        value: _eTag,
                        narrowTable: {
                          showLabel: true,
                        },
                      },
                      {
                        label: 'Status',
                        value: status,
                        narrowTable: {
                          showLabel: true,
                        },
                        children: (
                          <>
                            <Select
                              defaultValue={status}
                              onChange={() => handleUpdateStatus(id, _eTag, status)}
                              // value={status}
                            >
                              {TENANCIES_STATUS.map((sta) => {
                                return (
                                  <option key={sta.value} value={sta.value}>
                                    {sta.label}
                                  </option>
                                )
                              })}
                            </Select>
                          </>
                        ),
                      },
                    ],
                    ctaContent: {
                      icon: 'linkSystem',
                      headerContent: 'Document',
                      onClick: () => setModalIsOpen(!modalIsOpen),
                    },
                  }),
                )}
              />
              <Modal isOpen={modalIsOpen} onModalClose={() => setModalIsOpen(!modalIsOpen)} title="Document Management">
                <Table>
                  <TableHeadersRow>
                    <TableHeader>Type</TableHeader>
                    <TableHeader>Filename</TableHeader>
                    <TableHeader>Modified</TableHeader>
                  </TableHeadersRow>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </Table>
                <BodyText className={cx(elMy7)}>Rename Info :</BodyText>
                <FlexContainer isFlexJustifyEnd>
                  <ButtonGroup>
                    <Button intent="low" onClick={openModal}>
                      Close
                    </Button>
                    <Button intent="primary">Add</Button>
                  </ButtonGroup>
                </FlexContainer>
              </Modal>

              <ModalComponent title="Document Upload">
                <BodyText>Upload your document</BodyText>
                <FlexContainer isFlexJustifyCenter>
                  <Button intent="secondary" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button intent="secondary">Save</Button>
                </FlexContainer>
              </ModalComponent>
            </div>
          </>
        )}
      </PageContainer>
    </FlexContainer>
  )
}
