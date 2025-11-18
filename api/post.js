import OpenAI from "openai";

// ============================================
// DETAILED PROJECT TOPICS - Turkish
// ============================================

const projectTopicsTR = [
  {
    category: "onboarding",
    prompts: [
      "Yeni kullanicilar icin Farcaster Social Batch App'i tanitici bir giris yaz. Base blockchain'de NFT basmanin kolayligini, max 10 NFT limitini, her NFT icin 1000 BASED token kazanma firsatini ve staking sistemini anlat.",
      "Farcaster Social Batch App nedir? Base network uzerinde calisir, batch minting ile tek seferde coklu NFT basilir, kullanici basina max 10 NFT hakki vardir, her NFT 1000 BASED token kazandirir ve stake edilebilir.",
      "Base blockchain'de ilk NFT'nizi basmak istiyorsaniz Farcaster Social Batch App tam size gore! Max 10 NFT basabilir, her birinden 1000 BASED token kazanabilir ve hepsini stake edebilirsiniz."
    ]
  },
  {
    category: "earning",
    prompts: [
      "Farcaster Social Batch App ile nasil para kazanilir? 1) Base'de NFT bas (max 10), 2) Her NFT = 1000 BASED token, 3) NFT'leri stake et, 4) Pasif gelir kazan, 5) BASED token utility surprizini bekle!",
      "NFT basarak token kazanma rehberi: Base blockchain uzerinde transaksyon yap, max 10 NFT bas, otomatik 1000 BASED token kazan, stake ederek extra kazanc elde et.",
      "Kripto dunyasinda yeni bir kazanc modeli: Base'de NFT mint et, BASED token topla (1000/NFT), stake sistemiyle pasif gelir yarat, yakinda aciklanacak utility ile daha fazla kazan!"
    ]
  },
  {
    category: "staking",
    prompts: [
      "Staking sistemi nasil calisir? NFT'lerini stake et, pasif gelir kazan, BASED token rewards topla. Her kullanici max 10 NFT basabilir ama staking ile unlimited earning potansiyeli!",
      "NFT stake etmenin avantajlari: Pasif gelir, BASED token rewards, yakinda gelecek ekstra bonuslar. Base blockchain guvenliginde, Farcaster ekosisteminde.",
      "Max 10 NFT basilir ama stake ederek kazanc siniri yoktur! Her bastiginiz NFT 1000 BASED token kazandirir, stake ettiginizde de surekli reward akar."
    ]
  },
  {
    category: "urgency",
    prompts: [
      "10 NFT limitini dolduran ilk 1000 kullaniciya ozel bonuslar geliyor! Base'de hemen transaksyon yap, NFT bas, 1000 BASED token kazan, stake et!",
      "BASED token utility aciklamasi yaklasti! Simdi max 10 NFT bas, toplam 10,000 BASED token topla, stake et, buyuk surpriz icin hazir ol!",
      "Suan mint eden kazaniyor: Her NFT 1000 BASED token, staking aktif, utility surprizi yolda. Gecikme, Base blockchain'de hemen islem yap!"
    ]
  },
  {
    category: "community",
    prompts: [
      "Farcaster Social Batch toplulugu buyuyor! Binlerce kullanici Base'de NFT basip BASED token topluyor. Sen de katil, mint et, stake et, birlikte kazanalim!",
      "Base blockchain'in en aktif NFT topluluguna hosgeldin! Max 10 NFT bas, her birinden 1000 token kazan, stake ederek pasif gelir elde et.",
      "Topluluk gucumuz buyuyor: Her gun yuzlerce yeni NFT basiliyor, binlerce BASED token dagitiliyor, staking pool buyuyor. Yerini al!"
    ]
  }
];

