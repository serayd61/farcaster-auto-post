import OpenAI from "openai";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.headers['user-agent']?.includes('vercel-cron') || req.query.manual === 'true') {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const hour = new Date().getUTCHours();
      let contentType = "project";
      let message = "Farcaster Social Batch App: Max 10 NFT mint, 1000 BASED token per mint, Staking available!";
      
      if (hour === 12) {
        contentType = "crypto";
        message = "Base blockchain update: Layer 2 adoption growing fast!";
      }
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a social media manager. Write a short engaging post with emojis." },
          { role: "user", content: message }
        ],
        max_tokens: 150,
        temperature: 0.8
      });
      
      let content = completion.choices[0].message.content.trim();
      
      if (contentType === "project") {
        content += "\n\nhttps://farcaster.xyz/miniapps/BPxGlbz_LeVd/farcaster-social-batch-app";
      } else {
        content += "\n\n#Crypto #Base #DeFi #Web3";
      }
      
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: "Modern crypto NFT platform with blue and purple colors, professional design, no text",
        size: "1024x1024",
        quality: "standard",
        n: 1
      });
      
      const imageUrl = imageResponse.data[0].url;
      
      const castResponse = await fetch('https://api.neynar.com/v2/farcaster/cast', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api_key': process.env.NEYNAR_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          signer_uuid: process.env.SIGNER_UUID,
          text: content,
          embeds: [{ url: imageUrl }]
        })
      });
      
      if (!castResponse.ok) {
        throw new Error('Cast failed: ' + castResponse.status);
      }
      
      const result = await castResponse.json();
      
      return res.status(200).json({ 
        success: true,
        type: contentType,
        content: content,
        castUrl: `https://warpcast.com/${result.cast?.author?.username}/${result.cast?.hash}`
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
