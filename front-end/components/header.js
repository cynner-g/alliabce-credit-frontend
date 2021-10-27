import Link from 'next/link'
import Lang from './lang';

import { useRouter } from "next/router";


const Header = () => {
    const router = useRouter();
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
    </>
}

export default Header;