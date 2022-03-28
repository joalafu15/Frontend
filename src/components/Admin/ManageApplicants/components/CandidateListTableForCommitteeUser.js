import React from 'react'
import { Table } from 'react-bootstrap'
import { EditOutlined, VisibilityOutlined, DateRange } from '@material-ui/icons'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import i18next from 'i18next'

import { IconButton, Button as MaterialButton } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap'

import { getFormatDateObject } from 'src/utils/dateUtils'

function CandidateListTableForCommitteeUser({
  loading,
  entities,
  styles,
  handleClickedPassedInterview,
  handleClickedFileMatched,
  allowEdit,
}) {
  const { t } = useTranslation()
  const { push } = useHistory()
  const isArabic = i18next.language === 'ar'

  return (
    <Table responsive>
      <thead>
        <tr>
          <th scope="col">{t('applicationData.idNumber')}</th>
          <th scope="col">{t('dashboard.name')}</th>
          <th scope="col">{t('manageApplicants.phoneNumber')}</th>
          <th scope="col">{t('manageApplicants.interviewSlot')}</th>
          <th scope="col">{t('manageApplicants.gpa')}</th>
          <th scope="col">{t('manageApplicants.qiyasScore')}</th>
          <th scope="col">{t('manageApplicants.qiyasSubjectScore')}</th>
          <th scope="col">{t('manageApplicants.qualifiedSectorName')}</th>
          <th scope="col">{t('manageApplicants.filesMatched')}</th>
          <th scope="col">{t('manageApplicants.passedInterview')}</th>
          <th scope="col">{t('manageApplicants.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {(() => {
          if (loading) {
            return (
              <tr>
                <td colSpan="9">Loading...</td>
              </tr>
            )
          }

          return entities?.length > 0 ? (
            entities.map((it, idx) => {
              return (
                <tr key={it?.nationalIdNumber + idx}>
                  <th scope="row">{it.nationalIdNumber}</th>
                  <td>{it?.fullName}</td>
                  <td>{it.phoneNumber}</td>
                  <td>
                    {}
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-top">
                          {it?.interviewTimeSlot?.startDateTime ? (
                            <div>
                              {t('manageApplicants.interviewSlotTooltip', {
                                startDate: getFormatDateObject(
                                  it?.interviewTimeSlot?.startDateTime,
                                ).date,
                                startTime: getFormatDateObject(
                                  it?.interviewTimeSlot?.startDateTime,
                                ).time,
                                endDate: getFormatDateObject(
                                  it?.interviewTimeSlot?.endDateTime,
                                ).date,
                                endTime: getFormatDateObject(
                                  it?.interviewTimeSlot?.endDateTime,
                                ).time,
                                interpolation: { escapeValue: false },
                              })}
                            </div>
                          ) : (
                            t('manageApplicants.interviewSlotNotFound')
                          )}
                        </Tooltip>
                      }
                    >
                      <Button
                        variant="link"
                        className={
                          !it?.interviewTimeSlot?.startDateTime && 'text-muted'
                        }
                      >
                        <DateRange />
                      </Button>
                    </OverlayTrigger>
                  </td>
                  <td>{it?.gpa}</td>
                  <td>{it?.qiyasScore}</td>
                  <td>{it?.qiyasSubjectScore}</td>
                  <td>
                    {it?.sector && it?.sector[isArabic ? 'name' : 'name_en']}
                  </td>
                  {it?.filesMatched !== null ? (
                    <td
                      style={{ verticalAlign: 'middle', textAlign: 'center' }}
                    >
                      {it?.filesMatched === true
                        ? t('common.yes')
                        : t('common.no')}
                    </td>
                  ) : (
                    <td>
                      <div
                        className="table-btns"
                        style={{ verticalAlign: 'middle', textAlign: 'center' }}
                      >
                        <MaterialButton
                          variant="contained"
                          color="primary"
                          size="small"
                          className={cx(styles.tinnyButton, styles.primary)}
                          onClick={() => handleClickedFileMatched(it?.id, true)}
                        >
                          {t('common.yes')}
                        </MaterialButton>
                        <MaterialButton
                          variant="contained"
                          color="inherit"
                          size="small"
                          className={cx(styles.tinnyButton, styles.inherit)}
                          onClick={() =>
                            handleClickedFileMatched(it?.id, false)
                          }
                        >
                          {t('common.no')}
                        </MaterialButton>
                      </div>
                    </td>
                  )}

                  {it?.passedInterview !== null ? (
                    <td
                      style={{ verticalAlign: 'middle', textAlign: 'center' }}
                    >
                      {it?.passedInterview === true
                        ? t('common.yes')
                        : t('common.no')}
                    </td>
                  ) : (
                    <td>
                      <div
                        className="table-btns"
                        style={{ verticalAlign: 'middle', textAlign: 'center' }}
                      >
                        <MaterialButton
                          variant="contained"
                          color="primary"
                          size="small"
                          className={cx(styles.tinnyButton, styles.primary)}
                          onClick={() =>
                            handleClickedPassedInterview({
                              id: it?.id,
                              value: true,
                            })
                          }
                        >
                          {t('common.yes')}
                        </MaterialButton>
                        <MaterialButton
                          variant="contained"
                          color="inherit"
                          size="small"
                          className={cx(styles.tinnyButton, styles.inherit)}
                          onClick={() =>
                            handleClickedPassedInterview({
                              id: it?.id,
                              value: false,
                            })
                          }
                        >
                          {t('common.no')}
                        </MaterialButton>
                      </div>
                    </td>
                  )}

                  <td>
                    <div className="table-btns">
                      <IconButton
                        color="inherit"
                        size="small"
                        component="span"
                        aria-label={t('common.edit')}
                        onClick={() => push(`/admin/candidates/${it?.id}`)}
                      >
                        {allowEdit ? (
                          <EditOutlined fontSize="small" />
                        ) : (
                          <VisibilityOutlined fontSize="small" />
                        )}
                      </IconButton>
                    </div>
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan="9">No data available</td>
            </tr>
          )
        })()}
      </tbody>
    </Table>
  )
}

CandidateListTableForCommitteeUser.propTypes = {
  loading: PropTypes.bool.isRequired,
  entities: PropTypes.array.isRequired,
  styles: PropTypes.any.isRequired,
  handleClickedPassedInterview: PropTypes.func,
  handleClickedFileMatched: PropTypes.func,
  allowEdit: PropTypes.bool,
}

export default CandidateListTableForCommitteeUser
