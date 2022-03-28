import { createAsyncThunk } from '@reduxjs/toolkit'

import { getAdministrationCandidateList } from '../../services/administrationsSvc'

import { GET_ADMINISTRATION_CANDIDATE_LIST } from './constants'

export const getAdministrationCandidateListAct = createAsyncThunk(
  GET_ADMINISTRATION_CANDIDATE_LIST,
  async ({ administrationId, params }) => {
    try {
      const resp = await getAdministrationCandidateList(
        administrationId,
        params,
      )
      return resp
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)
