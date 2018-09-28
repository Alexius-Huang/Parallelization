/* eslint-disable import/prefer-default-export */

const aMinute = 60 * 1000;
const anHour = 60 * aMinute;
const aDay = 24 * anHour;
const aWeek = 7 * aDay;
const aMonth = 4 * aDay;

export function timestampStringify(timestamp) {
  const dateTime = new Date(timestamp);
  const year = dateTime.getUTCFullYear();
  const month = dateTime.getMonth() + 1;
  const date = dateTime.getDate();
  const hours = dateTime.getHours() + 1;
  const minutes = dateTime.getMinutes();

  const now = Date.now();
  const withinOneHour = now - anHour < timestamp;
  if (withinOneHour) {
    const delta = now - timestamp;
    const minutes = Math.floor(delta / aMinute);
    return `About ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  const withinOneDay = now - aDay < timestamp;
  if (withinOneDay) {
    const delta = now - timestamp;
    const hours = Math.floor(delta / anHour);
    return `About ${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  const withinOneWeek = now - aWeek < timestamp;
  if (withinOneWeek) {
    const delta = now - timestamp;
    const days = Math.floor(delta / aDay);
    return `About ${days} day${days > 1 ? 's' : ''} ago`;
  }

  const withinOneMonth = now - aMonth < timestamp;
  if (withinOneMonth) {
    const delta = now - timestamp;
    const weeks = Math.floor(delta / aWeek);
    return `About ${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }

  const monthString = String(month).length === 1 ? `0${month}` : String(month);
  const dateString = String(date).length === 1 ? `0${date}` : String(date);
  const hoursString = String(hours).length === 1 ? `0${hours}` : String(hours);
  const minutesString = String(minutes).length === 1 ? `0${minutes}` : String(minutes);
  return `${year}/${monthString}/${dateString} ${hoursString}:${minutesString}`;
}
