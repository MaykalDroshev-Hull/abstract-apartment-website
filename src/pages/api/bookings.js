import fs from 'fs';
import path from 'path';
import { parseStringPromise, Builder } from 'xml2js';

// Path to where the XML file will be stored
const filePath = path.resolve(process.cwd(), 'data', 'bookings.xml');

// Helper function to read the XML file and parse it to JSON
const readXMLFile = async () => {
  const xmlData = fs.readFileSync(filePath, 'utf8');
  const result = await parseStringPromise(xmlData);
  return result;
};

// Helper function to write the JSON data back to the XML file
const writeXMLFile = async (data) => {
  const builder = new Builder();
  const xml = builder.buildObject(data);
  fs.writeFileSync(filePath, xml, 'utf8');
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await readXMLFile();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error reading XML file' });
    }
  } else if (req.method === 'POST') {
    try {
      const { updatedData } = req.body;  // This should be a JSON object to be saved as XML
      await writeXMLFile(updatedData);
      res.status(200).json({ message: 'File saved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error writing XML file' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
