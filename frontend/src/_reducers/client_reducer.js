import { ENROLL_APP } from '../_actions/types'

export default function client(state = {}, action) {
  switch (action.type) {
    case ENROLL_APP:
      return { ...state, enrollApp: action.payload }
    default:
      return state
  }
}