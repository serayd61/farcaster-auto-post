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
  "Developer'lar için Base blockchain avantajları",
  "Base üzerinde DeFi yield farming fırsatları",
  "Optimism teknolojisi ve Base'in altyapısı",
  "Base blockchain'de gas fee optimizasyonu",
  "Coinbase Wallet ve Base kullanıcı deneyimi",
  "Base ekosisteminde liquidity mining",
  "Layer 2 scaling'in geleceği ve Base",
  "Base'de token launch stratejileri",
  "Base blockchain developer topluluğu",
  "Base üzerinde lending protokolleri",
  "Base'in Ethereum mainnet ile ilişkisi"
];

export default async function handler(req, res) {
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
            content: `Sen Base blockchain ve kripto konusunda uzman bir içerik üreticisisin. 
            
Görevin:
- İlgi çekici, bilgilendirici ve viral olabilecek kısa postlar yazmak
- 280 karakter veya daha az (Farcaster limiti)
- 1-2 emoji kullan ama abartma
- Teknik ama anlaşılır bir dil kullan
- Türkçe ve İngilizce kelimeler karışık kullanabilirsin (kripto terminoloji için)
- Hashtag kullanma, doğal yaz
- Her seferinde farklı bir açıdan yaklaş

Ton: Profesyonel ama samimi, heyecanlı ama abartısız`
          },
          {
            role: "user",
            content: `Bu konu hakkında ilgi çekici bir post yaz: ${randomTopic}`
          }
        ],
        max_tokens: 150,
        temperature: 0.9
      });
      
      const generatedContent = completion.choices[0].message.content.trim();
      
      const neynar = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
      const cast = await neynar.publishCast(
        process.env.SIGNER_UUID,
        generatedContent
      );
      
      return res.status(200).json({ 
        success: true, 
        message: "Post başarıyla gönderildi!",
        topic: randomTopic,
        content: generatedContent,
        castHash: cast.hash,
        castUrl: `https://warpcast.com/~/conversations/${cast.hash}`
      });
      
    } catch (error) {
      console.error("Hata detayı:", error);
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }
  
  return res.status(401).json({ error: "Unauthorized" });
}