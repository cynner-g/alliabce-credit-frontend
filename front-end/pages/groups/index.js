import Header from "../../components/header"
import { useRouter } from "next/router"
import Link from 'next/link'
import Pagination from "../../components/datatable/pagination"
import Cookies from "js-cookie"
import { parseCookies } from "nookies"
import { useState } from "react"
import { Table, Container, Row, Col, Badge, Modal } from 'react-bootstrap';

const Groups = ({ data, page, totalPage }) => {
    const [dataList, setData] = useState(data);
    const [search, setSearch] = useState('');
    const [sort_by, setSortby] = useState('company_name');
    const [is_desc, setDesc] = useState(false);
    const [newGroupName, setNewGroupName] = useState(null);
    const [addingGroup, showAddingGroup] = useState(false);

    // const token = Cookies.get('token');
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYWI1NWYwMTE4NGI3MTcxOTQxMmQ5ZCIsImVtYWlsX2lkIjoiYWRtaW5AamtsYWJzLmNhIiwiY3JlYXRlX2RhdGUiOiIyMDIxLTEyLTA0VDEyOjA5OjQ3LjMyNVoiLCJpYXQiOjE2Mzg2MTk3ODd9.k6xQ66O_9QOs9nH1SxFETOl2_n9ktbbdDHO4cXwedH8';
    const router = useRouter()
    const limit = 3
    const lastPage = Math.ceil(totalPage / limit)

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
                "search": value,
                "sort_by": sort_by,
                "is_desc": is_desc,
                "limit": 15,
                "skip": 0
            })

        });
        const newData = await req.json();

        return setData(newData);
    };

    const createGroup = async () => {
        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }

        if (newGroupName?.length === 0) return;

        const req = await fetch(`${process.env.API_URL}/group/create-group`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "api_token": token,
                "group_name": newGroupName,
            })
        });
        const newData = await req.json();
        return setData(newData);
    }


    const removeGroup = async (groupId) => {

        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }

        const req = await fetch(`${process.env.API_URL}/group/remove-group`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "api_token": token,
                "group_id": groupId,

            })

        });
        const newData = await req.json();
        return setData(newData);
    };


    return (
        <>
            <Modal
                show={addingGroup}
                onHide={() => showAddingGroup(false)}
                backdrop="static">
                <Modal.Header closeButton>
                    <span className='text-h2'>Create Group</span>
                </Modal.Header>
                <Modal.Body>
                    <Container style={{ width: '80%' }}>
                        <Row>
                            <Col>
                                <div><label htmlFor='txtGroupName'>Group Name</label></div>
                                <input type='text' onChange={(e) => setNewGroupName(e.target.value)} />
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-outline-primary" onClick={() => showAddingGroup(false)}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={() => { fetchData(); showAddingGroup(false) }}>
                        Update Status
                    </button>
                </Modal.Footer>
            </Modal>


            <Header />
            <Container>
                <div className="search">
                    <Row>

                        <Col sm={3}>
                            <label htmlFor="companysearch" className="form-label">Search</label>
                            <input type="text" className="form-control" placeholder="Search" id="companysearch"
                                onChange={async (e) => {
                                    setSearch(e.target.value);
                                    fetchData(e.target.value);
                                }
                                } placeholder="Search" />

                        </Col>
                        <Col sm={7}></Col>
                        <Col sm={2}>
                            <a className="btn btn-primary addbtn" onClick={() => showAddingGroup(true)}>Add Group</a>
                        </Col>

                    </Row>
                </div>
                <div className="listing">
                    <table id="example" className="table table-striped">
                        <thead>
                            <tr>
                                <th><div onClick={(e) => {
                                    const srchval1 = 'group_name'
                                    if (sort_by != srchval1) {
                                        setDesc(true);
                                        setSortby(srchval1);
                                    } else {
                                        if (is_desc == true) {
                                            setDesc(false);
                                        } else {
                                            setDesc(true);
                                        }
                                    }
                                    fetchData();
                                }
                                }>Group Name</div></th>

                                <th><div onClick={(e) => {
                                    // reference_id
                                    const srchval3 = 'date_created'
                                    if (sort_by != srchval3) {
                                        setDesc(true);
                                        setSortby(srchval3);
                                    } else {
                                        if (is_desc == true) {
                                            setDesc(false);
                                        } else {
                                            setDesc(true);
                                        }
                                    }
                                    fetchData();
                                }
                                }>Date Created</div></th>


                                <th><div onClick={(e) => {
                                    // reference_id
                                    const srchval4 = 'no_companies'
                                    if (sort_by != srchval4) {
                                        setDesc(true);
                                        setSortby(srchval4);
                                    } else {
                                        if (is_desc == true) {
                                            setDesc(false);
                                        } else {
                                            setDesc(true);
                                        }
                                    }
                                    fetchData();
                                }
                                }>No. of Companies</div></th>
                                <th><div>Actions</div></th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataList?.data?.map((item) => (

                                <tr key={item._id}>
                                    {/* {post.title} */}
                                    <td>{item?.group_name}</td>
                                    <td>{item?.date_created}</td>
                                    <td>{item?.no_companies}</td>
                                    <td>
                                        <>
                                            <Link href={`/groups/${item._id}`}><a className="btn viewmore">Show Companies</a></Link> &nbsp;
                                            <button className="btn viewmore" onClick={(e) => deactivateGroup(item._id)}>Deactivate</button>
                                            <button className="btn viewmore" onClick={(e) => removeGroup(item._id)}>Delete Group</button>
                                        </>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* <Pagination page={page} totalPage={totalPage} lastPage={lastPage} /> */}
                </div>
            </Container>
        </>
    )
}

