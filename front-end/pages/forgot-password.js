
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { useState } from "react";
import langTrans from "../components/i18n";
import Lang from "../components/lang";
import Logo from '../components/logo';
import Image from 'next/image'
import { forgot_password } from '../pages/api/users'

const ForgotPassword = () => {

    const [userName, setName] = useState("");
    const [loginMessage, setloginMessage] = useState("");
    const { locale } = useRouter();
    // const { forgot_password, btn_continue, btn_login } = langTrans[locale];
    const t = langTrans[locale];



    const forgotPass = async () => {

        const body = {
            "language": locale,
            "email_id": userName,
        }


        const res2 = await forgot_password(body)
        if (res2.status_code == 403) {
            setloginMessage("User name does not exist");
        } else if (res2.status_code == 200) {
            setName("");
            setloginMessage("Email has been sent, please follow the login instruction");
        } else {
            setloginMessage("Ajax fails");
        }
    }

    return (

        <div className=" vertical-center">
            <div className="container">
                {/* <Lang /> */}

                <div className="row">
                    <div className="col-7">
                        <Image src="/img/Forgot_Password.svg" alt="Logo" width="510" height="505" />
                    </div>
                    <div className="col align-self-center">
                        <div className="logowrap">
                            <Logo />
                        </div>
                        <h1 className="mb-2">{t.forgot_password.title}</h1>
                        <div className="gmsg">Enter the email associated with your account, and we’ll send an email with instructions to reset your password.</div>
                        <div className="form_wrap">
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">{t.forgot_password.email}</label>
                                <input className="form-control" type="text" id="username" placeholder="Email Id" value={userName} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <button type="submit" className="btn btn-primary mb-3" onClick={forgotPass}>{t.btn_continue}</button>
                            </div>
                        </div>
                        <div className="center_nav"><Link href="/"><a>{t.btn_login}</a></Link></div>
                        <div>{loginMessage}</div>
                    </div>


                </div>
            </div>
        </div>

    )
}

export default ForgotPassword