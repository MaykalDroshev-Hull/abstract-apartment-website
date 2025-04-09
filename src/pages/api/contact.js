const generateEmailContent = (data) => {
  const stringData = Object.entries(data).reduce(
    (str, [key, value]) =>
      (str += `${CONTACT_MESSAGE_FIELDS[key]}: \n${value} \n \n`),
    ''
  );

  const htmlData = Object.entries(data).reduce(
    (str, [key, value]) =>
      (str += `<h1 class='form-heading' align='left'>${CONTACT_MESSAGE_FIELDS[key]}</h1><p class='form-answer' align='left'>${value}</p>`),
    ''
  );

  const eventTitle = "Асеа-М Заявка";
  const startDate = new Date(data.desiredDate).toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD
  const endDate = new Date(new Date(data.desiredDate).getTime() + 86400000).toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD, next day for all-day event

  const googleCalendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventTitle
  )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
    'Детайли: ' + stringData
  )}&location=${encodeURIComponent("43°09'28.5\"N 24°43'11.9\"E")}&trp=false`;

  const icsFileContent = `
  BEGIN:VCALENDAR
  VERSION:2.0
  BEGIN:VEVENT
  SUMMARY:${eventTitle}
  DTSTART;VALUE=DATE:${startDate}
  DTEND;VALUE=DATE:${endDate}
  DESCRIPTION:Appointment details: ${stringData}
  LOCATION:43°09'28.5"N 24°43'11.9"E
  GEO:43.157917;24.719972
  END:VEVENT
  END:VCALENDAR`.trim();

  const icsFileBase64 = Buffer.from(icsFileContent).toString("base64");
  const appleCalendarLink = `data:text/calendar;charset=utf-8;base64,${icsFileBase64}`;

  return {
    text: stringData,
    html: `<!DOCTYPE html>
    <html>
    <head>
      <title></title>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
      <style type="text/css">
        body, table, td, a {-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}
        table {border-collapse: collapse !important;}
        body {height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important;}
        @media screen and (max-width: 525px) {
          .wrapper {width: 100% !important; max-width: 100% !important;}
          .responsive-table {width: 100% !important;}
          .padding {padding: 10px 5% 15px 5% !important;}
          .section-padding {padding: 0 15px 50px 15px !important;}
        }
        .form-container {margin-bottom: 24px; padding: 20px; border: 1px dashed #ccc;}
        .form-heading {color: #2a2a2a; font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif; font-weight: 400; text-align: left; line-height: 20px; font-size: 18px; margin: 0 0 8px; padding: 0;}
        .form-answer {color: #2a2a2a; font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif; font-weight: 300; text-align: left; line-height: 20px; font-size: 16px; margin: 0 0 24px; padding: 0;}
        div[style*="margin: 16px 0;"] {margin: 0 !important;}
        .button {
          display: inline-block;
          font-size: 16px;
          font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
          color: white;
          text-decoration: none;
          background-color: #007bff;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin: 10px 5px;
          text-align: center;
        }
        .button:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body style="margin: 0 !important; padding: 0 !important; background: #fff">
      <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"></div>
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td bgcolor="#ffffff" align="center" style="padding: 10px 15px 30px 15px" class="section-padding">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px" class="responsive-table">
              <tr>
                <td>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td>
                        <h2>New Appointment Request</h2>
                        <div class="form-container">${htmlData}</div>
                        <a href="${googleCalendarLink}" target="_blank" class="button">Add to Google Calendar</a>
                        <a href="${appleCalendarLink}" target="_blank" class="button">Add to Apple Calendar</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`,
  };
};
