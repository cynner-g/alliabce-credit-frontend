import Link from 'next/link'
import { useRouter } from 'next/router';
const TabButtonUser = ({ id }) => {
    const router = useRouter();
    return (
        <ul class="nav company_nav_inner">
            {/* <li className="nav-item"><Link href="/account"><a className="nav-link">General</a></Link></li> */}
            <li className="nav-item" className={router.pathname == "/account" ? "active" : ""}><Link href="/account"><a className="nav-link">General</a></Link></li>
            <li className="nav-item" className={router.pathname == "/account/users" ? "active" : ""}><Link href={`/account/users/`}><a className="nav-link">User</a></Link></li>
        </ul>
    )
}

export default TabButtonUser