// aux method to format dates in the app
export const formatDateToHumanReadable = (isoString: string): string => {

    //trying to setup a date
    const date = new Date(isoString)

    //returns an empty string if date is invalid
    if (isNaN(date.getTime())) {
        return ''
    }

    // formats date to european date system
    return date.toLocaleString('pt-PT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}