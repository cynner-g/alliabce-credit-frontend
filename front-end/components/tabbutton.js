import Link from 'next/link'
import { useRouter } from 'next/router';
const TabButton = ({ id, url }) => {
    const router = useRouter();
    return (
        <ul class="nav company_nav">
            <li className="nav-item" className={router.pathname == "/companies/[id]" ? "active" : ""}><Link href={url}><a className="nav-link">General</a></Link></li>
            <li className="nav-item" className={router.pathname == "/companies/users/[userid]" ? "active" : ""}>
                <Link href={{
                    pathname: `/companies/users/[userid]`,
                    query: {
                        userid: id, // should be `title` not `id`
                    },
                }}
                    as={`/companies/users/${id}`}
                ><a className="nav-link">user</a></Link></li>
            <li className="nav-item" className={router.pathname == "/companies/legal-watchlist" ? "active" : ""}><Link href="/companies/legal-watchlist"><a className="nav-link">Legal Watchlist</a></Link></li>
            <li className="nav-item" className={router.pathname == "/companies/aging" ? "active" : ""}><Link href="/companies/aging"><a className="nav-link">Aging</a></Link></li>
        </ul>
    )
}

export default TabButton