import OpenAI from "openai";

const cryptoTopics = [
  "Base blockchain's latest TVL statistics and growth",
  "The importance of Layer 2 solutions in the Ethereum ecosystem",
  "Popular DeFi protocols on Base",
  "Advantages of Coinbase and Base integration",
  "Ease of developing NFT projects on Base",
  "Smart contract deployment costs: Base vs Ethereum",
  "New projects and dApps in the Base ecosystem",
  "Cross-chain bridges and Base network",
  "Transaction speed and security on Base",
  "Base blockchain advantages for developers",
  "DeFi yield farming opportunities on Base",
  "Optimism technology and Base infrastructure",
  "Gas fee optimization on Base blockchain",
  "Coinbase Wallet and Base user experience",
  "Liquidity mining in the Base ecosystem",
  "The future of Layer 2 scaling and Base",
  "Token launch strategies on Base",
  "Base blockchain developer community",
  "Lending protocols on Base",
  "Base's relationship with Ethereum mainnet"
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.headers['user-agent']?.includes('vercel-cron') || req.query.manual === 'true') {
    try {
      console.log("=== Starting post process ===");
      console.log("Environment check:", {
        hasNeynarKey: !!process.env.NEYNAR_API_KEY,
        hasSignerUuid: !!process.env.SIGNER_UUID,
        hasOpenAIKey: !!process.env.OPENAI_API_KEY
      });
      
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      
      const randomTopic = cryptoTopics[Math.floor(Math.random() * cryptoTopics.length)];
      console.log("Selected topic:", randomTopic);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a Base blockchain and crypto expert content creator. 

Your task:
- Write engaging, informative posts that could go viral
- Keep it under 280 characters (Farcaster limit)
- Use 1-2 emojis, but don't overdo it
- Technical but understandable language
- No hashtags, write naturally
- Approach each topic from a different angle

Tone: Professional yet friendly, excited but not exaggerated`
          },
          {
            role: "user",
            content: `Write an engaging post about: ${randomTopic}`
          }
        ],
        max_tokens: 100,
        temperature: 0.9
      });
      
      const generatedContent = completion.choices[0].message.content.trim();
      console.log("Content generated:", generatedContent);
      
      console.log("Attempting to post to Neynar...");
      console.log("API Key (first 10 chars):", process.env.NEYNAR_API_KEY?.substring(0, 10));
      console.log("Signer UUID (first 8 chars):", process.env.SIGNER_UUID?.substring(0, 8));
      
      const requestBody = {
        signer_uuid: process.env.SIGNER_UUID,
        text: generatedContent
      };
      
      console.log("Request body:", JSON.stringify(requestBody, null, 2));
      
      const neynarResponse = await fetch('https://api.neynar.com/v2/farcaster/cast', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api_key': process.env.NEYNAR_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log("Neynar response status:", neynarResponse.status);
      console.log("Neynar response headers:", Object.fromEntries(neynarResponse.headers.entries()));
      
      const responseText = await neynarResponse.text();
      console.log("Neynar response body:", responseText);
      
      if (!neynarResponse.ok) {
        throw new Error(`Neynar API error: ${neynarResponse.status} - ${responseText}`);
      }
      
      const castResult = JSON.parse(responseText);
      console.log("Cast published successfully:", castResult);
      
      return res.status(200).json({ 
        success: true, 
        message: "Post successfully published!",
        content: generatedContent,
        castHash: castResult.cast?.hash,
        castUrl: `https://warpcast.com/${castResult.cast?.author?.username}/${castResult.cast?.hash}`
      });
      
    } catch (error) {
      console.error("=== ERROR DETAILS ===");
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
      return res.status(500).json({ 
        success: false, 
        error: error.message,
        errorName: error.name,
        details: error.toString()
      });
    }
  }
  
  return res.status(401).json({ error: "Unauthorized" });
}
