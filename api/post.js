import OpenAI from "openai";

// ============================================
// PROJECT PROMOTION TOPICS
// ============================================

const projectMorningTopics = [
  "Farcaster Social Batch App ile güne başla! Max 10 NFT mint et, 1000 BASED token kazan",
  "NFT koleksiyonunu büyüt: Her mint'te 1000 BASED token + Staking fırsatı!",
  "BASED token toplama zamanı! Mint et, stake et, kazan!",
  "Sabah motivasyonu: 10 NFT limit dolmadan mint et! Her biri 1000 BASED token",
  "Farcaster üzerinde NFT mint'le + Stake et = Double earnings!",
  "Max 10 NFT per user - Her biri 1000 BASED token ödüllü. Stake ederek daha fazla kazan!",
  "Batch minting artık daha ödüllendirici: Mint, Stake, Earn! 🚀",
  "NFT'lerini stake et, pasif gelir kazan! Her mint'te 1000 BASED token hediye"
];

const projectAfternoonTopics = [
  "Farcaster Social Batch App özellikleri: Max 10 NFT mint + Staking sistemi + Token rewards",
  "BASED token nasıl kazanılır? 1) Max 10 NFT mint et 2) Stake et 3) Ödülleri topla!",
  "Batch minting nedir? Tek seferde çoklu NFT mint et, her biri stake edilebilir!",
  "NFT koleksiyonerleri için tam paket: Mint (max 10) + Stake + 1000 BASED token rewards",
  "Staking sistemi nasıl çalışır? NFT'lerini stake et, ekstra BASED token kazan!",
  "Limit 10 NFT per user - Ama stake ederek unlimited earning potansiyeli!",
  "Her kullanıcı max 10 NFT mint edebilir, hepsini stake edip kazanç sağlayabilir",
  "Farcaster Social Batch: Mint sistemi + Staking rewards = Perfect combo!"
];

const projectEveningTopics = [
  "Bugün kaç kişi NFT stake etti? Sen de pasif gelir kazanmaya başla!",
  "BASED token sahipleri için sürpriz + Staking rewards = Double hype! 🔥",
  "NFT mint et (max 10), stake et, hem BASED token hem staking rewards kazan!",
  "10 NFT limitini dolduran ilk 1000 kişiye özel bonuslar geliyor! Stake etmeyi unutma",
  "Staking pool büyüyor! Sen de NFT'lerini stake et, pasif gelir kazan",
  "Max 10 NFT - Ama unlimited earning! Mint + Stake = Win-Win 💰",
  "BASED token utility açıklamasına az kaldı + Staking APY artacak! Hazır ol",
  "Farcaster'ın en ödüllendirici uygulaması: 10 NFT limit, unlimited staking, 1000 BASED/mint"
];

// ============================================
// CRYPTO TOPICS (Original)
// ============================================

const cryptoTopics = [
  "Daily crypto market sentiment and opening trends",
  "Base blockchain ecosystem development updates",
  "Layer 2 adoption rates and scaling solutions",
  "Smart contract security and optimization techniques",
  "DeFi protocol innovations and TVL analysis",
  "Base network activity and transaction metrics",
  "Ethereum gas fees and Layer 2 comparison",
  "NFT marketplace trends and volume analysis",
  "Cross-chain bridge activity and security",
  "Blockchain scalability breakthrough technologies",
  "Staking mechanisms in modern DeFi protocols",
  "NFT utility and gamification strategies",
  "Token economics and reward distribution models"
];

// ============================================
// GET TRENDING CRYPTO HASHTAGS
// ============================================

async function getTrendingCryptoHashtags(openai) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a crypto social media trend analyst. Return ONLY a JSON array of 3-5 trending crypto hashtags for today.

Rules:
- Include universal crypto tags that are always relevant
- Add Base/Layer2 specific tags when relevant
- Mix popular and niche tags
- No explanations, just the JSON array
- Format: ["#Crypto", "#Base", "#DeFi"]

