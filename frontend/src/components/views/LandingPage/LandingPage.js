import React from 'react'
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { logoutUser } from '../../../_actions/user_action';

function LandingPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onClickHandler = (event) => {
    event.preventDefault();
    dispatch(logoutUser())
    .then(res => {
      if (res.payload.status === 200) {
        navigate('/login')
      }
      else{ alert('Error') }
    })
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <h2>시작</h2>

      <button onClick={onClickHandler}>
        logout
      </button>
      </div>
  )
}

export default LandingPage