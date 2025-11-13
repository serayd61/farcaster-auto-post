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

// Base ecosystem active users to tag
const baseInfluencers = [
  "@jessepollak",      // Jesse Pollak - Base lead
  "@hosseeb",          // Haseeb Qureshi
  "@punk6529",         // 6529
  "@coinbase",         // Coinbase official
  "@base",             // Base official
  "@optimismFND",      // Optimism Foundation
  "@defi",             // DeFi community
];

function getRandomInfluencers(count = 2) {
  const shuffled = [...baseInfluencers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.headers['user-agent']?.includes('vercel-cron') || req.query.manual === 'true') {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      
      const randomTopic = cryptoTopics[Math.floor(Math.random() * cryptoTopics.length)];
      
      // Step 1: Generate text content
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a Base blockchain expert. Write engaging crypto posts under 220 characters (leave room for tags). Use 1-2 emojis. Technical but clear. No hashtags."
          },
          {
            role: "user",
            content: `Write an engaging post about: ${randomTopic}`
          }
        ],
        max_tokens: 80,
        temperature: 0.9
      });
      
      const textContent = completion.choices[0].message.content.trim();
      
      // Step 2: Generate image with DALL-E
      console.log("Generating image...");
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Create a modern, professional cryptocurrency/blockchain themed image about: ${randomTopic}. Style: Clean, futuristic, blue color scheme matching Base brand (blue #0052FF), include subtle blockchain network patterns, no text on image.`,
        size: "1024x1024",
        quality: "standard",
        n: 1,
      });
      
      const imageUrl = imageResponse.data[0].url;
      console.log("Image generated:", imageUrl);
      
      // Step 3: Download image as base64
      const imageDataResponse = await fetch(imageUrl);
      const imageBuffer = await imageDataResponse.arrayBuffer();
      const imageBase64 = Buffer.from(imageBuffer).toString('base64');
      
      // Step 4: Upload image to Neynar
      console.log("Uploading image to Neynar...");
      const uploadResponse = await fetch('https://api.neynar.com/v2/farcaster/storage/upload', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api_key': process.env.NEYNAR_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          content: imageBase64,
          content_type: "image/png"
        })
      });
      
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("Image upload error:", errorText);
        throw new Error(`Image upload failed: ${uploadResponse.status}`);
      }
      
      const uploadResult = await uploadResponse.json();
      const imageStorageUrl = uploadResult.url;
      console.log("Image uploaded:", imageStorageUrl);
      
      // Step 5: Add tags to content
      const tags = getRandomInfluencers(2);
      const finalContent = `${textContent}\n\n${tags.join(' ')}`;
      
      // Step 6: Post to Farcaster with image
      console.log("Publishing cast with image...");
      const castResponse = await fetch('https://api.neynar.com/v2/farcaster/cast', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api_key': process.env.NEYNAR_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          signer_uuid: process.env.SIGNER_UUID,
          text: finalContent,
          embeds: [{ url: imageStorageUrl }]
        })
      });
      
      if (!castResponse.ok) {
        const errorText = await castResponse.text();
        throw new Error(`Cast error: ${castResponse.status} - ${errorText}`);
      }
      
      const castResult = await castResponse.json();
      
      return res.status(200).json({ 
        success: true, 
        message: "Post with image published successfully!",
        content: finalContent,
        imageUrl: imageStorageUrl,
        tags: tags,
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
