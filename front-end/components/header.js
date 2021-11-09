import Link from 'next/link'
import Lang from './lang';
import { useRouter } from "next/router";
import Logo from './logo';
import { Nav, Button } from 'react-bootstrap';
const Header = () => {
    const router = useRouter();
    return (
        <header>
            <div class="row">
                <div class="col-9">
                    <Nav className="navbar">
                        <Logo />
                        <ul class=" me-auto mb-2 mb-lg-0">
                            <li><Link activeClassName={router.pathname === "/credit-reports"} href="/credit-reports"><a className="nav-link">Credit Reports</a></Link></li>
                            <li><Link activeClassName={router.pathname === "/database-reports"} href="/companies"><a className="nav-link">Companies</a></Link></li>
                            <li><Link activeClassName={router.pathname === "/database-reports"} href="/groups"><a className="nav-link">Groups</a></Link></li>
                            <li><Link activeClassName={router.pathname === "/database-reports"} href="/legal-uploads"><a className="nav-link">Legal Uploads</a></Link></li>
                            {/* <li class="nav-item"><Link activeClassName={router.pathname === "/database-reports"} href="/database-reports"><a>Database Reports</a></Link></li> */}
                            {/* <li><Link activeClassName={router.pathname === "/legal-watchlist"} href="/legal-watchlist"><a className="nav-link">Legal Watch list</a></Link></li> */}
                            {/* <li><Link activeClassName={router.pathname === "/aging"} href="/aging"><a className="nav-link">Aging</a></Link></li> */}
                            
                        </ul>
                    </Nav>
                </div>
                <div class="col">
                    <div className="user_nav pull-right">
                        <div className="hello pull-right">Hello User full Name</div>
                        <div className="dropdown pull-right">
                            <a class="nav-link dropdown-toggle" href="#" id="dropdownMenuButton1" role="button" data-bs-toggle="dropdown" aria-expanded="false">

                            </a>

                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><a className="dropdown-item" href="#">Action</a></li>
                                <li><a className="dropdown-item" href="#">Another action</a></li>
                                <li><a className="dropdown-item" href="#">Something else here</a></li>
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