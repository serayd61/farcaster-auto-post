import OpenAI from "openai";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.headers['user-agent']?.includes('vercel-cron') || req.query.manual === 'true') {
    try {
      console.log("=== Debug Info ===");
      console.log("OpenAI Key exists:", !!process.env.OPENAI_API_KEY);
      console.log("OpenAI Key length:", process.env.OPENAI_API_KEY?.length);
      console.log("OpenAI Key first 10 chars:", process.env.OPENAI_API_KEY?.substring(0, 10));
      console.log("OpenAI Key last 10 chars:", process.env.OPENAI_API_KEY?.substring(process.env.OPENAI_API_KEY.length - 10));
      
      // Test simple content first
      const testContent = "Base is the leading Layer 2 solution for Ethereum! 🚀 Low fees, high speed, and amazing developer experience.";
      
      console.log("Skipping OpenAI for now, using test content");
      console.log("Test content:", testContent);
      
      // Try Neynar API
      console.log("=== Neynar API Test ===");
      console.log("Neynar Key exists:", !!process.env.NEYNAR_API_KEY);
      console.log("Signer UUID exists:", !!process.env.SIGNER_UUID);
      
      const requestBody = {
        signer_uuid: process.env.SIGNER_UUID,
        text: testContent
      };
      
      console.log("Request body:", JSON.stringify(requestBody));
      
      const neynarResponse = await fetch('https://api.neynar.com/v2/farcaster/cast', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api_key': process.env.NEYNAR_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log("Neynar status:", neynarResponse.status);
      
      const responseText = await neynarResponse.text();
      console.log("Neynar response:", responseText);
      
      if (!neynarResponse.ok) {
        return res.status(500).json({
          success: false,
          error: "Neynar API error",
          status: neynarResponse.status,
          response: responseText
        });
      }
      
      const castResult = JSON.parse(responseText);
      
      return res.status(200).json({ 
        success: true, 
        message: "Test post published!",
        content: testContent,
        castHash: castResult.cast?.hash,
        castUrl: `https://warpcast.com/${castResult.cast?.author?.username}/${castResult.cast?.hash}`
      });
      
    } catch (error) {
      console.error("=== ERROR ===");
      console.error("Name:", error.name);
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
      
      return res.status(500).json({ 
        success: false, 
        error: error.message,
        errorName: error.name,
        stack: error.stack
      });
    }
  }
  
  return res.status(401).json({ error: "Unauthorized" });
}
