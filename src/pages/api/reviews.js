export default async function handler(req, res) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJF91uqn7dq0ARxnEmywQWheI&key=${apiKey}&language=bg`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('Google API response:', data); // Log the response to check if you are getting the reviews
  
      const reviews = data.result?.reviews || [];
      const formatted = reviews.map((r) => ({
        name: r.author_name,
        review: r.text,
        date: new Date(r.time * 1000).toLocaleDateString('bg-BG'),
        rating: r.rating,
        profilePhotoUrl: r.profile_photo_url || null,
      }));
  
      res.status(200).json({ reviews: formatted });
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  }
  