import OpenAI from "openai";

const projectTopicsTR = [
  "Yeni kullanicilar icin tanitim: Base blockchain'de NFT bas, max 10 NFT limiti, her NFT 1000 BASED token, staking sistemi aktif",
  "Kazanc rehberi: Base'de transaksyon yap, NFT bas (max 10), otomatik 1000 BASED token kazan, stake et",
  "Staking sistemi: NFT'lerini stake et, pasif gelir kazan, BASED token rewards topla",
  "Aciliyet: 10 NFT limitini dolduran ilk 1000 kullaniciya bonus! Base'de hemen islem yap",
  "Topluluk: Binlerce kullanici Base'de NFT basip BASED token topluyor, sen de katil"
];

const projectTopicsEN = [
  "Discover Farcaster Social Batch App on Base! Mint up to 10 NFTs, earn 1000 BASED tokens each, stake for passive income",
  "Technical guide: Base L2 transactions, batch minting (max 10 NFTs), 1000 BASED tokens per mint, smart contract staking",
  "DeFi meets NFTs on Base! Mint NFTs, earn tokens (1000 each), stake for yield, upcoming utility surprise"
];

const cryptoTopics = [
  { en: "Analyze Base blockchain ecosystem growth, TVL trends, top protocols", tr: "Base blockchain ekosistem buyumesini analiz et, TVL trendleri, populer protokoller" },
  { en: "Discuss latest DeFi innovations on Base, yield farming, liquidity mining", tr: "Base'deki DeFi yeniliklerini tartiş, yield farming, likidite madenciligi" },
  { en: "Explore NFT trends on Base, volume analysis, popular collections", tr: "Base'deki NFT trendlerini kesfet, hacim analizi, populer koleksiyonlar" }
];

async function getTrendingHashtags(openai) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Return ONLY a JSON array of 4-6 crypto hashtags. Format: [\"#Crypto\",\"#Base\",\"#DeFi\"]" },
        { role: "user", content: "Generate trending crypto hashtags" }
      ],
      max_tokens: 80,
      temperature: 0.9
    });
    const hashtags = JSON.parse(completion.choices[0].message.content.trim());
    return hashtags.slice(0, 6).join(' ');
  } catch (error) {
    return "#Crypto #Base #DeFi #NFTs #Web3";
  }
}

function getContentConfig() {
  const hour = new Date().getUTCHours();
  
  if (hour === 6) {
    return {
      type: "project",
      prompt: projectTopicsTR[Math.floor(Math.random() * projectTopicsTR.length)],
      lang: "tr"
    };
  }
  
  if (hour === 12) {
    const topic = cryptoTopics[Math.floor(Math.random() * cryptoTopics.length)];
    return {
      type: "crypto",
      promptEN: topic.en,
      promptTR: topic.tr,
      lang: "bilingual"
    };
  }
  
  if (hour === 18) {
    return {
      type: "project",
      prompt: projectTopicsEN[Math.floor(Math.random() * projectTopicsEN.length)],
      lang: "en"
    };
  }
  
  return {
    type: "project",
    prompt: projectTopicsTR[0],
    lang: "tr"
  };
}

function getSystemPrompt(type, lang) {
  if (type === "project") {
    const langText = lang === "tr" ? "Turkce" : "English";
    return `You are a creative social media manager for Farcaster Social Batch App.

Write in ${langText}. Create unique engaging post about:
- App runs on Base blockchain
- Batch mint NFTs (max 10 per user)
- Earn 1000 BASED tokens per NFT
- Staking system available
- Link: https://farcaster.xyz/miniapps/BPxGlbz_LeVd/farcaster-social-batch-app

Rules:
- Use emojis creatively
- 4-6 short impactful lines
- Each post must be UNIQUE and DIFFERENT
- Conversational but professional
- Max 280 characters
- DO NOT add link, system will add it

Be creative and vary your approach each time!`;
  }
  
  return `You are a crypto analyst creating BILINGUAL posts.

Write in TWO sections:
1. English section (3-4 lines)
2. Turkish section (3-4 lines)

Format:
ENGLISH:
[content]

TURKCE:
[content]

Focus on Base blockchain, DeFi, Layer 2 trends.
Use emojis. Be data-driven. Make each post unique.
DO NOT add hashtags, system will add them.`;
}

function getImagePrompt(type) {
  const styles = [
    "futuristic holographic",
    "neon cyberpunk",
    "minimalist geometric",
    "3D isometric"
  ];
  const style = styles[Math.floor(Math.random() * styles.length)];
  
  if (type === "project") {
    return `${style} design, NFT collection with 10 cards, Farcaster purple and Base blue colors, BASED token symbols, staking elements, modern crypto aesthetic, no text`;
  }
  return `${style} design, Base blockchain visualization, DeFi protocols, Layer 2 network, blue color scheme, professional financial aesthetic, no text`;
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
    throw new Error('ImgBB upload failed');
  }
  
  const result = await imgbbResponse.json();
  return result.data.url;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.headers['user-agent']?.includes('vercel-cron') || req.query.manual === 'true') {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const config = getContentConfig();
      
      console.log("Config:", config);
      
      let userPrompt = config.prompt;
      if (config.lang === "bilingual") {
        userPrompt = `English: ${config.promptEN}\nTurkish: ${config.promptTR}`;
      }
      
      console.log("Generating content...");
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: getSystemPrompt(config.type, config.lang) },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 300,
        temperature: 0.95,
        frequency_penalty: 1.2,
        presence_penalty: 0.8
      });
      
      let content = completion.choices[0].message.content.trim();
      console.log("Content:", content);
      
      if (config.type === "project") {
        content += "\n\nhttps://farcaster.xyz/miniapps/BPxGlbz_LeVd/farcaster-social-batch-app";
      } else {
        const hashtags = await getTrendingHashtags(openai);
        content += "\n\n" + hashtags;
      }
      
      console.log("Generating image...");
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: getImagePrompt(config.type),
        size: "1024x1024",
        quality: "standard",
        n: 1
      });
      
      const dalleUrl = imageResponse.data[0].url;
      
      console.log("Uploading to ImgBB...");
      const permanentUrl = await uploadToImgBB(dalleUrl, process.env.IMGBB_API_KEY);
      
      console.log("Posting to Farcaster...");
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
          embeds: [{ url: permanentUrl }]
        })
      });
      
      if (!castResponse.ok) {
        const errorText = await castResponse.text();
        throw new Error(`Cast failed: ${errorText}`);
      }
      
      const result = await castResponse.json();
      
      return res.status(200).json({
        success: true,
        type: config.type,
        language: config.lang,
        content: content,
        imageUrl: permanentUrl,
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
