import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'
import langTrans from './../components/i18n';
import Logo from '../components/logo';
import Image from 'next/image'
import { login_user } from './api/users'
import 'rsuite/dist/rsuite.min.css';



export default function Login(props) {
  const [userName, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setloginMessage] = useState("");
  const { locale, locales, defaultLocale, asPath } = useRouter();
  const { login, a_forgot_pass, btn_login } = langTrans[locale];
  const router = useRouter()
  const [visible, setVisible] = useState(false);


  const handleChange = () => {
    setVisible(!visible);
  };

  /**
   * Login action perform 
   *
   * @param {*} e
   */
  const userLogin = async (e) => {

    e.preventDefault();
    const body = {
      "language": locale,
      "email_id": userName.toLowerCase(),
      password
    }

    const res2 = await login_user(body)

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

  try {
    return (

      <div className='lofin_form'>
        {/* <Lang /> */}
        <form onSubmit={(e) => userLogin(e)}>
          <div className="login_wrap align-self-center">
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
                <button type="submit" className="btn btn-primary btnlogin mb-3">{btn_login}</button>
              </div>
            </div>
            <div className="center_nav fpass"><Link href="/forgot-password"><a>{a_forgot_pass}</a></Link></div>
            <div>{loginMessage}</div>
          </div>
        </form>
      </div>
    )
  }
  catch (ex) {
    return JSON.stringify(ex)
  }
}
