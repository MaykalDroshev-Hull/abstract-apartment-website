export default function handler(req, res) {
    // Retrieve the `content` query parameter from the request
    const { content } = req.query;
  
    // Check if the content is provided
    if (!content) {
      return res.status(400).json({ error: 'No content provided' });
    }
  
    // Set headers to specify this is a downloadable .ics file
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', 'attachment; filename=appointment.ics');
  
    // Decode the content and send it as the response
    res.send(decodeURIComponent(content).replaceAll("  ","\\n"));
  }
  