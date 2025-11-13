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
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      
      const randomTopic = cryptoTopics[Math.floor(Math.random() * cryptoTopics.length)];
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a Base blockchain expert. Write engaging crypto posts under 280 characters. Use 1-2 emojis. Technical but clear. No hashtags."
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
      
      const neynarResponse = await fetch('https://api.neynar.com/v2/farcaster/cast', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api_key': process.env.NEYNAR_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          signer_uuid: process.env.SIGNER_UUID,
          text: generatedContent
        })
      });
      
      if (!neynarResponse.ok) {
        const errorText = await neynarResponse.text();
        throw new Error(`Neynar error: ${neynarResponse.status} - ${errorText}`);
      }
      
      const castResult = await neynarResponse.json();
      
      return res.status(200).json({ 
        success: true, 
        message: "Post published successfully!",
        content: generatedContent,
        castHash: castResult.cast?.hash,
        castUrl: `https://warpcast.com/${castResult.cast?.author?.username}/${castResult.cast?.hash}`
      });
      
    } catch (error) {
      console.error("ERROR:", error);
      return res.status(500).json({ 
        success: false, 
        error: error.message
      });
    }
  }
  
  return res.status(401).json({ error: "Unauthorized" });
}
