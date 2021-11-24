import Link from 'next/link'
import Lang from './lang';
import { useRouter } from "next/router";
import { parseCookies } from 'nookies';
import Cookies from 'js-cookie'
import Logo from './logo';
import { Nav, Button } from 'react-bootstrap';

const Header = () => {
    const router = useRouter();
    const { token } = parseCookies();
    const role = Cookies.get('role');
    let user = false
    if (token) {
        user = true
    } else {
        user = false
    }
    const myRole = Cookies.get('role');
    return (
        <header>
            <div className="row">
                <div className="col-9">
                    <Nav className="navbar">
                        <Logo />
                        <ul className=" me-auto mb-2 mb-lg-0">
                            {/*  */}
                            <li className={router.pathname == "/credit-reports" ? "active" : ""}><Link activeClassName={router.pathname === "/credit-reports"} href="/credit-reports"><a className="nav-link">Credit Reports</a></Link></li>
                            {myRole == 'admin' ?
                                <li className={router.pathname == "/companies" ? "active" : ""}><Link activeClassName={router.pathname === "/companies"} href="/companies"><a className="nav-link">Companies</a></Link></li>
                                : ''}
                            <li className={router.pathname == "/database-reports" ? "active" : ""}><Link activeClassName={router.pathname === "/database-reports"} href="/groups"><a className="nav-link">Groups</a></Link></li>
                            <li className={router.pathname == "/database-reports" ? "active" : ""}><Link activeClassName={router.pathname === "/database-reports"} href="/legal-uploads"><a className="nav-link">Legal Uploads</a></Link></li>
                            {/* User */}
                            {/* <li className="nav-item"><Link activeClassName={router.pathname === "/database-reports"} href="/database-reports"><a>Database Reports</a></Link></li> */}
                            {/* <li><Link activeClassName={router.pathname === "/legal-watchlist"} href="/legal-watchlist"><a className="nav-link">Legal Watch list</a></Link></li> */}
                            {/* <li><Link activeClassName={router.pathname === "/aging"} href="/aging"><a className="nav-link">Aging</a></Link></li> */}

                        </ul>
                    </Nav>
                </div>
                <div className="col">
                    <div className="user_nav pull-right">
                        <div className="hello pull-right">Hello {Cookies.get('name')}</div>
                        <div className="dropdown pull-right">
                            <a className="nav-link dropdown-toggle" href="#" id="dropdownMenuButton1" role="button" data-bs-toggle="dropdown" aria-expanded="false">

                            </a>

                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                {user ?
                                    <>
                                        <li><a className="dropdown-item" onClick={() => {
                                            Cookies.remove('token');
                                            Cookies.remove('role')
                                            Cookies.remove('userid')
                                            Cookies.remove('name')
                                            Cookies.remove('company_id')
                                            router.push('/');
                                        }
                                        }>Logout</a></li>
                                        {role == 'admin' ? (
                                            <li><a className="dropdown-item" href="/account/admin">My Account</a></li>
                                        ) : (
                                            <li><a className="dropdown-item" href="/account">My Account</a></li>
                                        )}

                                    </>
                                    :
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                }

                                <li><Lang /></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>



            {/* <div className="d-flex">
                    <div>Notification</div>
                    <div></div>
                    <div>
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">

                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><a className="dropdown-item" href="#">Action</a></li>
                                <li><a className="dropdown-item" href="#">Another action</a></li>
                                <li><a className="dropdown-item" href="#">Something else here</a></li>
                                <li><Lang /></li>
                            </ul>
                        </div>
                    </div>
                </div> */}

        </header>
    )
}

export default Header;