Always include at least one from each category:
1. General: #Crypto, #Web3, #Blockchain
2. Network: #Base, #Ethereum, #Layer2, #OptimismSuperchain
3. Topic: #DeFi, #NFTs, #SmartContracts, #BuildOnBase, #Staking`
        },
        {
          role: "user",
          content: "What are the trending crypto hashtags for today's post?"
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
    // Fallback hashtags
    return "#Crypto #Base #DeFi #Web3 #BuildOnBase";
  }
}

// ============================================
// TIME AND CONTENT TYPE LOGIC
// ============================================

function getContentByTime() {
  const hour = new Date().getUTCHours();
  
  // Morning: 6 UTC (09:00 Turkey) - PROJECT
  if (hour === 6) {
    return {
      type: "project",
      topics: projectMorningTopics,
      style: "morning",
      lang: "tr"
    };
  }
  
  // Afternoon: 12 UTC (15:00 Turkey) - CRYPTO
  if (hour === 12) {
    return {
      type: "crypto",
      topics: cryptoTopics,
      style: "afternoon",
      lang: "en"
    };
  }
  
  // Evening: 18 UTC (21:00 Turkey) - PROJECT
  if (hour === 18) {
    return {
      type: "project",
      topics: projectEveningTopics,
      style: "evening",
      lang: "tr"
    };
  }
  
  // Default fallback
  return {
    type: "project",
    topics: projectMorningTopics,
    style: "morning",
    lang: "tr"
  };
}

// ============================================
// PROMPTS
// ============================================

function getSystemPrompt(type, style, lang) {
  if (type === "project") {
    return `Sen Farcaster Social Batch App'in sosyal medya yöneticisisin.

Ürün Özellikleri (ÖNEMLİ):
- NFT batch minting uygulaması
- ⚠️ MAX 10 NFT per user limit
- Her NFT mint'te 1000 BASED token ödülü
- 🎯 NFT Staking sistemi mevcut - Stake ederek pasif gelir!
- BASED token için yakında özel utility açıklaması gelecek
- Farcaster üzerinde çalışıyor

${style === "morning" ? `Sabah Stili (09:00):
- Enerjik ve motive edici ton 🌅
- "Günaydın" havası
- Günü başlatmak için ilham verici
- Max 10 NFT limitini belirt (bazen)
- Staking özelliğinden bahset
- Actionable call-to-action` : ""}

${style === "afternoon" ? `Öğleden Sonra Stili (15:00):
- Bilgilendirici ve açıklayıcı
- Ürün özellikleri detaylı: 10 NFT limit + Staking
- Nasıl çalışır anlatımı
- Kullanıcı deneyimi odaklı
- Educational tone
- Staking mekanizmasını açıkla` : ""}

${style === "evening" ? `Akşam Stili (21:00):
- FOMO yaratıcı ama samimi 🔥
- "10 NFT limitini doldurdun mu?" vibe
- Staking rewards vurgusu
- Topluluk odaklı
- Heyecan verici ve motive edici
- Urgency hissi` : ""}

KURALLAR:
- ${lang === "tr" ? "Türkçe" : "İngilizce"} yaz
- Bol emoji kullan (💎🚀🎁✨🔥⚡💰🌟💫⭐🎯)
- 3-5 kısa paragraf veya satır
- Her paragraf ayrı satırda
- Doğal ve samimi ol
- Max 10 NFT limitini ve Staking'i mutlaka belirt (her postta olmasa da sık sık)
- Spam gibi görünme
- Call-to-action güçlü olsun

ÖNEMLİ: Link'i kendin ekleme, sistem otomatik ekleyecek!

Örnek Format 1 (Staking vurgusu):
"🌅 Günaydın Farcaster! ☕

Max 10 NFT mint edebilirsin 🎯
Her biri = 1000 BASED token 💎
Stake et, pasif gelir kazan! ⚡

Batch minting şimdi başla 👇"

Örnek Format 2 (Genel):
"🔥 NFT koleksiyonunu büyüt!

Batch minting ile tek seferde çoklu mint ⚡
Her mint = 1000 BASED token 💰
Staking sistemi aktif! 🎯

Limitler dolmadan başla 👇"

Örnek Format 3 (Limit vurgusu):
"⏰ Her kullanıcı max 10 NFT!

✅ Batch minting kolaylığı
✅ 1000 BASED token per NFT
✅ Staking ile extra kazanç
✅ Büyük sürpriz yakında

Yerini kap 👇"`;
  }
  
  // Crypto content
  return `You are a crypto content creator focused on Base blockchain and Layer 2 ecosystems.

Style: ${style === "morning" ? "Morning briefing - energetic, market opening analysis ☀️" : 
         style === "afternoon" ? "Technical deep-dive - educational, developer-focused 💻" : 
         "Evening analysis - data-driven, news and trends 📊"}

RULES:
- Write in English
- Use relevant emojis (📊🚀💎⚡🔥📈💰🌐🎯)
- 3-4 short paragraphs or lines
- Each paragraph on new line
- Professional but engaging tone
- Include actionable insights
- Be informative and valuable
- Sometimes mention NFT staking or token rewards in DeFi context

IMPORTANT: Don't add hashtags yourself, system will add trending tags automatically!

Example Format:
"📊 Base network analysis:

TVL surged 35% to $1.8B 💰
Top DeFi protocols gaining momentum ⚡
Staking rewards at all-time highs 🎯
Layer 2 migration accelerating 🚀

Data-driven opportunities emerging 👀"`;
}

