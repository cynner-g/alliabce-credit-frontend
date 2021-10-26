
import Link from "next/link";
import { useState } from "react";
const ForgotPassword = () => {
    const [userName, setUserName] = useState("");

    return (




        <div className=" vertical-center">
            <div className="container">
                <h1 className="mb-5 text-center">Forgot Password</h1>
                <div class="row">
                    <div className="col"></div>
                    <div className="col align-self-center">
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Email Address</label>
                            <input className="form-control" type="text" id="username" placeholder="User Name" value={userName} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary mb-3">Continue</button>
                        </div>
                        <Link href="/"><a>Login</a></Link>
                    </div>
                    <div className="col"></div>
                </div>
            </div>
        </div>

    )
}

export default ForgotPassword