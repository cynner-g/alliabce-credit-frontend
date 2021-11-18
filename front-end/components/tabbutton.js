import Link from 'next/link'
const TabButton = ({ id }) => {
    return (
        <ul class="nav company_nav">
            <li className="nav-item"><Link href="#"><a className="nav-link">General</a></Link></li>
            <li className="nav-item">
                <Link href={{
                    pathname: `/companies/users/[userid]`,
                    query: {
                        userid: id, // should be `title` not `id`
                    },
                }}
                    as={`/companies/users/${id}`}
                ><a className="nav-link">user</a></Link></li>
            <li className="nav-item"><Link href="/companies/legal-watchlist"><a className="nav-link">Legal Watchlist</a></Link></li>
            <li className="nav-item"><Link href="/companies/aging"><a className="nav-link">Aging</a></Link></li>
        </ul>
    )
}

export default TabButton