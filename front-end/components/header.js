import Link from 'next/link'
import Lang from './lang';
import { useRouter } from "next/router";


const Header = () => {
    const router = useRouter();
    return (
        <>
            <Lang />
            <div>
                Logo
            </div>
            <div>
                <Link activeClassName={router.pathname === "/credit-reports"} href="/credit-reports"><a>Credit Reports</a></Link>
                <Link activeClassName={router.pathname === "/database-reports"} href="/database-reports"><a>Database Reports</a></Link>
                <Link activeClassName={router.pathname === "/legal-watchlist"} href="/legal-watchlist"><a>Legal Watch list</a></Link>
                <Link activeClassName={router.pathname === "/aging"} href="/aging"><a>Aging</a></Link>
            </div>
            <div>Notification</div>
            <div>Hello User full Name</div>
            <div>
                <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">

                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><a className="dropdown-item" href="#">Action</a></li>
                        <li><a className="dropdown-item" href="#">Another action</a></li>
                        <li><a className="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Header;