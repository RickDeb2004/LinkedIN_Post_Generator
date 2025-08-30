import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = "force-dynamic";
export const revalidate = 3600; 

export async function POST(req) {
  const { topic, tone, audience, length, postCount } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    let context = "";
    try {
      const searchResponse = await fetch("https://api.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: topic }),
      });
      const searchResults = await searchResponse.json();
      context =
        searchResults.organic
          ?.slice(0, 2)
          .map((result) => `${result.snippet} [Source: ${result.link}]`)
          .join(" ") || "";
    } catch (searchError) {
      console.error("Search failed, proceeding without context:", searchError);
    }

    const chat = model.startChat({
      history: [],
      generationConfig: { maxOutputTokens: 1000 },
    });

    // Step 2: Plan with search context
    const planPrompt = `Using this context: "${context}", plan a LinkedIn post structure for topic: "${topic}". Tone: ${tone}. Audience: ${audience}. Length: ~${length} words. Include hook, key points, CTA, hashtags, and cite sources if relevant.`;
    const planResult = await chat.sendMessage(planPrompt);
    const plan = planResult.response.text();

    // Step 3: Draft posts
    const draftPrompt = `Using this plan: "${plan}", generate ${postCount} unique LinkedIn post drafts in Markdown format. Each draft should start with **Post X: [Focus Description]**, then Headline: [headline], Body: [body text with **bold**, *italics*, * bullet lists, and end with #hashtags]. Include citations if relevant. Separate each full post with \n\n---\n\n. Ensure no profanity or false claims.`;
    const draftResult = await chat.sendMessage(draftPrompt);
    const drafts = draftResult.response.text().split("\n\n---\n\n");

    // Step 4: Estimate tokens (1 word ≈ 1.3 tokens)
    const totalText = planPrompt + plan + draftPrompt + drafts.join("");
    const wordCount = totalText.split(/\s+/).length;
    const estimatedTokens = Math.round(wordCount * 1.3);

    // Step 5: Filter drafts
    const badWords = ["profanity1", "profanity2"];
    const filteredDrafts = drafts.filter(
      (draft) => !badWords.some((word) => draft.toLowerCase().includes(word))
    );

    return new Response(
      JSON.stringify({
        posts: filteredDrafts.slice(0, postCount),
        estimatedTokens,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to generate" }), {
      status: 500,
    });
  }
}
