import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'

import langTrans from './../components/i18n';
import Lang from '../components/lang';
// import gql from 'graphql-tag';
// import client from './apollo-client';


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
    const res = await fetch(`http://dev.alliancecredit.ca/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "language": locale,
        "email_id": userName,
        password
      })

    })
    const res2 = await res.json();
    console.log(res2);
    if (res2.status_code == 403) {
      setloginMessage("Either User name or Password doesnot exists");
    } else if (res2.status_code == 200) {
      setloginMessage("");
      Cookies.set('token', res2?.data?.auth_token)
      Cookies.set('role', res2?.data?.user_role)
      Cookies.set('userid', res2?.data?.user_role)
      Cookies.set('name', res2?.data?.user_role)
      router.push('/credit-reports')
    } else {
      setloginMessage("Ajax fails");
    }
  }

  return (
    <div className=" vertical-center">
      <div className="container">
        {/* <Lang /> */}
        <h1 className="mb-5 text-center">{login.title}</h1>
        <form onSubmit={(e) => userLogin(e)}>
          <div className="row">
            <div className="col"></div>
            <div className="col align-self-center">
              <div className="mb-3">
                <label htmlFor="username" className="form-label">{login.email}</label>
                <input className="form-control" type="text" id="username" placeholder="User Name" value={userName} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="password">{login.password}</label>
                <input className="form-control" type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="mb-3">
                <button type="submit" className="btn btn-primary mb-3">{btn_login}</button>
              </div>
              <Link href="/forgot-password"><a>{a_forgot_pass}</a></Link>
              {loginMessage}
            </div>
            <div className="col"></div>
          </div>
        </form>
      </div>
    </div >
  )
}
