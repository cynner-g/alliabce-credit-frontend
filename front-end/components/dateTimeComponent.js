
import {
    differenceInDays, format, formatRelative,
    subDays, parseISO
} from 'date-fns'

export const DateTime = (props) => {
    const buildTime = (props) => {
        let dt = parseISO(props.date) || parseISO(new Date());
        let txt = ''
        let cs = props?.className || null

        try {
            if (props.relative) {
                dt = parseISO(dt); //date-fns parse the ISO string to a correct date object
                let numDays = differenceInDays(new Date(), dt); //get number of days between now and then
                txt = formatRelative(subDays(dt, numDays), new Date()) //display in easy to read format
            }
            else {
                let day = 'MM-dd-uuuu'
                let time = 'h:mmaa'
                txt = (<>
                    <div>{format(dt, day)}</div>
                    <div style={{ marginTop: '-2px', fontSize: '12px' }}>{format(dt, time)}</div>
                </>)

            }
        }
        catch (ex) {
            if (props.showBlank) return <span className={cs}></span>
            else {
                props.dt = new Date();
                txt = buildTime(props);
            }
        }
        finally {
            return (<span className={cs} style={props.style ? props.style : null}>{txt}</span>)
        }
    }
    return buildTime(props);
}