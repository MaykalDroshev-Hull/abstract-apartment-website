/*bookingNotification.js - Sends an email when booking is created*/

 export const sendBookingNotification = async (data) =>
  fetch('/api/send-booking-email', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(res => {
    if (!res.ok) throw new Error('Failed to send booking notification');
    return res.json();
  });
