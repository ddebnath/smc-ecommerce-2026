export const getEventStatus = (date) => {
  if (!date) return "Unknown";

  const today = new Date();
  const eventDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  if (eventDate > today) return "Upcoming";
  if (eventDate < today) return "Past";
  if (eventDate == today) return "Today";

  return "Ongoing";
};
