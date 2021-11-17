
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { useState } from "react";
import langTrans from "../components/i18n";
import Lang from "../components/lang";


const ForgotPassword = () => {

    const [userName, setName] = useState("");
    const [loginMessage, setloginMessage] = useState("");
    const { locale } = useRouter();
    // const { forgot_password, btn_continue, btn_login } = langTrans[locale];
    const t = langTrans[locale];



    const forgotPass = async () => {

        // e.preventDefault();
        // const { data, Loading, NetworkStatus, Error } = await client.query({
        //   query: GET_USERS,
        // });

        // console.log(data);
        const res = await fetch(`http://dev.alliancecredit.ca/user/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "language": locale,
                "email_id": userName,
            })

        })
        const res2 = await res.json();
        if (res2.status_code == 403) {
            setloginMessage("Either User name doesnot exists");
        } else if (res2.status_code == 200) {
            setName("");
            setloginMessage("Email has been send, please follow the login instruction");
        } else {
            setloginMessage("Ajax fails");
        }
    }

    return (

        <div className=" vertical-center">
            <div className="container">
                <Lang />
                <h1 className="mb-5 text-center">{t.forgot_password.title}</h1>
                <div className="row">
                    <div className="col"></div>
                    <div className="col align-self-center">
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">{t.forgot_password.email}</label>
                            <input className="form-control" type="text" id="username" placeholder="User Name" value={userName} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary mb-3" onClick={forgotPass}>{t.btn_continue}</button>
                        </div>
                        <div><Link href="/"><a>{t.btn_login}</a></Link></div>
                        <div>{loginMessage}</div>
                    </div>

                    <div className="col"></div>
                </div>
            </div>
        </div>

    )
}

export default ForgotPassword