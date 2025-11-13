import OpenAI from "openai";

const cryptoTopics = [
  "Latest Ethereum network upgrades and improvements",
  "Base blockchain daily transaction volume records",
  "Optimism ecosystem new partnerships and integrations",
  "Ethereum gas fee trends and Layer 2 adoption",
  "Base network TVL growth and DeFi protocols",
  "Optimism Superchain latest developments",
  "Ethereum staking updates and validator news",
  "Base developer activity and new dApps launches",
  "Layer 2 scaling solutions comparison and metrics",
  "Ethereum EIP proposals and governance updates",
  "Base NFT marketplace activity and trends",
  "Optimism token economics and OP token updates",
  "Ethereum MEV and validator rewards analysis",
  "Base bridge volume and cross-chain activity",
  "Coinbase and Base ecosystem integration news",
  "Optimism fraud proof system updates",
  "Ethereum Shanghai upgrade impact analysis",
  "Base smart contract security and audits",
  "Layer 2 sequencer decentralization progress",
  "Ethereum roadmap and future upgrades"
];

async function uploadToImgBB(imageUrl) {
  // Download image from OpenAI
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();
  const imageBase64 = Buffer.from(imageBuffer).toString('base64');
  
  // Upload to imgbb (free, no auth needed for basic use)
  const formData = new URLSearchParams();
  formData.append('image', imageBase64);
  
  const imgbbResponse = await fetch('https://api.imgbb.com/1/upload?key=d48372e83da8f08aada0b9d22242b0d5', {
    method: 'POST',
    body: formData
  });
  
  if (!imgbbResponse.ok) {
    const errorText = await imgbbResponse.text();
    throw new Error(`ImgBB upload failed: ${imgbbResponse.status} - ${errorText}`);
  }
  
  const imgbbResult = await imgbbResponse.json();
  return imgbbResult.data.url;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.headers['user-agent']?.includes('vercel-cron') || req.query.manual === 'true') {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      
      const randomTopic = cryptoTopics[Math.floor(Math.random() * cryptoTopics.length)];
      
      // Generate news-style content
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a crypto news reporter covering Base, Optimism, and Ethereum. Write daily news updates in a professional journalistic style.

Style:
- News headline format
- Factual and informative tone
- 250 characters max
- Use 1 relevant emoji
- Include numbers/metrics when possible
- No hashtags, no tags
- Sound like breaking news

Example: "🚀 Base hits new ATH with 2.5M daily transactions, marking 40% growth this week. DeFi TVL surpasses $1.2B as developers migrate from mainnet."`
          },
          {
            role: "user",
            content: `Write a news update about: ${randomTopic}`
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      });
      
      const newsContent = completion.choices[0].message.content.trim();
      console.log("News generated:", newsContent);
      
      // Generate news-style image
      console.log("Generating image...");
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Create a professional cryptocurrency news graphic about: ${randomTopic}. 

Style requirements:
- Modern financial news aesthetic
- Clean, minimal design
- Blue color scheme (#0052FF for Base, similar blues for Ethereum/Optimism)
- Include abstract blockchain network visualization
- Professional charts or graphs if relevant
- No text overlay
- High contrast, bold visuals
- News broadcast quality`,
        size: "1024x1024",
        quality: "standard",
        n: 1,
      });
      
      const dalleImageUrl = imageResponse.data[0].url;
      console.log("DALL-E image generated:", dalleImageUrl);
      
      // Upload to ImgBB for short URL
      console.log("Uploading to ImgBB...");
      const shortImageUrl = await uploadToImgBB(dalleImageUrl);
      console.log("ImgBB URL:", shortImageUrl);
      
      // Post to Farcaster
      console.log("Publishing to Farcaster...");
      const castResponse = await fetch('https://api.neynar.com/v2/farcaster/cast', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api_key': process.env.NEYNAR_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          signer_uuid: process.env.SIGNER_UUID,
          text: newsContent,
          embeds: [{ url: shortImageUrl }]
        })
      });
      
      if (!castResponse.ok) {
        const errorText = await castResponse.text();
        throw new Error(`Cast error: ${castResponse.status} - ${errorText}`);
      }
      
      const castResult = await castResponse.json();
      
      return res.status(200).json({ 
        success: true, 
        message: "News post with image published!",
        content: newsContent,
        imageUrl: shortImageUrl,
        castHash: castResult.cast?.hash,
        castUrl: `https://warpcast.com/${castResult.cast?.author?.username}/${castResult.cast?.hash}`
      });
      
    } catch (error) {
      console.error("ERROR:", error);
      return res.status(500).json({ 
        success: false, 
        error: error.message,
        details: error.toString()
      });
    }
  }
  
  return res.status(401).json({ error: "Unauthorized" });
}
