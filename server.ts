import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware para JSON
  app.use(express.json());

  // Rota de saúde (Health Check)
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Rota de proxy para o Gemini 1.5 / 3.5 Flash usando o SDK oficial do GoogleGenAI
  app.post("/api/gemini", async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { prompt, customApiKey } = req.body;

      if (!prompt) {
        res.status(400).json({ error: "O prompt é obrigatório." });
        return;
      }

      // Priorizar a chave de API fornecida pelo usuário na UI, caso contrário usar a do servidor
      const apiKey = customApiKey || process.env.GEMINI_API_KEY;

      if (!apiKey) {
        res.status(400).json({ 
          error: "Chave de API do Gemini não fornecida. Insira uma chave de API na barra lateral ou configure nas configurações do projeto para habilitar chamadas de IA reais." 
        });
        return;
      }

      // Inicialização recomendada do SDK oficial @google/genai
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      // Modelo recomendado para tarefas rápidas de texto: 'gemini-3.5-flash' ou o solicitado 'gemini-1.5-flash'
      // Como o usuário pode ter uma chave específica para o 1.5, ambos funcionam bem.
      // Vamos usar 'gemini-1.5-flash' por ser compatível com chaves legadas e ser o que o usuário solicitou especificamente,
      // ou fallback para 'gemini-3.5-flash' caso seja a nova geração padrão.
      const modelName = "gemini-1.5-flash";

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });

      const generatedText = response.text;

      res.json({ text: generatedText });
    } catch (error: any) {
      console.error("Erro na chamada do Gemini API:", error);
      res.status(500).json({ 
        error: error.message || "Erro interno ao processar a requisição com o Gemini." 
      });
    }
  });

  // Configuração do Vite Middleware em Desenvolvimento
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Configuração para Produção
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SUS-Digital Server] Servidor executando em http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Falha ao iniciar o servidor:", err);
});
