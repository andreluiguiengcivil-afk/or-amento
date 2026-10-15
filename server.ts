import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// API route for AI Assistant using Gemini API
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { mensagem, projeto } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.json({
        fallback: true,
        message: 'Chave GEMINI_API_KEY não configurada no servidor.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const projectName = projeto?.nome || 'Projeto de Obra';
    const area = projeto?.areaConstruidaM2 || 0;
    const bdi = projeto?.bdiConfig ? JSON.stringify(projeto.bdiConfig) : 'padrão';

    const systemPrompt = `Você é um Engenheiro Civil Sênior especialista em Orçamentação de Obras, Engenharia de Custos, bases SINAPI e SICRO da Caixa Econômica Federal e acórdãos do TCU (especialmente Acórdão 2622/2013 para BDI). Responda sempre em português do Brasil com dados técnicos realistas, coeficientes de consumo, unidades de medida usuais e referências normativas. Projeto atual: ${projectName}, Área: ${area} m², BDI Configurado: ${bdi}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `${systemPrompt}\n\nPergunta do Engenheiro: ${mensagem}`,
    });

    const respostaTexto = response.text || 'Não foi possível gerar resposta no momento.';
    return res.json({ resposta: respostaTexto });
  } catch (error: any) {
    console.error('Erro na API Gemini:', error);
    return res.json({ fallback: true, error: error.message || 'Falha ao processar solicitação com a IA.' });
  }
});

// Dev vs Prod Vite Integration
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor OrçaEng rodando em http://0.0.0.0:${port}`);
  });
}

startServer();
