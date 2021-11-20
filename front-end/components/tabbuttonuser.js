import Link from 'next/link'
const TabButtonUser = ({ id }) => {
    return (
        <ul class="nav company_nav">
            <li className="nav-item"><Link href="/account"><a className="nav-link">General</a></Link></li>
            <li className="nav-item">
                <Link href={`/account/users/`}><a className="nav-link">user</a></Link></li>
        </ul>
    )
}

export default TabButtonUser