/**
 * Generates a demo room server-side
 */

export default async function handler(req, res) {
    // if (req.method === 'POST') {
    //   const options = {
    //     method: 'POST',
    //     headers: {
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
    //     },
    //   };
  
      const response = await axios.get(
        `${process.env.DAILY_REST_DOMAIN}/presence`,
      );
  
      // const response = await dailyRes.json();
  
      if (response.error) {
        return res.status(400).json(response.error);
      }
  
      return res.status(200).json(response);
    // }
  
    // return res.status(500);
  }
  