import { transporter, mailOptionSelf, mailOption } from '../../../src/components/config/nodemailer'

const CONTACT_MESSAGE_FIELDS = {
  firstName: 'Име',
  lastName: 'Фамилия',
  email: 'Email',
  phoneNumber: 'Номер',
  checkInDate: 'Настаняване',
  checkOutDate: 'Напускане',
  additionalDetails: 'Допълнителни Детаийли (Избирателно)',
};

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const data = req.body;

    // Must have all the below input forms filled out in the form, or the form will not submit and instead return an error
    if (
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.phoneNumber ||
      !data.checkInDate ||
      !data.checkOutDate ||
      !data.additionalDetails
    ) {
      return res.status(400).json({ message: 'Bad Request' });
    }

    try {
      // Attempt to send the email with accompanying data in the proper format and email subject
      await transporter.sendMail({
        ...mailOptionSelf
        ,
        // Callback to function that converts all relevant data into proper text and html format for the email
        ...generateEmailContent(data),
        subject: 'Нова Заявка',
      });
      return res.status(200).json({ success: true });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: e.message });
    }
  }
  // Return bad status if not a 'POST' method
  return res.status(400).json({ message: 'Bad Request' });
};

// This function takes an object 'data' as an argument and generates email content in two formats: plain text and HTML.
const generateEmailContent = (data) => {
  // Used to map the key names of the data object to their corresponding display names, and these display names are used in the formatted string
  const stringData = Object.entries(data).reduce(
    (str, [key, value]) =>
      (str += `${CONTACT_MESSAGE_FIELDS[key]}: \n${value} \n \n`),
    ''
  );

  // Generate a header and paragraph HTML element for each key-value pair
  const htmlData = Object.entries(data).reduce(
    (str, [key, value]) =>
    (str += `<h3 class="form-heading" style="text-align: left;font-weight: bold">${CONTACT_MESSAGE_FIELDS[key]}</h3>
<p class="form-answer" style="text-align: left;">${value}</p>
`),
    ''
  );
  // Returns the generated 'stringData' and HTML for the email
  return {
    text: stringData,
    html: `
<!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          body { font-family: Arial, sans-serif; background: #fff; padding: 20px; }
          .form-heading { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
          .form-answer { font-size: 16px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h2>Благодарим ви за запитването!</h2>
        <div class="form-container">
          ${htmlData}
        </div>
      </body>
      </html>
`,
  };
};

export default handler;
