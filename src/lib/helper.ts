import moment from 'moment';

export const formatName = (name: string) => {
    if(name) {
        return name.split(" ")
    }
    return null
}

export const formatStringUCFirst = (value: string) => {
    return value?.charAt(0)?.toUpperCase() + value?.slice(1)?.toLowerCase()
}

export const formatDecimal = (value: number, places: number) => {
    if (value === 0) {
        return 0
    } else {
        return parseFloat(`${value}`).toFixed(places)
    }
}

export const formatString = (str: string) => {
    if (str) {
        if (str.includes('_')) {
            return formatStringUCFirst(str.split('_').join(' '));
        }
        return formatStringUCFirst(str);
    }
}

export const splitLemonId = (str: string) => {
    if (str) {
        let str_split = str.split("-")
        return str_split[1]
    }
}

export const formatTimeAgo = (timeString: string) => {
    const now = moment();
    const then = moment(timeString);
    const diffInSeconds = now.diff(then, 'seconds');

    if (diffInSeconds < 60) {
        return `${diffInSeconds}s ago`;
    }

    const diffInMinutes = now.diff(then, 'minutes');
    if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    }

    const diffInHours = now.diff(then, 'hours');
    if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    }

    const diffInDays = now.diff(then, 'days');
    return `${diffInDays}d ago`;
}

export const formatSingleTime = (timeString: string) => {
    return moment(timeString).format("HH:mm");
}

export const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (value: any) => (value * Math.PI) / 180;

    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
     // Distance in km
    return Math.round(R * c);
}

export const getInitials = (name?: string | null): string => {
    if (!name) return ""; // handle undefined/null
    const trimmed = name.trim();
    if (!trimmed) return "";

    return trimmed
        .split(/\s+/) // split by one or more spaces
        .map(word => word.charAt(0).toUpperCase())
        .join("");
};