const projectTopicsEN = [
  {
    category: "onboarding",
    prompts: [
      "Discover Farcaster Social Batch App on Base blockchain! Batch mint up to 10 NFTs, earn 1000 BASED tokens per mint, and stake for passive income. Revolutionary earning system!",
      "New to Base? Start with Farcaster Social Batch App: mint NFTs (max 10 per user), automatically receive 1000 BASED tokens each, stake your collection for rewards.",
      "Welcome to the future of NFT minting on Base! Batch process, 10 NFT limit, 1000 BASED tokens per mint, staking system, and surprise utility coming soon!"
    ]
  },
  {
    category: "technical",
    prompts: [
      "How it works: 1) Connect wallet to Base network, 2) Batch mint NFTs (max 10), 3) Receive 1000 BASED tokens automatically per mint, 4) Stake NFTs for passive rewards, 5) Wait for utility reveal!",
      "Technical breakdown: Base L2 transactions, gas-efficient batch minting, automatic token distribution (1000 BASED/NFT), smart contract staking, upcoming utility integration.",
      "Base blockchain advantages: Low gas fees, fast transactions, secure minting process. Mint your max 10 NFTs, collect 10,000 BASED tokens total, stake for ongoing rewards!"
    ]
  },
  {
    category: "defi",
    prompts: [
      "DeFi meets NFTs on Base! Mint NFTs, earn BASED tokens (1000 each), stake for yield, participate in upcoming utility. Complete ecosystem in one app!",
      "Passive income on Base blockchain: NFT minting (max 10) + token rewards (1000 BASED each) + staking yields + surprise utility = multiple revenue streams!",
      "Building your Base portfolio: Mint NFTs, accumulate BASED tokens, stake for rewards. Max 10 NFTs means 10,000 BASED tokens potential. Staking multiplies your earnings!"
    ]
  }
];

// ============================================
// CRYPTO TOPICS - Bilingual
// ============================================

const cryptoTopics = [
  {
    category: "base_ecosystem",
    promptEN: "Analyze current Base blockchain ecosystem growth, TVL trends, top protocols, developer activity, and Layer 2 adoption metrics. Include specific numbers and data-driven insights.",
    promptTR: "Base blockchain ekosistem buyumesini analiz et: TVL trendleri, en populer protokoller, gelistirici aktivitesi ve Layer 2 benimseme metrikleri. Somut sayilar ve veri odakli gorusler ekle."
  },
  {
    category: "defi_innovation",
    promptEN: "Discuss latest DeFi innovations on Base: new protocols, yield farming opportunities, liquidity mining, staking mechanisms. Focus on practical opportunities for users.",
    promptTR: "Base'deki en yeni DeFi yeniliklerini tartiş: yeni protokoller, yield farming firsatlari, likidite madenciligi, staking mekanizmalari. Kullanicilar icin pratik firsatlara odaklan."
  },
  {
    category: "nft_trends",
    promptEN: "Explore NFT marketplace trends on Base: volume analysis, popular collections, minting trends, utility NFTs. Highlight opportunities in the Base NFT ecosystem.",
    promptTR: "Base'deki NFT pazar trendlerini kesfet: hacim analizi, populer koleksiyonlar, mint trendleri, utility NFT'ler. Base NFT ekosistemindeki firsatlari vurgula."
  },
  {
    category: "layer2_scaling",
    promptEN: "Deep dive into Layer 2 scaling solutions: Base vs other L2s, transaction costs, speed comparisons, bridge activity. Technical but accessible explanation.",
    promptTR: "Layer 2 olceklendirme cozumlerine derinlemesine bakis: Base vs diger L2'ler, islem maliyetleri, hiz karsilastirmalari, kopru aktivitesi. Teknik ama anlasilir aciklama."
  }
];

// ============================================
// GET TRENDING HASHTAGS
// ============================================

async function getTrendingHashtags(openai) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Return ONLY a JSON array of 4-6 trending crypto hashtags. Mix general crypto, Base-specific, and topic-specific tags. Format: [\"#Crypto\",\"#Base\",\"#DeFi\",\"#NFTs\",\"#BuildOnBase\",\"#Web3\"]"
        },
        {
          role: "user",
          content: "Generate diverse trending crypto hashtags for today"
        }
      ],
      max_tokens: 80,
      temperature: 0.9
    });
    
    const hashtags = JSON.parse(completion.choices[0].message.content.trim());
    return hashtags.slice(0, 6).join(' ');
  } catch (error) {
    console.error("Hashtag error:", error);
    return "#Crypto #Base #DeFi #NFTs #Web3 #BuildOnBase";
  }
}

// ============================================
// TIME-BASED CONTENT SELECTION
// ============================================

function getContentConfig() {
  const hour = new Date().getUTCHours();
  
  if (hour === 6) { // 09:00 Turkey - PROJECT
    const randomCategory = projectTopicsTR[Math.floor(Math.random() * projectTopicsTR.length)];
    return {
      type: "project",
      prompt: randomCategory.prompts[Math.floor(Math.random() * randomCategory.prompts.length)],
      lang: "tr",
      style: "morning"
    };
  }
  
  if (hour === 12) { // 15:00 Turkey - CRYPTO
    const randomTopic = cryptoTopics[Math.floor(Math.random() * cryptoTopics.length)];
    return {
      type: "crypto",
      promptEN: randomTopic.promptEN,
      promptTR: randomTopic.promptTR,
      lang: "bilingual",
      style: "afternoon"
    };
  }
  
  if (hour === 18) { // 21:00 Turkey - PROJECT
    const randomCategory = projectTopicsEN[Math.floor(Math.random() * projectTopicsEN.length)];
    return {
      type: "project",
      prompt: randomCategory.prompts[Math.floor(Math.random() * randomCategory.prompts.length)],
      lang: "en",
      style: "evening"
    };
  }
  
  // Default
  const randomCategory = projectTopicsTR[Math.floor(Math.random() * projectTopicsTR.length)];
  return {
    type: "project",
    prompt: randomCategory.prompts[Math.floor(Math.random() * randomCategory.prompts.length)],
    lang: "tr",
    style: "morning"
  };
}

