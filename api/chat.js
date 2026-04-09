export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  const SYSTEM_PROMPT = `You are Rendell German's AI assistant. He's a Full Stack Developer skilled in: HTML5, CSS, JavaScript, Python, PHP, Laravel, Node.js, React, Bootstrap, MySQL, Firebase, Vercel, Apache, Adobe XD, Canva.

Services: Web Development, Full Stack Development, Python Development, Database Design, Website Redesign, UI/UX Design.

Contact: germanrendell14@gmail.com | GitHub: github.com/DXLL14 | LinkedIn: linkedin.com/in/rendell-german-78388a219/ | Schedule: calendly.com/germanrendell14/30min

Keep responses short (1-2 sentences). He has 50+ completed projects.`;

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Missing GEMINI_API_KEY in environment variables",
      });
    }

    const response = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${SYSTEM_PROMPT}\n\nUser: ${message}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const botMessage =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    return res.status(200).json({ message: botMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}