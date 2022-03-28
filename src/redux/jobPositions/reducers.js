import { createReducer } from '@reduxjs/toolkit'

import {
  getJobPositionListAct,
  postJobPositionAct,
  getJobPositionDetailsAct,
  putJobPositionAct,
  deleteJobPositionAct,
  resetJobPositionStateAct,
} from './actions'

const initialState = {
  loading: false,
  entity: {},
  entities: [],
  meta: {},
  errors: {},
}

const jobPositionsReducer = createReducer(initialState, (builder) => {
  builder
    // RESET job position state
    .addCase(resetJobPositionStateAct, (state) => {
      Object.assign(state, initialState)
    })

    // GET job position list
    .addCase(getJobPositionListAct.pending, (state) => {
      state.loading = true
    })
    .addCase(getJobPositionListAct.fulfilled, (state, actions) => {
      state.loading = false
      state.entities = actions?.payload?.data
      state.meta = actions?.payload?.meta
    })
    .addCase(getJobPositionListAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // POST job position
    .addCase(postJobPositionAct.pending, (state) => {
      state.loading = true
    })
    .addCase(postJobPositionAct.fulfilled, (state, actions) => {
      state.loading = false
      state.entity = actions.payload
    })
    .addCase(postJobPositionAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // GET job position details
    .addCase(getJobPositionDetailsAct.pending, (state) => {
      state.loading = true
    })
    .addCase(getJobPositionDetailsAct.fulfilled, (state, actions) => {
      state.loading = false
      state.entity = actions.payload
    })
    .addCase(getJobPositionDetailsAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // PUT job position
    .addCase(putJobPositionAct.pending, (state) => {
      state.loading = true
    })
    .addCase(putJobPositionAct.fulfilled, (state, actions) => {
      state.loading = false
      state.entity = actions.payload
    })
    .addCase(putJobPositionAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // Delete Job Position
    .addCase(deleteJobPositionAct.pending, (state) => {
      state.loading = true
    })
    .addCase(deleteJobPositionAct.fulfilled, (state, actions) => {
      state.loading = false
    })
    .addCase(deleteJobPositionAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })
})

export default jobPositionsReducer
