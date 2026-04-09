export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'API key not configured. Please set GEMINI_API_KEY environment variable.' 
      });
    }

    const SYSTEM_PROMPT = `You are Rendell German's AI assistant. He's a Full Stack Developer skilled in: HTML5, CSS, JavaScript, Python, PHP, Laravel, Node.js, React, Bootstrap, MySQL, Firebase, Vercel, Apache, Adobe XD, Canva.

Services: Web Development, Full Stack Development, Python Development, Database Design, Website Redesign, UI/UX Design.

Contact: germanrendell14@gmail.com | GitHub: github.com/DXLL14 | LinkedIn: linkedin.com/in/rendell-german-78388a219/ | Schedule: calendly.com/germanrendell14/30min

Keep responses short (1-2 sentences). He has 50+ completed projects.`;

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=' + GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${SYSTEM_PROMPT}\n\nUser: ${message}`
            }]
          }],
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_NONE'
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Gemini API error:', error);
      return res.status(response.status).json({ 
        error: 'Failed to get response from AI service' 
      });
    }

    const data = await response.json();
    const botMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!botMessage) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    res.status(200).json({ message: botMessage });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
