import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/dist/client/router';


import langTrans from './../components/i18n';



export default function Login(props) {
  const [userName, setName] = useState("");
  const [password, setPassword] = useState("");
  const { locale, locales, defaultLocale, asPath } = useRouter();
  const { login } = langTrans[locale];
  
  return (
    <div className=" vertical-center">
      <div className="container">
        <div>
          <span>Current Language: </span>
          <span
            style={{
              borderRadius: "3px",
              backgroundColor: "blue",
              color: "white",
              padding: "2px",
            }}
          >
            {locale}
          </span> <br />
          <Link
            activeClassName={locale === "fr-FR"}
            href={asPath}
            locale="fr-FR"
          >
            fr-FR
          </Link>
          |
          <Link
            activeClassName={locale === "en-US"}
            href={asPath}
            locale="en-US"
          >
            en-US
          </Link>
        </div>
        <h1 className="mb-5 text-center">{login.title}</h1>
        <div className="row">
          <div className="col"></div>
          <div className="col align-self-center">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">{login.email}</label>
              <input className="form-control" type="text" id="username" placeholder="User Name" value={userName} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <input className="form-control" type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="mb-3">
              <button type="submit" className="btn btn-primary mb-3">Login</button>
            </div>
            <Link href="/forgot-password"><a>Forgot Password</a></Link>
          </div>
          <div className="col"></div>
        </div>
      </div>
    </div>
  )
}
