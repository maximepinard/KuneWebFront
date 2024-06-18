export function convertTimeToInteger(timeString) {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return totalSeconds;
}

export function convertIntegerToTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Ensure each component is two digits
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export function extractCodeFromYoutubeUrl(url) {
  // Regular expression to match YouTube watch URL and extract the 'v' parameter
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|.+\?v=)?([^&\s]+)/;
  const match = url.match(youtubeRegex);

  if (match && match[1]) {
    // If the URL is a YouTube URL and the 'v' parameter is found, return the video ID
    return match[1];
  } else {
    // If it's not a YouTube URL, return the original string
    return url;
  }
}