// ============================================
// CREATIVE SYSTEM PROMPTS
// ============================================

function getCreativeSystemPrompt(type, lang, style) {
  if (type === "project") {
    return `Sen yaratici bir sosyal medya icerik ureticisin. Farcaster Social Batch App icin ${lang === "tr" ? "Turkce" : "Ingilizce"} post yaziyorsun.

TEMEL BILGILER:
- Uygulama: Farcaster Social Batch App
- Blockchain: Base (Layer 2)
- Ozellikler: Batch NFT minting, max 10 NFT/user, 1000 BASED token/NFT, Staking sistemi
- Link: https://farcaster.xyz/miniapps/BPxGlbz_LeVd/farcaster-social-batch-app

YARATICILIK KURALLARI:
1. HER POST FARKLI OLMALI - Asla ayni cumleler, ayni yapi kullanma
2. Cesitli acilimlar dene: Soru ile basla, istatistik ver, hikaye anlat, call-to-action ile bitir
3. Emoji kullanimi yaratici olsun (💎🚀⚡🔥💰🎯✨🌟💫⭐🎁🏆)
4. 4-6 kisa paragraf veya satirla yaz
5. Her paragraf farkli bir aci ortaya koysun
6. Samimi, heyecanli ama profesyonel ton
7. SPAM gibi gorunme - dogal ve organik yaz

${style === "morning" ? "SABAH STILI: Enerjik, motive edici, yeni baslangiclara odakli" : ""}
${style === "evening" ? "AKSAM STILI: FOMO yaratici, topluluk odakli, heyecan verici" : ""}

FORMAT:
- Link EKLEME, sistem otomatik ekleyecek
- Max 280 karakter ideal
- Her post benzersiz olmali!

ORNEK VARYASYONLAR:
Versiyon A (Soru): "Base'de NFT basmak mi istiyorsun? 🤔"
Versiyon B (Rakam): "10 NFT = 10,000 BASED token 💰"
Versiyon C (Hikaye): "Dun 500 kisi mint etti! 🔥"
Versiyon D (Urgent): "Limitler dolmadan hemen! ⚡"

SEN BENZERSIZ VE FARKLI BIR POST YAZ!`;
  }
  
  // Crypto bilingual
  return `You are a creative crypto content analyst creating BILINGUAL posts (English + Turkish).

CREATIVITY RULES:
1. EVERY POST MUST BE UNIQUE - Never repeat same sentences or structure
2. Try various angles: Start with stats, breaking news, technical insight, or question
3. Use emojis creatively (📊🚀💎⚡🔥📈💰🌐🎯)
4. Write in 2 sections: English first, then Turkish translation
5. Each section: 3-4 short impactful paragraphs
6. Professional but engaging tone
7. Include specific numbers/data when possible

FORMAT:
🇬🇧 ENGLISH:
[Your English content here]

🇹🇷 TURKCE:
[Turkish translation here]

HASHTAGS: System will add automatically, don't include

Focus on: Base blockchain, Layer 2 trends, DeFi opportunities, NFT ecosystem

MAKE IT UNIQUE AND DIFFERENT EVERY TIME!`;
}

// ============================================
// IMAGE GENERATION
// ============================================