/**
 *
 *
 * @export
 * @param {*} { query: { page = 1, data = null, totalPage = 10 } }
 * @return {*} 
 */
export async function getServerSideProps({ query: { page = 1, data = null, totalPage = 10 } }) {
    const start = +page === 1 ? 0 : (+page + 1)
    /** 
     * limit, start, search item
     */
    return {
        props: {
            data: data,
            page: page,
            totalPage
        }
    }

}

export default Groups




/*
group/list
{
  api_token: ‘eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYWI1NWYwMTE4NGI3MTcxOTQxMmQ5ZCIsImVtYWlsX2lkIjoiYWRtaW5AamtsYWJzLmNhIiwiY3JlYXRlX2RhdGUiOiIyMDIxLTEyLTA0VDEyOjA5OjQ3LjMyNVoiLCJpYXQiOjE2Mzg2MTk3ODd9.k6xQ66O_9QOs9nH1SxFETOl2_n9ktbbdDHO4cXwedH8’,
  sort_by: ‘company_count or name or company_count’,
  search: ‘’,
  is_desc: true or false,
  skip: 0,
  limit: 15
}
group/create-group
{
  api_token: ‘eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYWI1NWYwMTE4NGI3MTcxOTQxMmQ5ZCIsImVtYWlsX2lkIjoiYWRtaW5AamtsYWJzLmNhIiwiY3JlYXRlX2RhdGUiOiIyMDIxLTEyLTA0VDEyOjA5OjQ3LjMyNVoiLCJpYXQiOjE2Mzg2MTk3ODd9.k6xQ66O_9QOs9nH1SxFETOl2_n9ktbbdDHO4cXwedH8’,
  group_name: ‘Test group name’
}
group/remove-group
{
  api_token: ‘eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYWI1NWYwMTE4NGI3MTcxOTQxMmQ5ZCIsImVtYWlsX2lkIjoiYWRtaW5AamtsYWJzLmNhIiwiY3JlYXRlX2RhdGUiOiIyMDIxLTEyLTA0VDEyOjA5OjQ3LjMyNVoiLCJpYXQiOjE2Mzg2MTk3ODd9.k6xQ66O_9QOs9nH1SxFETOl2_n9ktbbdDHO4cXwedH8’,
  group_id: ‘617b07332210ef2dd011af5d’
}
*/