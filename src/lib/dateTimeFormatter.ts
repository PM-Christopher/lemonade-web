export const formatDate = (dateString: Date) => {
    const date = new Date(dateString)

    const dayMonthFormatter = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long'
    })

    return dayMonthFormatter.format(date);
}

export const formatTime = (dateString: Date) => {
    const date = new Date(dateString)

    const timeFormatter = new Intl.DateTimeFormat('en-GB', {
        hour: 'numeric',
        hour12: true,
    });

    return timeFormatter.format(date).toUpperCase();
}

export const formatLongDate = (dateString: Date) => {
    const date = new Date(dateString)

    const dayMonthFormatter = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: "numeric"
    })

    return dayMonthFormatter.format(date);
}