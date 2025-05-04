import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'public', 'data', 'booking.xml');

  try {
    const xml = fs.readFileSync(filePath, 'utf8');
    const parser = new XMLParser();
    const parsed = parser.parse(xml);

    const bookings = parsed.bookings?.booking || [];

    // Normalize to array if only one booking
    const normalized = Array.isArray(bookings) ? bookings : [bookings];

    const bookedMap = {};
    normalized.forEach((entry) => {
      if (entry.isBooked === 'true' || entry.isBooked === true) {
        bookedMap[entry.date] = true;
      }
    });

    res.status(200).json({ success: true, bookedDates: bookedMap });
  } catch (err) {
    console.error('Failed to read booking.xml:', err);
    res.status(500).json({ success: false });
  }
}
