import candidatesReducer from './candidates/reducers'
import { configureStore } from '@reduxjs/toolkit'
import jobPositionsReducer from './jobPositions/reducers'
import logger from 'redux-logger'
import settingReducer from './settings/reducers'
import tourReducer from './tour/reducers'
import usersReducer from './users/reducers'
import administrationsReducer from './administrations/reducers'

const store = configureStore({
  reducer: {
    candidates: candidatesReducer,
    tour: tourReducer,
    jobPositions: jobPositionsReducer,
    users: usersReducer,
    settings: settingReducer,
    administrations: administrationsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
})

export default store
