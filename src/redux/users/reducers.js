import { createReducer } from '@reduxjs/toolkit'

import { getUserListAct, postUserAct } from './actions'

const initialState = {
  loading: false,
  entity: {},
  entities: [],
  meta: {},
  errors: {},
}

const userReducer = createReducer(initialState, (builder) => {
  builder
    // GET user list
    .addCase(getUserListAct.pending, (state) => {
      state.loading = true
    })
    .addCase(getUserListAct.fulfilled, (state, actions) => {
      state.loading = false
      state.entities = actions?.payload?.data
      state.meta = actions?.payload?.meta
    })
    .addCase(getUserListAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // POST user
    .addCase(postUserAct.pending, (state) => {
      state.loading = true
    })
    .addCase(postUserAct.fulfilled, (state, actions) => {
      state.loading = false
      state.entity = actions.payload
    })
    .addCase(postUserAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })
})

export default userReducer
