import { useRouter } from "next/router"
import { parseCookies } from "nookies";
import Address from "../../components/address";
import Link from 'next/link'
import SubCompanies from "../../components/sub-companies";
import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import Header from "../../components/header";
import TabButton from "../../components/tabbutton";
import Cookies from "js-cookie";


const GroupCompanies = ({ data }) => {
    const [dataList, setData] = useState(data);
    const [search, setSearch] = useState('');
    const [sort_by, setSortby] = useState('company_name');
    const [is_desc, setDesc] = useState(false);
    const [newGroupName, setNewGroupName] = useState(null);
    const [addingGroup, showAddingGroup] = useState(false);

    const router = useRouter()
    /*
    
    "data": [
        {
          "_id": "61ab54c7507db452ec379804",
          "company_name": "Facebook Inc.",
          "create_date": "04/12/2021",
          "create_time": "11:44",
          "sub_companies": 1
        }
      ]
    
    */


    const fetchData = () => {

        const fetchData = async (value) => {

            if (!token) {
                return {
                    redirect: {
                        destination: '/',
                        permanent: false,
                    },
                }
            }

            if (value == null) value = search; //make sure searching with most current text
            const req = await fetch(`${process.env.API_URL}/group/list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "api_token": token,
                    'group_id': '',
                    'language': 'EN',
                    'search': search,
                    'sort_by': sort_by, //create_date or sub_companies or company_name
                    'is_desc': is_desc,//true or false
                    'skip': 0,
                    'limit': 15,
                })
            });
            const newData = await req.json();

            return setData(newData);
        };

    }

    const removeCompany = (e, id) => {

    }


    return (

        <>
            <Header />
            <div className="breadcrumb">
                <ul className=" me-auto mb-2 mb-lg-0">
                    <li><Link href="/groups"><a className="nav-link">Groups</a></Link></li>
                    <li>{data?.group_name}</li>
                </ul>
            </div>
            <div>

                <table id="example" className="table table-striped">
                    <thead>
                        <tr>
                            <th><div>Sr. Number</div></th>
                            <th><div>CompanyB Name</div></th>
                            <th><div>Date Added</div></th>
                            <th><div>Sub companies</div></th>
                            <th><div>Action</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.company_name}</td>
                                <td>{item.create_date} {item.create_time}</td>
                                <td>{item.sub_companies}</td>

                                <td>
                                    <>
                                        <button className="btn viewmore" onClick={(e) => removeCompany(e, item._id)}>Remove</button>
                                    </>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div >

        </>
    )
}

export default GroupCompanies

export async function getServerSideProps(ctx) {
    // const start = +page === 1 ? 0 : (+page + 1)

    // const { locale, locales, defaultLocale, asPath } = useRouter();
    const { token } = parseCookies(ctx)
    const groupId = ctx.params.groupId
    if (!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    const res = await fetch(`${process.env.API_URL}/group/group-companies`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "language": 'en',
            "api_token": token,
            "group_id": groupId
        })

    })
    const data = await res.json()

    /**
     * limit, start, search item
     */
    return {
        props: {
            data: data?.data
        }
    }
}


