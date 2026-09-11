export const formatDate = (dateString?: Date|string) => {
    if (dateString) {
        const date = new Date(dateString)

        const dayMonthFormatter = new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long'
        })

        return dayMonthFormatter.format(date);
    }
    return null
}

export const formatLongDate = (
    dateString?: string | Date,
    type: "long" | "mid" = "long"
): string | null => {
    if (dateString) {
        const date = new Date(dateString);
        if (type === "long") {
            const formatter = new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
            return formatter.format(date);
        } else if (type === "mid") {
            const formatter = new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
                weekday: "short",
            });
            return formatter.format(date);
        }
    }
    return null;
};


export const formatTime = (value: Date | string | null) => {
    if (!value) return null;

    const date = value instanceof Date ? value : new Date(value);

    const timeFormatter = new Intl.DateTimeFormat('en-GB', {
        hour: 'numeric',
        minute: '2-digit',  // 👈 include minutes
        hour12: true,
    });

    // e.g. "1:30 pm" → "1:30PM"
    return timeFormatter.format(date).replace(' ', '').toUpperCase();
};

export const formatLongTime = (dateString?: string | Date): string | null => {
    if (dateString) {
        const date = new Date(dateString);

        const timeFormatter = new Intl.DateTimeFormat('en-GB', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });

        return timeFormatter.format(date).toUpperCase();
    }
    return null;
};