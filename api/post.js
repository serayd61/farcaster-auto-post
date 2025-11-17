import OpenAI from "openai";

async function uploadToImgBB(imageUrl, apiKey) {
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();
  const imageBase64 = Buffer.from(imageBuffer).toString('base64');
  
  const formData = new URLSearchParams();
  formData.append('image', imageBase64);
  
  const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData
  });
  
  if (!imgbbResponse.ok) {
    throw new Error(`ImgBB upload failed: ${imgbbResponse.status}`);
  }
  
  const imgbbResult = await imgbbResponse.json();
  return imgbbResult.data.url;
}

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
      
      console.log("Generating content...");
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a social media manager. Write a short engaging post (max 250 chars) with emojis." },
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
      
      console.log("Content:", content);
      
      console.log("Generating image...");
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: "Modern crypto NFT platform with blue and purple colors, professional design, no text overlay",
        size: "1024x1024",
        quality: "standard",
        n: 1
      });
      
      const dalleImageUrl = imageResponse.data[0].url;
      console.log("DALL-E image generated");
      
      console.log("Uploading to ImgBB...");
      const permanentImageUrl = await uploadToImgBB(dalleImageUrl, process.env.IMGBB_API_KEY);
      console.log("Image uploaded:", permanentImageUrl);
      
      console.log("Posting to Farcaster...");
      const castPayload = {
        signer_uuid: process.env.SIGNER_UUID,
        text: content,
        embeds: [{ url: permanentImageUrl }]
      };
      
      console.log("Cast payload:", JSON.stringify(castPayload, null, 2));
      
      const castResponse = await fetch('https://api.neynar.com/v2/farcaster/cast', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api_key': process.env.NEYNAR_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify(castPayload)
      });
      
      const responseText = await castResponse.text();
      console.log("Neynar response status:", castResponse.status);
      console.log("Neynar response:", responseText);
      
      if (!castResponse.ok) {
        throw new Error(`Cast failed (${castResponse.status}): ${responseText}`);
      }
      
      const result = JSON.parse(responseText);
      
      return res.status(200).json({ 
        success: true,
        type: contentType,
        content: content,
        imageUrl: permanentImageUrl,
        castHash: result.cast?.hash,
        castUrl: `https://warpcast.com/${result.cast?.author?.username}/${result.cast?.hash}`
      });
      
    } catch (error) {
      console.error("ERROR:", error);
      return res.status(500).json({ 
        success: false, 
        error: error.message,
        stack: error.stack
      });
    }
  }
  
  return res.status(401).json({ error: "Unauthorized" });
}
