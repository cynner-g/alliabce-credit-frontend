
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { useState } from "react";
import langTrans from "../components/i18n";
import Lang from "../components/lang";


const ForgotPassword = () => {

    const [userName, setUserName] = useState("");
    const { locale } = useRouter();
    // const { forgot_password, btn_continue, btn_login } = langTrans[locale];
    const t = langTrans[locale];
    return (

        <div className=" vertical-center">
            <div className="container">
                <Lang />
                <h1 className="mb-5 text-center">{t.forgot_password.title}</h1>
                <div class="row">
                    <div className="col"></div>
                    <div className="col align-self-center">
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">{t.forgot_password.email}</label>
                            <input className="form-control" type="text" id="username" placeholder="User Name" value={userName} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary mb-3">{t.btn_continue}</button>
                        </div>
                        <Link href="/"><a>{t.btn_login}</a></Link>
                    </div>
                    <div className="col"></div>
                </div>
            </div>
        </div>

    )
}

export default ForgotPassword