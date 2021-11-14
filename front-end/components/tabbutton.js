import Link from 'next/link'
const TabButton = ({id}) => {
    return (
        <ul class="nav">
            <li className="nav-item"><Link href="#"><a className="nav-link">General</a></Link></li>
            <li className="nav-item"><Link href="/companies/users" as={{
                pathname: "/companies/users",
                query: { id: id }
            }}><a className="nav-link">user</a></Link></li>
            <li className="nav-item"><Link href="/companies/legal-watchlist"><a className="nav-link">Legal Watchlist</a></Link></li>
            <li className="nav-item"><Link href="/companies/aging"><a className="nav-link">Aging</a></Link></li>
        </ul>
    )
}

export default TabButton