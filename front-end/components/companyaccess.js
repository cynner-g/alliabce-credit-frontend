import Address from "./address";
import Link from 'next/link'

const CompanyAccess = function ({ access }) {
    return (
        <>
            {access?.map((item) => (
                <>
                    <div>{item}</div>
                </>
            ))}
        </>
    )
}
export default CompanyAccess;