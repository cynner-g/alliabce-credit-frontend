export const getMax = (arr, prop) => {
    var max = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][prop]) {
            if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
                max = arr[i];
        }
    }
    return max;
}

export const getUnique = (value, index, self) => {
    var selfStr = isJSONString(self);
    var valueStr = isJSONString(value);
    return selfStr.indexOf(isJSONString(valueStr)) === index;
}

export const isJSONString = (value) => {
    try {
        return JSON.stringify(value);
    }
    catch (ex) {
        return value;
    }
}

export const removeKey = (obj, key) => {
    if (Array.isArray(obj)) {
        obj.map((itm) => {
            delete itm[key];
            return itm;
        })
    }
    else {
        delete obj[key];
    }
    return obj;
}

export const parse = (data) => {
    let values = typeof (data) == "string" ? JSON.parse(data) : data;
    return values;
}

export const trim = (value, trims, replaceVal) => {
    trims.forEach(el => {
        while (value.indexOf(el) >= 0) {
            value = value.replace(el, replaceVal);
        }
    });
    return value;
}

export const formatDate = (d, format) => {
    //possible formats:
    //dd: 01-31
    //ddd: Mon, Tue, Wed...
    //dddd: Monday, Tuesday...
    //h: 12 hour time - 1,2,3...12
    //hh: 12 hour time - 01,02,03...12
    //H: 24 hour time - 0,1,2...23
    //HH:24 hour time - 00,01,02...23
    //m: minute 0-59
    //mm: minute 00-59
    //M: month 1-12
    //MM: month 01-12
    //MMM: Jan, Feb, Mar...
    //MMMM: January, February...
    //ss: seconds
    //SS: milliseconds
    //t: A or P
    //tt: AM or PM
    //y: year 0-99
    //yy: year 00-99
    //yyyy: year: 0000-9999
    let dt = new Date(d);

    // console.log("Date: ", dt)

    if (!dt) dt = new Date();
    // dt = new Date(Date.parse(dt));
    const getMonthName = (m) => {
        let month = [];
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        return month[m];
    }

    const getShortMonthName = (m) => {
        let month = [];
        month[0] = "Jan";
        month[1] = "Feb";
        month[2] = "Mar";
        month[3] = "Apr";
        month[4] = "May";
        month[5] = "Jun";
        month[6] = "Jul";
        month[7] = "Aug";
        month[8] = "Sep";
        month[9] = "Oct";
        month[10] = "Nov";
        month[11] = "Dec";
        return month[m];
    }

    const getDayName = (d) => {
        let weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        return weekday[d];
    }

    const getShortDayName = (d) => {
        let weekday = new Array(7);
        weekday[0] = "Sun";
        weekday[1] = "Mon";
        weekday[2] = "Tues";
        weekday[3] = "Wed";
        weekday[4] = "Thurs";
        weekday[5] = "Fri";
        weekday[6] = "Sat";
        return weekday[d];
    }

    //Start with year and work down
    if (format.indexOf('yyyy') >= 0) format = format.replace('yyyy', dt.getFullYear());
    else if (format.indexOf('yy') >= 0) {
        let year = dt.getFullYear() - 2000;
        if (year < 10) year = `0${year}`;
        format = format.replace('yy', year)
    } else if (format.indexOf('y') >= 0) format = format.replace('yyyy', dt.getFullYear() - 2000);

    //AM/PM
    if (format.indexOf('tt') >= 0) format = format.replace('tt', dt.getHours >= 12 ? 'PM' : 'AM');
    if (format.indexOf('t') >= 0) format = format.replace('t', dt.getHours >= 12 ? 'P' : 'A');

    //Month
    if (format.indexOf('MMMM') >= 0) format = format.replace('MMMM', getMonthName(dt.getMonth()))
    if (format.indexOf('MMM') >= 0) format = format.replace('MMM', getShortMonthName(dt.getMonth()))
    if (format.indexOf('MM') >= 0) {
        let month = dt.getMonth() + 1;
        if (month < 10) month = `0${month}`;
        format = format.replace('MM', month)
    }
    if (format.indexOf('M') >= 0) format = format.replace('M', dt.getMonth() + 1)

    //Minutes
    if (format.indexOf('mm') >= 0) {
        let minute = dt.getMinutes();
        if (minute < 10) minute = `0${minute}`;
        format = format.replace('mm', minute)
    }
    if (format.indexOf('m') >= 0) format = format.replace('m', dt.getMinutes())

    //Hours - 24 hour clock
    if (format.indexOf('HH') >= 0) {
        let hour = dt.getHours();
        if (hour < 10) hour = `0${hour}`;
        format = format.replace('HH', hour)
    }
    if (format.indexOf('H') >= 0) format = format.replace('H', dt.gethours())

    // Hours - 12 housr clock
    if (format.indexOf('hh') >= 0) {
        let hour = dt.getHours();
        if (hour > 12) hour -= 12;
        if (hour < 10) hour = `0${hour}`;
        format = format.replace('hh', hour)
    }
    if (format.indexOf('h') >= 0) {
        let hour = dt.getHours();
        if (hour > 12) hour -= 12;
        format = format.replace('h', hour)
    }

    if (format.indexOf('dddd') >= 0) format = format.replace('dddd', getDayName(dt.getDay()));
    if (format.indexOf('ddd') >= 0) format = format.replace('ddd', getShortDayName(dt.getDay()));
    if (format.indexOf('dd') >= 0) {
        let date = dt.getDate();
        if (date < 10) date = `0${date}`;
        format = format.replace('dd', date)
    }
    if (format.indexOf('d') >= 0) format = format.replace('d', dt.getDate());

    if (format.indexOf('ss') >= 0) {
        let seconds = dt.getSeconds();
        if (seconds < 10) seconds = `0${seconds}`;
        format = format.replace('ss', seconds)
    }
    if (format.indexOf('SS') >= 0) {
        let milliSeconds = dt.getMilliseconds();
        if (milliSeconds < 10) milliSeconds = `0${milliSeconds}`;
        format = format.replace('ss', milliSeconds)
    }

    return format;
}