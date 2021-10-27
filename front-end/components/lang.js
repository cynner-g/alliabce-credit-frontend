import { useRouter } from "next/dist/client/router";
import Link from 'next/link'

const Lang = () => {
    const { locale, locales, defaultLocale, asPath } = useRouter();

    return (
        <>
            <div>
                <span>Current Language: </span>
                <span
                    style={{
                        borderRadius: "3px",
                        backgroundColor: "blue",
                        color: "white",
                        padding: "2px",
                    }}> {locale} </span> | <Link
                        activeClassName={locale === "fr"}
                        href={asPath}
                        locale="fr">fr-FR</Link> | <Link
                            activeClassName={locale === "en"}
                            href={asPath}
                            locale="en">en-US</Link>
            </div>
        </>
    )
}
export default Lang;