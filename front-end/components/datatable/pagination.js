import { useRouter } from "next/router";

const Pagination = function ({ page, totalPage, lastPage }) {
    console.warn(lastPage, ":", page);
    const router = useRouter();
    return (
        <>
            <button onClick={() => router.push(`/credit-report?page=${page - 1}`)} disabled={page <= 1}>Previous</button>
            <button onClick={() => router.push(`credit-report?page=${page + 1}`)} disabled={page >= lastPage}>Next</button>
        </>
    )
}

export default Pagination