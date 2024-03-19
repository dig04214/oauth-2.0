import React, {useState} from 'react'
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { enrollApp } from '../../../_actions/client_actions';

function EnrollPage(props) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [ClientName, setClientName] = useState("")
  const [RedirectURL, setRedirectURL] = useState("")
  const [ServiceID, setServiceID] = useState("")

  const onClientNameHandler = (event) => {
    setClientName(event.currentTarget.value)
  }
  const onRedirectURLHandler = (event) => {
    setRedirectURL(event.currentTarget.value)
  }
  const onServiceIDHandler = (event) => {
    setServiceID(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    event.preventDefault()
    let body = {
      client_name: ClientName,
      redirect_url: RedirectURL,
      service_id: ServiceID
    }
    dispatch(enrollApp(body))
      .then(response => {
        if (response.payload.success) {
          navigate('/app')
        } else {
          alert('Failed to enroll app')
        }
      })


  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      
      <form style={{display: 'flex', flexDirection: 'column'}}
        onSubmit={onSubmitHandler}>
        <label>Client Name</label>
        <input type="text" value={ClientName} onChange={onClientNameHandler} autoComplete='off'/>
        <label>Redirect URL</label>
        <input type="email" value={RedirectURL} onChange={onRedirectURLHandler} autoComplete='off'/>
        <label>Service ID</label>
        <input type="text" value={ServiceID} onChange={onServiceIDHandler} autoComplete='off'/>
        
        <br></br>
        <button>
          Enroll
        </button>

      </form>

    </div>
  
  )}
}

export default EnrollPage