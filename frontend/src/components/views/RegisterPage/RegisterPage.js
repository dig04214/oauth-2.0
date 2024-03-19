import React, { useState } from 'react'
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { registerUser } from '../../../_actions/user_action';

function RegisterPage(props) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [ID, setID] = useState("")
  const [Password, setPassword] = useState("")
  const [Name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const onIDHandler = (event) => {
    setID(event.currentTarget.value)
  }
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }
  const onNameHandler = (event) => {
    setName(event.currentTarget.value)
  }
  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }
  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value)
  }


  const onSubmitHandler = (event) => {
    event.preventDefault()
    if(Password !== confirmPassword){
      return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
    }

    let body = {
      id: ID,
      pw: Password,
      name: Name,
      email: email,
    }
    dispatch(registerUser(body))
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
      
      <form style={{display: 'flex', flexDirection: 'column'}}
        onSubmit={onSubmitHandler}>
        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler} autoComplete='off'/>
        <label>Email</label>
        <input type="email" value={email} onChange={onEmailHandler} autoComplete='off'/>
        <label>ID</label>
        <input type="text" value={ID} onChange={onIDHandler} autoComplete='off'/>
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} autoComplete='off'/>
        <label>Confirm Password</label>
        <input type="password" value={confirmPassword} onChange={onConfirmPasswordHandler} autoComplete='off'/>
        
        
        <br></br>
        <button>
          Register
        </button>

      </form>

    </div>
  )
}

export default RegisterPage