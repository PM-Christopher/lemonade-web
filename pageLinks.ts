import home_icon from "./src/images/icons/HomeIcon.png"
import tribe_icon from "./src/images/icons/ChatIcon.png"
import event_icon from "./src/images/icons/CalendarIcon.png"
import business_icon from "./src/images/icons/CaseIcon.png"
import connect_icon from "./src/images/icons/WorldIcon.png"

export const navLinks = [
    {
        name: "Home",
        path: "/",
        icon: home_icon
    },
    {
        name: "Tribe",
        path: "/tribe",
        icon: tribe_icon
    },
    {
        name: "Events",
        path: "/event",
        icon: event_icon
    },
    // {
    //     name: "Business",
    //     path: "/business",
    //     icon: business_icon
    // },
    {
        name: "Connect",
        path: "/connect",
        icon: connect_icon
    }
]

export const timezones = [
    { label: "(GMT-12:00) International Date Line West", value: "Pacific/Kwajalein" },
    { label: "(GMT-11:00) Midway Island, Samoa", value: "Pacific/Midway" },
    { label: "(GMT-10:00) Hawaii", value: "Pacific/Honolulu" },
    { label: "(GMT-09:00) Alaska", value: "America/Anchorage" },
    { label: "(GMT-08:00) Pacific Time (US & Canada)", value: "America/Los_Angeles" },
    { label: "(GMT-07:00) Mountain Time (US & Canada)", value: "America/Denver" },
    { label: "(GMT-06:00) Central Time (US & Canada)", value: "America/Chicago" },
    { label: "(GMT-05:00) Eastern Time (US & Canada)", value: "America/New_York" },
    { label: "(GMT-04:00) Atlantic Time (Canada)", value: "America/Halifax" },
    { label: "(GMT-03:00) Greenland", value: "America/Godthab" },
    { label: "(GMT-02:00) Mid-Atlantic", value: "Atlantic/South_Georgia" },
    { label: "(GMT-01:00) Azores", value: "Atlantic/Azores" },
    { label: "(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, London", value: "Europe/London" },
    { label: "(GMT+01:00) Amsterdam, Berlin, Rome, Paris", value: "Europe/Berlin" },
    { label: "(GMT+02:00) Athens, Jerusalem, Istanbul", value: "Europe/Athens" },
    { label: "(GMT+03:00) Moscow, Baghdad", value: "Europe/Moscow" },
    { label: "(GMT+04:00) Abu Dhabi, Muscat", value: "Asia/Dubai" },
    { label: "(GMT+05:00) Islamabad, Karachi, Tashkent", value: "Asia/Karachi" },
    { label: "(GMT+06:00) Almaty, Dhaka", value: "Asia/Dhaka" },
    { label: "(GMT+07:00) Bangkok, Hanoi, Jakarta", value: "Asia/Bangkok" },
    { label: "(GMT+08:00) Beijing, Hong Kong, Singapore", value: "Asia/Singapore" },
    { label: "(GMT+09:00) Tokyo, Seoul", value: "Asia/Tokyo" },
    { label: "(GMT+10:00) Sydney, Guam", value: "Australia/Sydney" },
    { label: "(GMT+11:00) Magadan, Solomon Islands", value: "Pacific/Guadalcanal" },
    { label: "(GMT+12:00) Auckland, Fiji", value: "Pacific/Auckland" },
];