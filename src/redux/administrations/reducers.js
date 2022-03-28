import { createReducer } from '@reduxjs/toolkit'

import { getAdministrationCandidateListAct } from './actions'

const initialState = {
  loading: false,
  entity: {},
  entities: [],
  candidateEntity: {},
  candidateEntities: [],
  candidateMeta: {},
  errors: {},
}

const userReducer = createReducer(initialState, (builder) => {
  builder
    // GET administration candidate list
    .addCase(getAdministrationCandidateListAct.pending, (state) => {
      state.loading = true
    })
    .addCase(getAdministrationCandidateListAct.fulfilled, (state, actions) => {
      state.loading = false
      state.candidateEntities = actions?.payload?.data
      state.candidateMeta = actions?.payload?.meta
    })
    .addCase(getAdministrationCandidateListAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })
})

export default userReducer
