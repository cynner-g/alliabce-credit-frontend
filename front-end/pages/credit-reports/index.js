import Header from "../../components/header"
import { useRouter } from "next/router"
import Pagination from "../../components/datatable/pagination"
import DynamicTable from "../../components/DynamicTable"

const CreditReports = ({ page, totalPage }) => {
    const router = useRouter()
    const limit = 3
    const lastPage = Math.ceil(totalPage / limit)

    let data = [{
        Name: "Tiger Nixon",
        Position: "System Architect",
        Office: "Edinburgh",
        Age: "61",
        Start_date: "2011/04/25",
        Salary: "$320,800",
    }]

    const handleClick = (e, colName, rowId) => {
        alert(JSON.stringify(data[rowId]));

    }

    let columns = [
        {
            colName: "Name",
            displayName: "Name",
            type: "link",
            visible: true,
            onClick: handleClick,
        }
        , {
            colName: "Position",
            displayName: "Position",
            visible: true
        }
        , {
            colName: "Office",
            displayName: "Office",
            visible: true
        }
        , {
            colName: "Age",
            displayName: "Age",
            type: "link",
            onClick: handleClick,
        }
        , {
            colName: "Start date",
            displayName: "Start_date",
            type: "link",
            onClick: handleClick,
        }
        , {
            colName: "Salary",
            displayName: "Salary",
            type: "link",
            onClick: handleClick,
        }
    ]

    return (
        <>
            <Header />
            <br />
            <DynamicTable
                title="Credit Reports"
                data={data}
                columns={columns}
                border={1}
                selectableRows={true}
                striped={true}
                paging={15}
            />
        </>


    )

    /* <table id="example" className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Office</th>
                        <th>Age</th>
                        <th>Start date</th>
                        <th>Salary</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Tiger Nixon</td>
                        <td>System Architect</td>
                        <td>Edinburgh</td>
                        <td>61</td>
                        <td>2011/04/25</td>
                        <td>$320,800</td>
                    </tr>
                </tbody>
            </table>
            <Pagination page={page} totalPage={totalPage} lastPage={lastPage} />
            </>
            */
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

export default CreditReports