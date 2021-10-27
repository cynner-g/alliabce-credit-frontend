import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/dist/client/router';


import langTrans from './../components/i18n';
import Lang from '../components/lang';



export default function Login(props) {
  const [userName, setName] = useState("");
  const [password, setPassword] = useState("");
  const { locale, locales, defaultLocale, asPath } = useRouter();
  const { login, a_forgot_pass, btn_login } = langTrans[locale];

  return (
    <div className=" vertical-center">
      <div className="container">
        <Lang />
        <h1 className="mb-5 text-center">{login.title}</h1>
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
          </div>
          <div className="col"></div>
        </div>
      </div>
    </div>
  )
}
