import fs from 'fs';
import path from 'path';
import { create } from 'xmlbuilder2';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { bookings } = req.body;

    const xmlObj = {
      bookings: {
        booking: bookings.map((b) => ({
          date: b.date,
          isBooked: b.isBooked.toString(),
        })),
      },
    };

    const xml = create(xmlObj).end({ prettyPrint: true });

    const filePath = path.join(process.cwd(), 'public', 'data', 'booking.xml');

    fs.writeFile(filePath, xml, (err) => {
      if (err) {
        console.error('Error writing XML:', err);
        return res.status(500).json({ success: false });
      }
      return res.status(200).json({ success: true });
    });
  } else {
    res.status(405).end();
  }
}
