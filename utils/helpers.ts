export const formatTime = (date: Date | string | number | null | undefined): string => {
  // Handle null or undefined dates
  if (!date) return '';
  
  // Create a Date object from various input types
  let dateObj: Date;
  if (date instanceof Date) {
    dateObj = date;
  } else {
    dateObj = new Date(date);
  }
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};