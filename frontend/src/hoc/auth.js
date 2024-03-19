/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
//import Axios from "axios";
import { auth } from "../_actions/user_action";
import { useNavigate } from "react-router-dom";

export default function (SpecificComponent, option, adminRoute = null) {
  // option
  // null => 아무나 출입이 가능한 페이지
  // true => 로그인한 유저만 출입이 가능한 페이지
  // false => 로그인한 유저는 출입 불가능한 페이지
  
  function AuthenticationCheck(props) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
      
      dispatch(auth()).then(res => {
        // 로그인 하지 않은 상태
        if (!res.payload.isAuth) {
          if (option) {
            navigate("/login");
          }
        }
        // 로그인 한 상태
        else {
          // 어드민이 아닌데 어드민 페이지로 가려고 할 때
          if (adminRoute && res.payload.message.admin === 0) {
            navigate("/")
          }
          else {
            // 로그인한 상태로는 접근 불가능한 페이지
            if (option === false) {
              navigate("/")
            }
          }
        }
      })
    },[dispatch, navigate])
    return <SpecificComponent {...props} />
  }

  return <AuthenticationCheck />
}