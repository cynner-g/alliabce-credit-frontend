const Address = function ({ address }) {
    return (
        <>
            <div>
                address: {address?.address_line}<br />
                city_name: {address?.city_name}<br />
                state_name: {address?.state_name}<br />
                zip_code: {address?.zip_code}<br />
            </div>

        </>
    )
}
export default Address;