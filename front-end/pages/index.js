import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'

import langTrans from './../components/i18n';
import Lang from '../components/lang';

// import gql from 'graphql-tag';
// import client from './apollo-client';
import Logo from '../components/logo';
import Image from 'next/image'

// export const GET_USERS = gql`
//   query getUsers {
//     users @rest(type: "Users", path: "users/login") {
//       data
//     }
// }`;

export default function Login(props) {
  const [userName, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setloginMessage] = useState("");
  const { locale, locales, defaultLocale, asPath } = useRouter();
  const { login, a_forgot_pass, btn_login } = langTrans[locale];
  const router = useRouter()


  const userLogin = async (e) => {

    e.preventDefault();
    // const { data, Loading, NetworkStatus, Error } = await client.query({
    //   query: GET_USERS,
    // });

    // console.log(data);
    const res = await fetch(`${process.env.API_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "language": locale,
        "email_id": userName.toLowerCase(),
        password
      })
    })

    const res2 = await res.json();
    console.log(res2);
    if (res2.status_code == 403) {
      setloginMessage("Either User name or password does not exist");
    } else if (res2.status_code == 200) {
      setloginMessage("");
      Cookies.set('token', res2?.data?.auth_token)
      Cookies.set('role', res2?.data?.user_role)
      Cookies.set('userid', res2?.data?.id)
      Cookies.set('name', res2?.data?.full_name)
      router.push('/credit-reports')
    } else {
      setloginMessage("Ajax fails");
    }
  }

  return (
    <div >
      <div className="container">
        {/* <Lang /> */}
        <form onSubmit={(e) => userLogin(e)}>
          <div className="row">
            <div className="col-7">
              <Image src="/img/Login.svg" alt="Logo" width="510" height="505" />
            </div>
            <div className="col-5 align-self-center">
              <div className="logowrap">
                <Logo />
              </div>
              <h1 className="mb-2">{login.title}</h1>
              <div className="welcome">Welcome</div>
              <div className="gmsg">Enter your credentials to access your account.</div>
              <div className="form_wrap">
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">{login.email}</label>
                  <input className="form-control" type="text" id="username" placeholder="Email Id" value={userName} onChange={(e) => setName(e.target.value.toLowerCase())} />
                </div>
                <div className="mb-3">
                  <label htmlFor="password">{login.password}</label>
                  <input className="form-control" type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="mb-3">
                  <button type="submit" className="btn btn-primary mb-3">{btn_login}</button>
                </div>
              </div>
              <div className="center_nav"><Link href="/forgot-password"><a>{a_forgot_pass}</a></Link></div>
              <div>{loginMessage}</div>
            </div>

          </div>
        </form>
      </div>
    </div >
  )
}
