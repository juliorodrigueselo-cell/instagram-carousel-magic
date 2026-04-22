const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é um pastor cristão brasileiro escrevendo um carrossel para Instagram com tom acolhedor, pastoral e bíblico. Use linguagem clara, próxima e com base bíblica. Seus textos são curtos, impactantes e cabem no formato vertical de um carrossel.

Você SEMPRE responde chamando a função generate_carousel com slides na ordem exata: capa, versículo, foto-quote, lista, foto-quote (ou split), CTA final. Nunca devolva texto solto.`;

const TOOL = {
  type: "function" as const,
  function: {
    name: "generate_carousel",
    description: "Gera o conteúdo completo de um carrossel cristão para Instagram.",
    parameters: {
      type: "object",
      properties: {
        slides: {
          type: "array",
          minItems: 5,
          maxItems: 8,
          items: {
            type: "object",
            properties: {
              template: {
                type: "string",
                enum: ["cover", "verse", "photo-quote", "list", "split", "cta", "collage"],
              },
              eyebrow: { type: "string", description: "Categoria curta no topo (ex: 'Devocional', 'João 3:16'). Máx 30 caracteres." },
              title: { type: "string", description: "Frase principal do slide. Para versículos, é o texto do versículo. Máx 180 caracteres." },
              body: { type: "string", description: "Texto de apoio opcional (1-2 frases). Usado em photo-quote, split e cta." },
              reference: { type: "string", description: "Referência do versículo (ex: '— Mateus 11:28'). Apenas para template 'verse'." },
              author: { type: "string", description: "Nome do autor/pastor. Apenas para template 'cover'." },
              items: {
                type: "array",
                items: { type: "string" },
                description: "Lista de 3 a 4 itens curtos. Apenas para template 'list'.",
              },
            },
            required: ["template", "title"],
            additionalProperties: false,
          },
        },
      },
      required: ["slides"],
      additionalProperties: false,
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, count = 6 } = await req.json();
    if (!topic || typeof topic !== "string") {
      return new Response(JSON.stringify({ error: "topic é obrigatório" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY ausente");

    const userPrompt = `Crie um carrossel cristão para Instagram com EXATAMENTE ${count} slides sobre o tema: "${topic}".

Estrutura obrigatória (na ordem):
1. cover  → eyebrow ("Devocional" ou similar), title (gancho forte e poético, máx 12 palavras), author ("Pr. [nome fictício]")
2. verse  → eyebrow (referência bíblica como "Mateus 11:28"), title (texto literal do versículo, ARC ou NVI), reference ("— [referência]")
3. photo-quote → eyebrow ("Reflexão"), title (frase curta de impacto), body (1-2 frases de apoio)
4. list   → eyebrow ("3 verdades" ou similar), title (título da lista), items (3 frases curtas, máximo 70 caracteres cada)
5. split  → eyebrow (referência bíblica), title (versículo curto OU frase poética), body (1 frase aplicando o versículo)
${count >= 6 ? `6. cta    → eyebrow ("Compartilhe"), title (chamada acolhedora pra marcar/salvar), body ("Salve este post...")` : ""}
${count >= 7 ? `7. photo-quote → reflexão extra` : ""}
${count >= 8 ? `8. cta extra` : ""}

Tom: pastoral, acolhedor, bíblico. Evite clichês. Use versículos REAIS e fiéis às traduções ARC/NVI.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [TOOL],
        tool_choice: { type: "function", function: { name: "generate_carousel" } },
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições, tente novamente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados. Adicione créditos em Settings → Workspace → Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, errText);
      return new Response(JSON.stringify({ error: "Falha ao gerar carrossel" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("Sem tool_call na resposta", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "Resposta inválida da IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-carousel error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});