function getImagePrompt(type, style) {
  const baseStyles = [
    "futuristic holographic interface",
    "neon cyberpunk aesthetic",
    "minimalist geometric shapes",
    "abstract data visualization",
    "3D isometric design",
    "gradient mesh background",
    "particle system effects"
  ];
  
  const randomStyle = baseStyles[Math.floor(Math.random() * baseStyles.length)];
  
  if (type === "project") {
    const variations = [
      `${randomStyle}, Farcaster purple #855DCD and Base blue #0052FF theme, exactly 10 floating NFT cards arranged artistically, BASED token symbols, staking vault with glowing effects, modern crypto aesthetic, professional quality, no text`,
      `Modern crypto app showcase, ${randomStyle}, batch minting interface visualization, 10 NFT slots prominently displayed, token rain effect, Base blockchain nodes connecting, vibrant colors, high quality, clean design, no text overlay`,
      `${randomStyle}, NFT collection grid of 10 items, staking mechanism visualization, BASED tokens flowing, Base network background, Farcaster branding colors, premium quality, futuristic, no text`
    ];
    return variations[Math.floor(Math.random() * variations.length)];
  }
  
  // Crypto content
  const cryptoVariations = [
    `${randomStyle}, Base blockchain visualization, Layer 2 network nodes, DeFi protocol connections, blue color scheme #0052FF, professional financial aesthetic, data charts rising, no text`,
    `${randomStyle}, cryptocurrency market dashboard, Base ecosystem growth, TVL charts, trading volume graphs, modern fintech design, blue and cyan gradients, no text overlay`,
    `${randomStyle}, blockchain technology concept, Base L2 architecture, smart contracts flowing, developer workspace aesthetic, code visualization, modern tech design, no text`
  ];
  return cryptoVariations[Math.floor(Math.random() * cryptoVariations.length)];
}

// ============================================
// IMGBB UPLOAD
// ============================================

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
  
  const result = await imgbbResponse.json();
  return result.data.url;
}

// ============================================
// MAIN HANDLER
// ============================================

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.headers['user-agent']?.includes('vercel-cron') || req.query.manual === 'true') {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const config = getContentConfig();
      console.log("Config:", config);
      
      // Generate content
      let contentMessages = [];
      
      if (config.type === "crypto" && config.lang === "bilingual") {
        contentMessages = [
          { role: "system", content: getCreativeSystemPrompt("crypto", "bilingual", config.style) },
          { role: "user", content: `English topic: ${config.promptEN}\n\nTurkish topic: ${config.promptTR}` }
        ];
      } else {
        contentMessages = [
          { role: "system", content: getCreativeSystemPrompt(config.type, config.lang, config.style) },
          { role: "user", content: config.prompt }
        ];
      }
      
      console.log("Generating creative content...");
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: contentMessages,
        max_tokens: 300,
        temperature: 0.95, // High creativity
        top_p: 0.95,
        frequency_penalty: 1.2, // Avoid repetition
        presence_penalty: 0.8 // Encourage new topics
      });
      
      let content = completion.choices[0].message.content.trim();
      console.log("Generated content:", content);
      
      // Add project link or hashtags
      if (config.type === "project") {
        content += "\n\nhttps://farcaster.xyz/miniapps/BPxGlbz_LeVd/farcaster-social-batch-app";
      } else {
        const hashtags = await getTrendingHashtags(openai);
        content += "\n\n" + hashtags;
      }
      
      // Generate image
      console.log("Generating unique image...");
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: getImagePrompt(config.type, config.style),
        size: "1024x1024",
        quality: "standard",
        n: 1
      });
      
      const dalleUrl = imageResponse.data[0].url;
      
      // Upload to ImgBB
      console.log("Uploading to ImgBB...");
      const permanentUrl = await uploadToImgBB(dalleUrl, process.env.IMGBB_API_KEY);
      
      // Post to Farcaster
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
        throw new Error(`Cast failed (${castResponse.status}): ${errorText}`);
      }
      
      const result = await castResponse.json();
      
      return res.status(200).json({
        success: true,
        type: config.type,
        language: config.lang,
        style: config.style,
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
```

## 🎯 Yeni Özellikler:

### ✅ Yaratıcılık ve Çeşitlilik:
- **5 farklı kategori** proje postları: onboarding, earning, staking, urgency, community
- **Her kategoride 3+ farklı prompt** - Her seferinde farklı içerik
- **`temperature: 0.95`** - Maksimum yaratıcılık
- **`frequency_penalty: 1.2`** - Tekrar eden cümleleri engeller
- **`presence_penalty: 0.8`** - Yeni konulara yönlendirir

### ✅ Detaylı ve Can Alıcı İfadeler:
- "Base'de transaksyon yap"
- "Bastığınız NFT ile BASED token sahibi olun"
- "Yakındaki sürprizleri bekleyin"
- "Max 10 NFT = 10,000 BASED token"
- "Stake ederek unlimited earning"

### ✅ İkili Dil Desteği:
Crypto postları artık şöyle:
```
🇬🇧 ENGLISH:
Base blockchain TVL surged 35%...

🇹🇷 TURKCE:
Base blockchain TVL %35 artti...

#Crypto #Base #DeFi
