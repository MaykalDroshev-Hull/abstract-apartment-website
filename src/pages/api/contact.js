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

  return {
    text: stringData,
    html: `<!DOCTYPE html>
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
      </html>`,
  };
};
