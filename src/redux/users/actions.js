import { createAsyncThunk } from '@reduxjs/toolkit'

import { getUserList, postUser } from '../../services/usersSvc'

import { GET_USER_LIST, POST_USER } from './constants'

export const getUserListAct = createAsyncThunk(
  GET_USER_LIST,
  async (params) => {
    try {
      const resp = await getUserList(params)
      return resp
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const postUserAct = createAsyncThunk(POST_USER, async (payload) => {
  try {
    const resp = await postUser(payload)
    return resp.data
  } catch (error) {
    return Promise.reject(error?.data?.error)
  }
})
