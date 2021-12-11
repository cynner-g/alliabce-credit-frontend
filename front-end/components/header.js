import Link from 'next/link'
import Lang from './lang';
import Image from 'next/image'
import { useRouter } from "next/router";
import { parseCookies } from 'nookies';
import Cookies from 'js-cookie';
import Logo from './logo';
import { Nav, Button } from 'react-bootstrap';
import { useEffect } from 'react';

const Header = (props) => {
    const router = useRouter();
    const { token } = parseCookies();
    const role = Cookies.get('role');
    let user = false
    if (token) {
        user = true
    } else {
        user = false
    }

    useEffect(() => { //componentDidMount
        if (!user) {
            router.push('/');
        }
    }, [])

    const myRole = Cookies.get('role');
    let name = Cookies.get('name')

    const restoreAdmin = () => {
        Cookies.set('token', Cookies.get('admin_token'))
        Cookies.set('role', Cookies.get('admin_role'))
        Cookies.set('userid', Cookies.get('admin_userid'))
        Cookies.set('name', Cookies.get('admin_name'))

        Cookies.remove('admin_token');
        Cookies.remove('admin_role');
        Cookies.remove('admin_userid');
        Cookies.remove('admin_name');
    }

    return (
        <div className='header'>
            <div className="header_wrap">
                <header>
                    <div className="row">
                        <div className="col-10">
                            <Nav className="navbar">
                                <div className='logo_wrap'><Logo /></div>
                                <ul className=" me-auto mb-2 mb-lg-0">
                                    {/*  */}
                                    {myRole == 'admin' ?
                                        <>
                                            <li className={`credit-report ${router.pathname == "/credit-reports" ? "active" : ""}`}>
                                                <Link activeClassName={router.pathname === "/credit-reports"} href="/credit-reports">
                                                    <a className="nav-link">Credit Reports</a>
                                                </Link>
                                            </li>


                                            <li className={`database-report ${router.pathname == "/database-reports" ? "active" : ""}`}>
                                                <Link activeClassName={router.pathname === "/database-reports"} href="/database-reports">
                                                    <a className="nav-link">Database Reports</a>
                                                </Link>
                                            </li>
                                            {
                                                myRole == 'admin' ? '' : ''
                                            }
                                            <li className={`companies ${router.pathname == "/companies" ? "active" : ""}`}>
                                                <Link activeClassName={router.pathname === "/companies"} href="/companies">
                                                    <a className="nav-link">Companies</a>
                                                </Link>
                                            </li>

                                            <li className={`groups ${router.pathname == "/groups" ? "active" : ""}`}>
                                                <Link activeClassName={router.pathname === "/groups"} href="/groups">
                                                    <a className="nav-link">Groups</a>
                                                </Link>
                                            </li>

                                            <li className={`legal-uploads ${router.pathname == "/legal-uploads" ? "active" : ""}`}>
                                                <Link activeClassName={router.pathname === "/legal-uploads"} href="/legal-uploads">
                                                    <a className="nav-link">Legal Upload</a>
                                                </Link>
                                            </li>


                                        </>
                                        :
                                        <>
                                            <li className={`credit-report ${router.pathname == "/credit-reports" ? "active" : ""}`}>
                                                <Link activeClassName={router.pathname === "/credit-reports"} href="/credit-reports">
                                                    <a className="nav-link">Credit Reports</a>
                                                </Link>
                                            </li>

                                            <li className={`database-report ${router.pathname == "/database-reports" ? "active" : ""}`}>
                                                <Link activeClassName={router.pathname === "/database-reports"} href="/database-reports">
                                                    <a className="nav-link">Database Reports</a>
                                                </Link>
                                            </li>
                                            {myRole == 'user' || myRole == 'user-manager' ?
                                                <>
                                            <li className={`legal-watchlist TEST ${router.pathname == "/legal-watchlist" ? "active" : ""}`}>
                                                        <Link activeClassName={router.pathname === "/legal-watchlist"}
                                                            href="/legal-watchlist">
                                                    <a className="nav-link">Legal Watchlist</a>
                                                </Link>
                                            </li>


                                            <li className={`aging ${router.pathname == "/aging" ? "active" : ""}`}>
                                                <Link activeClassName={router.pathname === "/aging"} href="/aging">
                                                    <a className="nav-link">Aging</a>
                                                </Link>
                                            </li>
                                                </>
                                                : ''
                                            }
                                        </>




                                    }
                                    {/* User */}
                                    {/* <li className="nav-item"><Link activeClassName={router.pathname === "/database-reports"} href="/database-reports"><a>Database Reports</a></Link></li> */}
                                    {/* <li><Link activeClassName={router.pathname === "/legal-watchlist"} href="/legal-watchlist"><a className="nav-link">Legal Watch list</a></Link></li> */}
                                    {/* <li><Link activeClassName={router.pathname === "/aging"} href="/aging"><a className="nav-link">Aging</a></Link></li> */}

                                </ul>
                            </Nav>
                        </div>
                        <div className="col">
                            <span className='status_header'>{props?.message || ''}</span>
                            <div className="user_nav pull-right">
                                <div className="hello pull-right">

                                    Hello {name}
                                </div>
                                <div className="dropdown pull-right">
                                    <a className="nav-link dropdown-toggle" href="#" id="dropdownMenuButton1" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <Image src="/icons/down-arrow.svg" alt="down arrow" width="12" height="6" />
                                    </a>

                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                        {user ?
                                            <>
                                                <li> {
                                                    Cookies.get('admin_userid') ?
                                                        <button onClick={() => restoreAdmin()}>Exit Simulation</button>
                                                        : null
                                                }
                                                </li>

                                                {role == 'admin' ? (
                                                    <li className='myaccount'>
                                                        <Link activeClassName={router.pathname === "/account/admin"} href="/account/admin">
                                                            <a>My Account</a>
                                                        </Link>
                                                    </li>
                                                ) : (
                                                    <li className='myaccount'>
                                                        <Link activeClassName={router.pathname === "/account"} href="/account">
                                                            <a>My Account</a>
                                                        </Link>
                                                    </li>
                                                )}
                                            </>
                                            :
                                            <li><a>Action</a></li>
                                        }

                                        {/* <li><Lang /></li> */}
                                        <li className='aging_upload'>
                                            <Link href="#">
                                                <a>Aging Upload</a>
                                            </Link>
                                        </li>
                                        {user ?
                                            <li className='logout'><a onClick={() => {
                                                Cookies.remove('token');
                                                Cookies.remove('role')
                                                Cookies.remove('userid')
                                                Cookies.remove('name')
                                                Cookies.remove('company_id')
                                                router.push('/');
                                            }
                                            }>Logout</a></li>
                                            : ''}
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
            </div>
        </div>
    )
}

export default Header;