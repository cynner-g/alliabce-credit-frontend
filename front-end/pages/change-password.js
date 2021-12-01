import Cookies from 'js-cookie';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import { useState, useEffect } from "react"
import langTrans from '../components/i18n';
import Lang from '../components/lang';
import Logo from '../components/logo';
import Image from 'next/image'
import Link from 'next/link'


const ChangePassword = (props) => {
    let [email, setEmail] = useState("");
    let [origPassword, setOrigPassword] = useState("");
    let [password, setNewPassword] = useState("");
    let [password2, setNewPassword2] = useState("");
    let [passwordMessage, setPasswordMessage] = useState("");
    let [passwordChanged, setPasswordChanged] = useState("");

    let { locale, locales, defaultLocale, asPath } = useRouter();
    let { forgot_password, a_forgot_pass, btn_Change } = langTrans[locale];
    const { token } = parseCookies();
    const router = useRouter();
    let id = router.query.uId;
    let userId = Cookies.get('userid')

    console.log(userId)
    const changePassword = async (e) => {

        console.log(email, origPassword, password, password2)
        e.preventDefault();
        // const { data, Loading, NetworkStatus, Error } = await client.query({
        //   query: GET_USERS,
        // });

        // console.log(data);
        const res = await fetch(`${process.env.API_URL}/user/change-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "api_token": token,
                "current_password": origPassword,
                "new_password": password,
                "confirm_password": password2,

            })

        })
        const res2 = await res.json();
        console.log(res2);
        if (res2.status_code == 403) {
            setPasswordMessage(res2.message);
        } else if (res2.status_code == 200) {
            setPasswordMessage("");
            setPasswordChanged("Your Password has been changed")
        } else {
            setPasswordMessage("Ajax fails");
        }
    }

    return (
        <div className=" vertical-center">
            <div className="container">
                {/* <Lang /> */}

                {/* <form onSubmit={changePassword}> */}
                <div className="row">
                    <div className="col-7">
                        <Image src="/img/Change_Password.svg" alt="Logo" width="510" height="505" />
                    </div>
                    <div className="col-5 align-self-center">
                        <div className="logowrap">
                            <Logo />
                        </div>
                        <h1 className="mb-2">{a_forgot_pass}</h1>
                        <div className="welcome">Welcome</div>
                        <div className="gmsg">Please choose your new password.</div>
                        <div className="form_wrap">
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">{forgot_password.email}</label>
                                <input className="form-control" type="text" id="username" placeholder="Email Id" onChange={(e) => setEmail(e.target.value.toLowerCase())} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="origPassword">{forgot_password.origPassword}</label>
                                <input className="form-control" type="password" id="origPassword" placeholder={forgot_password.origPassword} onChange={(e) => setOrigPassword(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="newPassword">{forgot_password.password}</label>
                                <input className="form-control" type="password" id="newPassword" placeholder="Enter your new password" onChange={(e) => setNewPassword(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="newPassword2">{forgot_password.password} </label>
                                <input className="form-control" type="password" id="newPassword2" placeholder="Confirm your new password" onChange={(e) => setNewPassword2(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <button type="button" onClick={changePassword} className="btn btn-primary mb-3">{btn_Change}</button>
                            </div>
                        </div>
                        <div className="changedMessage bg-info">
                            {passwordChanged}
                        </div>
                        <div className="center_nav" style={{ display: passwordChanged == '' ? 'none' : 'inline-block' }}><Link href="/"><a>Log in</a></Link></div>

                    </div>
                    <div>{passwordMessage}</div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword;