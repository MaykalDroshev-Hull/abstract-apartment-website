/**
 * Send a contact form message.
 * @async
 * @param {object} data - The contact form data.
 * @returns {Promise<object>} A Promise that resolves to the JSON response from the API.
 * @throws {Error} Throws an error if the API response is not ok.
 */
export const sendContactForm = async (data) =>
  fetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/JSON'
    },
  }).then(res => {
    if (!res.ok) throw new Error('Failed to send message')
    return res.json()
  })

/**
 * Send a contact form message, but with more detail and more requirements when submitting the form
 * @async
 * @param {object} data - The contact form data.
 * @returns {Promise<object>} A Promise that resolves to the JSON response from the API.
 * @throws {Error} Throws an error if the API response is not ok.
 */
export const sendLongContactForm = async (data) =>
  fetch('/api/longContact', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/JSON'
    },
  }).then(res => {
    if (!res.ok) throw new Error('Неуспешно изпратена заявка, моля обадете се на посочения номер.')
    return res.json()
  })


/**
 * Sends a review form to the server database (planetscale).
 * @async
 * @param {Object} data - The data to be sent in the request body.
 * @returns {Promise<Object>} A Promise that resolves to the JSON response from the server.
 * @throws {Error} If the response status is not ok.
*/
export const sendReviewForm = async (data) =>
  fetch('/api/review', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => {
    if (!res.ok) throw new Error('Failed to submit review')
    return res.json()
  })

