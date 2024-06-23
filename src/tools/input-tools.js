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

export function getMax16by9Dimensions(element = null, widthOffset = 0, heightOffset = 0) {
  let width, height;

  if (element) {
    width = element.clientWidth;
    height = element.clientHeight;
  } else {
    width = window.innerWidth;
    height = window.innerHeight;
  }

  // Apply the offsets
  width -= widthOffset;
  height -= heightOffset;

  // Calculate the maximum width and height that fit within the 16:9 aspect ratio
  let maxWidth = width;
  let maxHeight = (maxWidth / 16) * 9;

  // If the calculated height is greater than the available height, adjust the width and height
  if (maxHeight > height) {
    maxHeight = height;
    maxWidth = (maxHeight / 9) * 16;
  }

  return {
    width: maxWidth,
    height: maxHeight
  };
}

export function getMedia() {
  if (window.innerWidth >= 1280) {
    return 'pc';
  }
  if (window.innerWidth >= 768) {
    return 'tablet';
  }
  return 'mobile';
}
