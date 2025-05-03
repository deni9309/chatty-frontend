export const formatTimestamp = (timestamp: string | Date): string => {
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) {
    return 'Unknown date'
  }

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }

  return date.toLocaleDateString('en-US', options)
}
