// CHATBOT with Gemini API (Backend)
// Local development: http://localhost:3001
// Production (Vercel): /api/chat
const BACKEND_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001' 
  : '';

const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotContainer = document.getElementById('chatbotContainer');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const chatbotMessages = document.getElementById('chatbotMessages');

// Fallback responses in case API fails
const botResponses = {
  greeting: [
    "Hi! 👋 I'm Rendell's AI assistant. How can I help you today?",
    "Hello! What can I assist you with?"
  ],
  default: [
    "I'm here to answer questions about Rendell's services, skills, and how to get in touch. Feel free to ask! 😊",
    "You can ask me about: services, skills, contact info, or how to schedule a consultation."
  ],
  error: [
    "Sorry, I had trouble processing that. Could you try again?",
    "I'm having a moment - please try your question again!"
  ]
};

// Call backend API
async function callBackendAPI(userMessage) {
  try {
    const apiUrl = BACKEND_URL ? `${BACKEND_URL}/api/chat` : '/api/chat';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Backend error:', error);
      
      if (error.error?.includes('API key')) {
        return "⚠️ " + error.error;
      }
      return botResponses.error[Math.floor(Math.random() * botResponses.error.length)];
    }

    const data = await response.json();
    return data.message || botResponses.error[0];
  } catch (error) {
    console.error('API call error:', error);
    
    if (error.message.includes('Failed to fetch')) {
      return "⚠️ Backend server is not running. Please start the server with 'npm start'";
    }
    
    return botResponses.error[Math.floor(Math.random() * botResponses.error.length)];
  }
}

// Get bot response (uses backend API)
async function getBotResponse(userMessage) {
  return await callBackendAPI(userMessage);
}

// Toggle chatbot
chatbotToggle.addEventListener('click', () => {
  chatbotContainer.classList.add('active');
  chatbotToggle.classList.add('active');
  chatbotInput.focus();
});

chatbotClose.addEventListener('click', () => {
  chatbotContainer.classList.remove('active');
  chatbotToggle.classList.remove('active');
});

// Send message
async function sendMessage() {
  const message = chatbotInput.value.trim();
  
  if (message === '') return;
  
  // Add user message
  const userMessageDiv = document.createElement('div');
  userMessageDiv.className = 'message user-message';
  userMessageDiv.innerHTML = `<p>${escapeHtml(message)}</p>`;
  chatbotMessages.appendChild(userMessageDiv);
  
  // Clear input
  chatbotInput.value = '';
  chatbotSend.disabled = true;
  
  // Scroll to bottom
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  
  // Show typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message bot-message typing-indicator';
  typingDiv.innerHTML = `<p>🤖 Thinking...</p>`;
  chatbotMessages.appendChild(typingDiv);
  
  try {
    const response = await getBotResponse(message);
    typingDiv.remove();
    
    const botMessageDiv = document.createElement('div');
    botMessageDiv.className = 'message bot-message';
    botMessageDiv.innerHTML = `<p>${escapeHtml(response)}</p>`;
    chatbotMessages.appendChild(botMessageDiv);
  } catch (error) {
    typingDiv.remove();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message bot-message';
    errorDiv.innerHTML = `<p>Oops! Something went wrong. Please try again.</p>`;
    chatbotMessages.appendChild(errorDiv);
  }
  
  chatbotSend.disabled = false;
  
  // Scroll to bottom
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

chatbotSend.addEventListener('click', sendMessage);

chatbotInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !chatbotSend.disabled) {
    sendMessage();
  }
});

// Utility function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}


const darkModeToggle = document.getElementById('darkModeToggle');
const html = document.documentElement;

// Load dark mode preference from localStorage
if (localStorage.getItem('darkMode') === 'enabled') {
  html.classList.add('dark-mode');
  document.body.classList.add('dark-mode');
  darkModeToggle.textContent = '☀️';
}

darkModeToggle.addEventListener('click', () => {
  html.classList.toggle('dark-mode');
  document.body.classList.toggle('dark-mode');
  
  if (html.classList.contains('dark-mode')) {
    darkModeToggle.textContent = '☀️';
    localStorage.setItem('darkMode', 'enabled');
  } else {
    darkModeToggle.textContent = '🌙';
    localStorage.setItem('darkMode', 'disabled');
  }
});

// SCROLL ANIMATIONS
const revealItems = document.querySelectorAll('section, .service-card');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.15 });

revealItems.forEach(item => {
  item.style.opacity = 0;
  item.style.transform = 'translateY(40px)';
  item.style.transition = 'all 0.6s ease';
  observer.observe(item);
});
