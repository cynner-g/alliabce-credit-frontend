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
import { reset_password } from './api/users'
// export const GET_USERS = gql`
//   query getUsers {
//     users @rest(type: "Users", path: "users/login") {
//       data
//     }
// }`;

export default function ResetPassword(props) {
    const [new_password, setNew_password] = useState("");
    const [confirm_password, setConfirm_password] = useState("");
    const [password, setPassword] = useState("");
    const [loginMessage, setloginMessage] = useState("");
    const { locale, locales, defaultLocale, asPath } = useRouter();
    const { login, a_forgot_pass, btn_login } = langTrans[locale];
    const router = useRouter()


    const userLogin = async (e) => {

        e.preventDefault();
        let body = {
            "language": locale,
            "new_password": new_password,
            "confirm_password": confirm_password
        }

        const res2 = reset_password(body)
        if (res2.status_code == 403) {
            setloginMessage("Either User name or Password doesnot exists");
        } else if (res2.status_code == 200) {
            setloginMessage("Your Password has been reset.");

        } else {
            setloginMessage("Ajax fails");
        }
    }

    return (
        <div className=" vertical-center">
            <div className="container">
                {/* <Lang /> */}

                <form onSubmit={(e) => userLogin(e)}>
                    <div className="row">
                        <div className="col-7">
                            <Image src="/img/Reset_Password.svg" alt="Logo" width="664" height="494" />
                        </div>
                        <div className="col-5 align-self-center">
                            <div className="logowrap">
                                <Logo />
                            </div>
                            <h1 className="mb-2">Reset Password</h1>
                            <div className="gmsg">Please choose your new password.</div>
                            <div className="form_wrap">
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">{login.email}</label>
                                    <input className="form-control" type="text" id="username" placeholder="Enter your new password" value={new_password} onChange={(e) => setNew_password(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password">{login.password}</label>
                                    <input className="form-control" type="password" id="password" placeholder="Confirm your new password" value={confirm_password} onChange={(e) => setConfirm_password(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <button type="submit" className="btn btn-primary mb-3">Reset Password</button>
                                </div>
                                {
                                    loginMessage != "" ?
                                        <div className="msgwrap">{loginMessage}</div>
                                        : ''
                                }
                            </div>
                            <div className="center_nav"><Link href="/"><a>Login</a></Link></div>

                        </div>

                    </div>
                </form>
            </div>
        </div >
    )
}
