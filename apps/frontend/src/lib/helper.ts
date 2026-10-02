import moment from "moment";
import { aryIanaTimeZones } from "../../timezones";
import ct from "countries-and-timezones";
const displayRegion = new Intl.DisplayNames(["en"], { type: "region" });

export const formatName = (name: string) => {
  if (name) {
    return name.split(" ");
  }
  return null;
};

// next/image only optimizes images from hosts listed in next.config.mjs's
// images.remotePatterns (two: the DO Spaces bucket and Cloudinary) — any
// other hostname throws "Invalid src prop" and crashes the whole page, not
// just that image. Some seed/demo data has event_image values pointing at
// example.com (clearly placeholder, not a real image host), which doesn't
// need adding to the allowlist since it will never actually serve an
// image — treat it the same as a missing image instead.
const ALLOWED_IMAGE_HOSTS = [
  "dev-lemonade-bucket.lon1.digitaloceanspaces.com",
  "res.cloudinary.com",
];

export const getSafeImageSrc = (url: string | null | undefined, fallback: string) => {
  if (!url) return fallback;
  try {
    return ALLOWED_IMAGE_HOSTS.includes(new URL(url).hostname) ? url : fallback;
  } catch {
    return fallback;
  }
};

export const formatStringUCFirst = (value: string | undefined) => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const formatDecimal = (value: number, places: number) => {
  if (value === 0) {
    return 0;
  } else {
    return parseFloat(`${value}`).toFixed(places);
  }
};

export const formatString = (str: string | undefined) => {
  if (str) {
    if (str.includes("_")) {
      return formatStringUCFirst(str.split("_").join(" "));
    }
    return formatStringUCFirst(str);
  }
};

export const splitLemonId = (str: string) => {
  if (str) {
    const str_split = str.split("-");
    return str_split[1];
  }
};

export const formatTimeAgo = (timeString: string) => {
  const now = moment();
  const then = moment(timeString);
  const diffInSeconds = now.diff(then, "seconds");

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }

  const diffInMinutes = now.diff(then, "minutes");
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = now.diff(then, "hours");
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = now.diff(then, "days");
  return `${diffInDays}d ago`;
};

export const formatSingleTime = (timeString: string) => {
  return moment(timeString).format("HH:mm");
};

export const getDistanceFromLatLonInKm = (
  lat1: number | null | undefined,
  lon1: number | null | undefined,
  lat2: number | null | undefined,
  lon2: number | null | undefined,
) => {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371; // Earth's radius in km
  const dLat = toRad((lat2 ?? 0) - (lat1 ?? 0));
  const dLon = toRad((lon2 ?? 0) - (lon1 ?? 0));

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1 ?? 0)) *
      Math.cos(toRad(lat2 ?? 0)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // Distance in km
  return Math.round(R * c);
};

export const getInitials = (name?: string | null): string => {
  if (!name) return ""; // handle undefined/null
  const trimmed = name.trim();
  if (!trimmed) return "";

  return trimmed
    .split(/\s+/) // split by one or more spaces
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

const getOffsetMinutes = (timeZone: string, date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    timeZoneName: "longOffset", // e.g. "GMT+01:00"
  }).formatToParts(date);

  const raw = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT"; // "GMT", "GMT+01:00", "GMT-05:00"
  const m = raw.match(/^GMT([+-])(\d{2}):(\d{2})$/);

  if (!m) return 0; // "GMT" => 0
  const sign = m[1] === "-" ? -1 : 1;
  const hours = parseInt(m[2], 10);
  const mins = parseInt(m[3], 10);

  return sign * (hours * 60 + mins);
};

const getGmtLabel = (offsetMinutes: number) => {
  const sign = offsetMinutes < 0 ? "-" : "+";
  const abs = Math.abs(offsetMinutes);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return `GMT (${sign}${hh}:${mm})`;
};

export const getTimeZones = () => {
  const date = new Date();

  const mapped = aryIanaTimeZones.map((timeZone) => {
    const info = ct.getTimezone(timeZone);
    const countries = info?.countries?.map((code) => displayRegion.of(code) ?? code) ?? [];

    const offsetMinutes = getOffsetMinutes(timeZone, date);

    return {
      country: countries[0] ?? "Unknown",
      timeZone,
      offsetMinutes,
      gmt: getGmtLabel(offsetMinutes),
      now: date.toLocaleString("en-GB", { timeZone }),
    };
  });

  // Sort by GMT offset (then by timezone name to keep it stable)
  mapped.sort((a, b) => a.offsetMinutes - b.offsetMinutes || a.timeZone.localeCompare(b.timeZone));

  // Keep only GMT -12:00 .. +12:00 (remove this filter if you want ALL)
  return mapped.filter((x) => x.offsetMinutes >= -12 * 60 && x.offsetMinutes <= 12 * 60);
};
