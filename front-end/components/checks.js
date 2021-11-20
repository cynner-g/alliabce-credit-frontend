import Link from 'next/link'
import Lang from './lang';
import { useRouter } from "next/router";
import { parseCookies } from 'nookies';
import Cookies from 'js-cookie'
import Logo from './logo';
import { Nav, Button } from 'react-bootstrap';

const Header = () => {
    const token = Cookies.get('token');
    const myRole = Cookies.get('role');
    if (!token || (myRole !== 'admin')) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    return (
        <></>
    )
}

export default Header;