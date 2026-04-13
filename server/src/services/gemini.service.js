const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY manquante dans .env');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'missing');
const model = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
});

const ORION_SYSTEM = `Tu es ORION, un assistant de vie intelligent tout-en-un.
Tu es concis, intelligent, direct et bienveillant.
Tu réponds toujours en français sauf si l'utilisateur parle une autre langue.
Tu peux aider avec : productivité, création, lifestyle, finances, planification et bien plus.`;

async function chat(messages) {
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));
  const last = messages[messages.length - 1];
  const session = model.startChat({
    history: [
      { role: 'user',  parts: [{ text: ORION_SYSTEM }] },
      { role: 'model', parts: [{ text: 'Compris, je suis ORION.' }] },
      ...history,
    ],
  });
  const result = await session.sendMessage(last.content);
  return result.response.text();
}

async function generate(prompt) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { chat, generate };
