export function GetNameInitial(name: string) {
    return name[0].toUpperCase()
}

export function formatDate(dateString: string) {
    const date = new Date(dateString)

    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    let monthStr = ""

    switch (month) {
        case 1:
            monthStr = "Jan"
            break
        case 2:
            monthStr = "Feb"
            break
        case 3:
            monthStr = "Mar"
            break
        case 4:
            monthStr = "Apr"
            break
        case 5:
            monthStr = "May"
            break
        case 6:
            monthStr = "Jun"
            break
        case 7:
            monthStr = "Jul"
            break
        case 8:
            monthStr = "Aug"
            break
        case 9:
            monthStr = "Sep"
            break
        case 10:
            monthStr = "Oct"
            break    
        case 11:
            monthStr = "Nov"
            break
        case 12:
            monthStr = "Dec"
            break
    }

    if (day && month && year) {
        return `${day} ${monthStr} ${year}`
    }

    return ""
}