function getImagePrompt(type, style, topic) {
  if (type === "project") {
    const baseStyle = "Modern, professional, high-quality, vibrant colors, clean design, Farcaster purple (#855DCD) and Base blue (#0052FF) theme";
    
    const stylePrompts = {
      morning: `${baseStyle}, sunrise theme, morning energy, inspirational, exactly 10 floating NFT cards arranged in a grid, golden sunrise lighting, motivational aesthetic, BASED tokens gently falling, warm orange and purple gradients, staking vault icon glowing in corner`,
      
      afternoon: `${baseStyle}, product showcase aesthetic, sleek app interface mockup showing max 10 NFT slots, batch minting visualization, modern dashboard design with staking panel, step-by-step infographic elements, user-friendly UI/UX, professional presentation, batch processing and staking icons prominent`,
      
      evening: `${baseStyle}, celebration and excitement theme, reward system visualization with 10 NFT cards highlighted, staking pool glowing with rewards, BASED token spotlight with dramatic lighting, treasure chest with 10 slots, announcement vibe, premium quality, neon glow effects, party atmosphere, limited edition feel`
    };
    
    return `Create a promotional social media image for Farcaster Social Batch App - an NFT batch minting platform (MAX 10 NFTs per user) with staking system and token rewards: ${topic}. ${stylePrompts[style]}. Include exactly 10 NFT cards/slots to represent the limit, staking vault imagery, token symbols, and modern crypto aesthetics. Professional quality, no text overlay.`;
  }
  
  // Crypto content
  const baseStyle = "Professional, high-quality, modern design, Base blue (#0052FF) color scheme, clean and minimal, crypto aesthetic";
  
  const stylePrompts = {
    morning: `${baseStyle}, sunrise theme with warm orange and blue gradients, inspirational and uplifting mood, abstract blockchain network visualization with morning light rays, data nodes connecting, optimistic atmosphere`,
    
    afternoon: `${baseStyle}, technical blueprint style, code editor dark theme, developer workspace aesthetic, floating terminal windows, architectural diagrams, smart contract visualizations, VS Code inspired interface, matrix-style code flowing`,
    
    evening: `${baseStyle}, financial news broadcast quality, sophisticated data visualization, dynamic charts and graphs rising, infographic style with bold typography, professional news network aesthetic, market analysis dashboard, trading terminal vibes`
  };
  
  return `Create a crypto/blockchain educational image about: ${topic}. ${stylePrompts[style]}. Base blockchain focused. Professional quality, no text overlay.`;
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
      
      // Get content configuration based on time
      const { type, topics, style, lang } = getContentByTime();
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      
      console.log(`Type: ${type}, Style: ${style}, Lang: ${lang}, Topic: ${randomTopic}`);
      
      // Generate content with OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: getSystemPrompt(type, style, lang)
          },
          {
            role: "user",
            content: randomTopic
          }
        ],
        max_tokens: 200,
        temperature: 0.8
      });
      
      let content = completion.choices[0].message.content.trim();
      console.log("Content generated:", content);
      
      // Add project link for project posts
      if (type === "project") {
        content += "\n\n🔗 https://farcaster.xyz/miniapps/BPxGlbz_LeVd/farcaster-social-batch-app";
      }
      
      // Get trending hashtags for crypto posts
      if (type === "crypto") {
        console.log("Fetching trending crypto hashtags...");
        const hashtags = await getTrendingCryptoHashtags(openai);
        content += "\n\n" + hashtags;
        console.log("Hashtags added:", hashtags);
      }
      
      console.log("Final content:", content);
      
      // Generate image with DALL-E
      console.log("Generating image...");
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: getImagePrompt(type, style, randomTopic),
        size: "1024x1024",
        quality: "standard",
        n: 1,
      });
      
      const dalleImageUrl = imageResponse.data[0].url;
      
      // Upload to ImgBB for permanent hosting
      console.log("Uploading to ImgBB...");
      const permanentImageUrl = await uploadToImgBB(dalleImageUrl, process.env.IMGBB_API_KEY);
      
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
        message: `${type === 'project' ? '🎯 Project' : '📊 Crypto'} ${style} post published!`,
        contentType: type,
        style: style,
        language: lang,
        content: content,
        imageUrl: permanentImageUrl,
        features: type === 'project' ? {
          maxNFTs: 10,
          tokenReward: 1000,
          stakingEnabled: true,
          projectLink: "https://farcaster.xyz/miniapps/BPxGlbz_LeVd/farcaster-social-batch-app"
        } : null,
        castHash: castResult.cast?.hash,
        castUrl: `https://warpcast.com/${castResult.cast?.author?.username}/${castResult.cast?.hash}`,
        previewUrl: `https://warpcast.com/${castResult.cast?.author?.username}/${castResult.cast?.hash.substring(0, 10)}`
      });
      
    } catch (error) {
      console.error("ERROR:", error);
      return res.status(500).json({ 
        success: false, 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  return res.status(401).json({ error: "Unauthorized - Must be triggered by cron or manual=true" });
}
```

## 🎯 Yeni Özellikler:

### ✅ Proje Postlarında Artık:
1. **Max 10 NFT limit** sürekli vurgulanıyor
2. **Staking sistemi** her postta farklı şekillerde belirtiliyor
3. **Çeşitli mesaj tipleri:**
   - "Max 10 NFT mint edebilirsin"
   - "Stake et, pasif gelir kazan"
   - "10 NFT limitini doldurdun mu?"
   - "Her biri stake edilebilir"

### 📸 Görsel İyileştirmeleri:
- DALL-E prompt'larına **"exactly 10 NFT cards"** eklendi
- **Staking vault** görselleri
- **10 slot** gösterimli tasarımlar
- **Limited edition** hissi

## 📱 Örnek Post Çıktıları:

### Sabah Postu (09:00):
```
🌅 Günaydın Farcaster! ☕

Max 10 NFT mint edebilirsin 🎯
Her biri = 1000 BASED token 💎
Stake et, pasif gelir kazan! ⚡
Batch minting kolaylığı ✨

Şimdi başla 👇

🔗 https://farcaster.xyz/miniapps/BPxGlbz_LeVd/farcaster-social-batch-app
```

### Öğleden Sonra (15:00):
```
⏰ Farcaster Social Batch App Rehberi:

✅ Max 10 NFT mint hakkı
✅ Her NFT = 1000 BASED token
✅ Staking sistemi aktif - Stake et, kazan!
✅ Batch minting tek tıkla
✅ Büyük utility sürprizi yakında

Yerini kap 👇

🔗 https://farcaster.xyz/miniapps/BPxGlbz_LeVd/farcaster-social-batch-app
```

### Akşam Postu (21:00):
```
🔥 10 NFT limitini doldurdun mu?

Her mint = 1000 BASED token 💰
Hepsini stake et = Pasif gelir 📈
BASED utility açıklaması yakında 🎁
Staking rewards büyüyor! ⚡

Son yerler için 👇

🔗 https://farcaster.xyz/miniapps/BPxGlbz_LeVd/farcaster-social-batch-app
