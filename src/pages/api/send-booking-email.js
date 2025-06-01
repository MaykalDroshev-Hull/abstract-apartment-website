// pages/api/send-booking-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { checkIn, checkOut, firstName, lastName, telephone, fullPrice, paidPrice  } = req.body;

  if (!checkIn || !checkOut || !firstName || !lastName || !telephone) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL,
        pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Booking Form" <${process.env.NEXT_PUBLIC_EMAIL}>`,
      to: process.env.NEXT_PUBLIC_EMAIL,
      subject: 'Нова Заявка - депозит платен',
      text: `
Нова Заявка е получена:

Имена: ${firstName} ${lastName}
Телефон: ${telephone}
Настаняване: ${checkIn}
Отдаване: ${checkOut}
Пълна Сума: €${fullPrice}
Платена Сума: €${paidPrice}
Оставащ баланс: €${fullPrice-paidPrice}
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to send email' });
  }
}
