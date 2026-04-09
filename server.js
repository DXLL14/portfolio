require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Gemini API endpoint
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are Rendell German's AI assistant. He's a Full Stack Developer skilled in: HTML5, CSS, JavaScript, Python, PHP, Laravel, Node.js, React, Bootstrap, MySQL, Firebase, Vercel, Apache, Adobe XD, Canva.

Services: Web Development, Full Stack Development, Python Development, Database Design, Website Redesign, UI/UX Design.

Contact: germanrendell14@gmail.com | GitHub: github.com/DXLL14 | LinkedIn: linkedin.com/in/rendell-german-78388a219/ | Schedule: calendly.com/germanrendell14/30min

Keep responses short (1-2 sentences). He has 50+ completed projects.`;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      return res.status(500).json({ 
        error: 'API key not configured. Please add GEMINI_API_KEY to .env file' 
      });
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
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
    });

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

    res.json({ message: botMessage });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`🚀 Chatbot backend running on http://localhost:${PORT}`);
  console.log(`Make sure GEMINI_API_KEY is set in .env file`);
});
