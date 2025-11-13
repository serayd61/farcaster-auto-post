import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import OpenAI from "openai";

const cryptoTopics = [
  "Base blockchain'in son TVL istatistikleri ve büyümesi",
  "Layer 2 çözümlerinin Ethereum ekosistemindeki önemi",
  "Base üzerindeki popüler DeFi protokolleri",
  "Coinbase ve Base entegrasyonunun avantajları",
  "Base'de NFT projeleri geliştirmenin kolaylıkları",
  "Smart contract deployment maliyetleri Base vs Ethereum",
  "Base ekosistemindeki yeni projeler ve dApp'ler",
  "Cross-chain bridge'ler ve Base ağı",
  "Base'de transaction hızı ve güvenlik",
  "Developer'lar için Base blockchain avantajları"
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.headers['user-agent']?.includes('vercel-cron') || req.query.manual === 'true') {
    try {
      console.log("=== Starting post process ===");
      
      // OpenAI client
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      
      const randomTopic = cryptoTopics[Math.floor(Math.random() * cryptoTopics.length)];
      console.log("Topic:", randomTopic);
      
      // İçerik üret
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Sen Base blockchain uzmanısın. 280 karakter altında, ilgi çekici, Türkçe-İngilizce karışık kripto postları yazıyorsun. 1-2 emoji kullan."
          },
          {
            role: "user",
            content: `Bu konu hakkında kısa bir post yaz: ${randomTopic}`
          }
        ],
        max_tokens: 100,
        temperature: 0.9
      });
      
      const generatedContent = completion.choices[0].message.content.trim();
      console.log("Content generated:", generatedContent);
      
      // Neynar client - DÜZELTİLMİŞ VERSİYON
      const neynar = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
      
      console.log("Publishing to Farcaster...");
      
      // Cast yayınla - DÜZELTİLMİŞ PARAMETRE YAPISI
      const result = await neynar.publishCast(
        process.env.SIGNER_UUID,
        generatedContent
      );
      
      console.log("Success! Cast hash:", result.hash);
      
      return res.status(200).json({ 
        success: true, 
        message: "Post başarıyla gönderildi!",
        content: generatedContent,
        castHash: result.hash,
        castUrl: `https://warpcast.com/~/conversations/${result.hash}`
      });
      
    } catch (error) {
      console.error("ERROR:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      
      return res.status(500).json({ 
        success: false, 
        error: error.message || "Unknown error",
        details: error.toString()
      });
    }
  }
  
  return res.status(401).json({ error: "Unauthorized" });
}
