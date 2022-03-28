import React from 'react'
import { Table, Button } from 'react-bootstrap'
import { EditOutlined, VisibilityOutlined, Description } from '@material-ui/icons'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import {
  Checkbox,
  IconButton,
  Button as MaterialButton,
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { downloadCandidateAttachment } from 'src/services/candidatesSvc'

function CandidateListTableForOperationsUser({
  loading,
  entities,
  styles,
  handleClickedContractValidated,
  handleClickedPassedMedical,
  allowEdit,
}) {
  const { t } = useTranslation()
  const { push } = useHistory()

  return (
    <Table responsive>
      <thead>
        <tr>
          <th scope="col">{t('applicationData.idNumber')}</th>
          <th scope="col">{t('dashboard.name')}</th>
          <th scope="col">{t('manageApplicants.phoneNumber')}</th>
          <th scope="col">{t('manageApplicants.email')}</th>
          <th scope="col">{t('manageApplicants.passedInterview')}</th>
          <th scope="col">{t('manageApplicants.contractDocument')}</th>
          <th scope="col">{t('manageApplicants.contractValidated')}</th>
          <th scope="col">{t('manageApplicants.passedMedical')}</th>
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
                  <td>{it.email || '-'}</td>
                  <td>
                    <div className="table-btns">
                      <Checkbox
                        disabled
                        defaultChecked={!!it?.passedInterview}
                        color="primary"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="table-btns">
                      <Button
                        variant="link"
                        onClick={() => downloadCandidateAttachment(it?.contractDocument)}
                        disabled={!it?.contractDocument?.filename}
                        className={
                          !it?.contractDocument?.filename && 'text-muted'
                        }
                      >
                        <Description />
                      </Button>
                    </div>
                  </td>
                  <td>
                    <div
                      className="table-btns"
                      style={{ verticalAlign: 'middle' }}
                    >
                      <MaterialButton
                        variant="contained"
                        size="small"
                        className={cx(styles.tinnyButton, it?.contractValidated === true ? styles.success : styles.inherit, it?.contractValidated === true && "font-weight-bold")}
                        onClick={() =>
                          handleClickedContractValidated({
                            id: it?.id,
                            value: true,
                          })
                        }
                      >
                        {t('common.yes')}
                      </MaterialButton>
                      <MaterialButton
                        variant="contained"
                        size="small"
                        className={cx(styles.tinnyButton, it?.contractValidated === false ? styles.danger : styles.inherit, it?.contractValidated === false && "font-weight-bold")}
                        onClick={() =>
                          handleClickedContractValidated({
                            id: it?.id,
                            value: false,
                          })
                        }
                      >
                        {t('common.no')}
                      </MaterialButton>
                    </div>
                  </td>
                  {it?.medicalExaminationPassed !== null ? (
                    <td
                      style={{ verticalAlign: 'middle' }}
                    >
                      {it?.medicalExaminationPassed === true
                        ? t('common.yes')
                        : t('common.no')}
                    </td>
                  ) : (
                    <td>
                      <div
                        className="table-btns"
                        style={{ verticalAlign: 'middle' }}
                      >
                        <MaterialButton
                          variant="contained"
                          color="primary"
                          size="small"
                          className={cx(styles.tinnyButton, styles.primary)}
                          onClick={() =>
                            handleClickedPassedMedical({
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
                            handleClickedPassedMedical({
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

CandidateListTableForOperationsUser.propTypes = {
  loading: PropTypes.bool.isRequired,
  entities: PropTypes.array.isRequired,
  styles: PropTypes.any.isRequired,
  handleClickedContractValidated: PropTypes.func.isRequired,
  handleClickedPassedMedical: PropTypes.func.isRequired,
  allowEdit: PropTypes.func.isRequired.isRequired,
}

export default CandidateListTableForOperationsUser
