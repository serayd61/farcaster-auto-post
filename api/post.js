import OpenAI from "openai";

const projectMorningTopics = [
  "Farcaster Social Batch App ile güne basla! Max 10 NFT mint et, 1000 BASED token kazan",
  "NFT koleksiyonunu büyüt: Her mint'te 1000 BASED token + Staking firsati!",
  "BASED token toplama zamani! Mint et, stake et, kazan!",
  "Sabah motivasyonu: 10 NFT limit dolmadan mint et! Her biri 1000 BASED token"
];

const projectAfternoonTopics = [
  "Farcaster Social Batch App özellikleri: Max 10 NFT mint + Staking sistemi + Token rewards",
  "BASED token nasil kazanilir? 1) Max 10 NFT mint et 2) Stake et 3) Ödülleri topla!",
  "NFT koleksiyonerleri için tam paket: Mint (max 10) + Stake + 1000 BASED token rewards"
];

const projectEveningTopics = [
  "Bugün kac kisi NFT stake etti? Sen de pasif gelir kazanmaya basla!",
  "BASED token sahipleri için sürpriz + Staking rewards = Double hype!",
  "NFT mint et (max 10), stake et, hem BASED token hem staking rewards kazan!"
];

const cryptoTopics = [
  "Daily crypto market sentiment and opening trends",
  "Base blockchain ecosystem development updates",
  "Layer 2 adoption rates and scaling solutions",
  "Smart contract security and optimization techniques",
  "DeFi protocol innovations and TVL analysis"
];

async function getTrendingCryptoHashtags(openai) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Return ONLY a JSON array of 3-5 trending crypto hashtags. Format: [\"#Crypto\", \"#Base\", \"#DeFi\"]. Include: General tags, Base/Layer2 tags, and topic tags."
        },
        {
          role: "user",
          content: "What are the trending crypto hashtags for today?"
        }
      ],
      max_tokens: 100,
      temperature: 0.7
    });
    
    const response = completion.choices[0].message.content.trim();
    const hashtags = JSON.parse(response);
    return hashtags.slice(0, 5).join(' ');
  } catch (error) {
    console.error("Hashtag generation error:", error);
    return "#Crypto #Base #DeFi #Web3 #BuildOnBase";
  }
}

function getContentByTime() {
  const hour = new Date().getUTCHours();
  
  if (hour === 6) {
    return { type: "project", topics: projectMorningTopics, style: "morning", lang: "tr" };
  }
  
  if (hour === 12) {
    return { type: "crypto", topics: cryptoTopics, style: "afternoon", lang: "en" };
  }
  
  if (hour === 18) {
    return { type: "project", topics: projectEveningTopics, style: "evening", lang: "tr" };
  }
  
  return { type: "project", topics: projectMorningTopics, style: "morning", lang: "tr" };
}

function getSystemPrompt(type, style, lang) {
  if (type === "project") {
    return `Sen Farcaster Social Batch App'in sosyal medya yöneticisisin.

Ürün Özellikleri:
- NFT batch minting uygulamasi
- MAX 10 NFT per user limit
- Her NFT mint'te 1000 BASED token ödülü
- NFT Staking sistemi mevcut - Stake ederek pasif gelir
- BASED token için yakinda özel utility açiklamasi gelecek

Kurallar:
- ${lang === "tr" ? "Türkçe" : "Ingilizce"} yaz
- Bol emoji kullan
- 3-5 kisa paragraf
- Her paragraf ayri satirda
- Max 10 NFT limitini ve Staking'i belirt
- Link kendin ekleme, sistem otomatik ekleyecek

Örnek:
"Günaydın Farcaster!

Max 10 NFT mint edebilirsin
Her biri = 1000 BASED token
Stake et, pasif gelir kazan!

Batch minting simdi basla"`;
  }
  
  return `You are a crypto content creator for Base blockchain.

Rules:
- Write in English
- Use relevant emojis
- 3-4 short paragraphs
- Professional but engaging
- Don't add hashtags yourself

Example:
"Base network analysis:

TVL surged 35% to $1.8B
Top DeFi protocols gaining momentum
Layer 2 migration accelerating"`;
}

function getImagePrompt(type, style, topic) {
  if (type === "project") {
    return `Modern promotional image for Farcaster Social Batch App - NFT batch minting platform (MAX 10 NFTs per user) with staking system. ${topic}. Include 10 NFT cards, staking vault imagery, BASED tokens, Farcaster purple and Base blue colors. Professional, vibrant, clean design. No text overlay.`;
  }
  
  return `Professional crypto/blockchain image about: ${topic}. Base blockchain focused, blue color scheme, modern design, clean and minimal. No text overlay.`;
}

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
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      
      const { type, topics, style, lang } = getContentByTime();
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      
      console.log(`Type: ${type}, Style: ${style}, Lang: ${lang}`);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: getSystemPrompt(type, style, lang) },
          { role: "user", content: randomTopic }
        ],
        max_tokens: 200,
        temperature: 0.8
      });
      
      let content = completion.choices[0].message.content.trim();
      console.log("Content generated:", content);
      
      if (type === "project") {
        content += "\n\nhttps://farcaster.xyz/miniapps/BPxGlbz_LeVd/farcaster-social-batch-app";
      }
      
      if (type === "crypto") {
        console.log("Fetching hashtags...");
        const hashtags = await getTrendingCryptoHashtags(openai);
        content += "\n\n" + hashtags;
      }
      
      console.log("Generating image...");
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: getImagePrompt(type, style, randomTopic),
        size: "1024x1024",
        quality: "standard",
        n: 1,
      });
      
      const dalleImageUrl = imageResponse.data[0].url;
      
      console.log("Uploading to ImgBB...");
      const permanentImageUrl = await uploadToImgBB(dalleImageUrl, process.env.IMGBB_API_KEY);
      
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
          text: content,
          embeds: [{ url: permanentImageUrl }]
        })
      });
      
      if (!castResponse.ok) {
        const errorText = await castResponse.text();
        throw new Error(`Cast error: ${castResponse.status} - ${errorText}`);
      }
      
      const castResult = await castResponse.json();
      
      return res.status(200).json({ 
        success: true, 
        message: `${type === 'project' ? 'Project' : 'Crypto'} ${style} post published!`,
        contentType: type,
        style: style,
        language: lang,
        content: content,
        imageUrl: permanentImageUrl,
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
