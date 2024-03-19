import React, { useState } from 'react'
//import Axios from 'axios';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { loginUser } from '../../../_actions/user_action';

function LoginPage(props) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [ID, setID] = useState("")
  const [Password, setPassword] = useState("")

  const onIDHandler = (event) => {
    setID(event.currentTarget.value)
  }
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }
  const onSubmitHandler = (event) => {
    event.preventDefault();
    let body = {
      id: ID,
      pw: Password
    }

    dispatch(loginUser(body))
    .then(res => {
      if (res.payload.status === 200) {
        navigate('/')
      }
      else{ alert('Error') }
    })
  }
  const onClickHandler = (event) => {
    event.preventDefault();
    navigate('/register')
  }



  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      
      <form style={{display: 'flex', flexDirection: 'column'}}
        onSubmit={onSubmitHandler}>
        <label>ID</label>
        <input type="text" value={ID} onChange={onIDHandler} autoComplete='on'/>
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} autoComplete='on'/>
        <br></br>
        <button>
          Login
        </button>
        <button onClick={onClickHandler}>
          register
        </button>

      </form>

    </div>
  )
}

export default LoginPage