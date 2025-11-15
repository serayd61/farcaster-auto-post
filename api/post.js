import OpenAI from "openai";

// Morning Topics (09:00 UTC+3)
const morningTopics = [
  "Daily crypto market sentiment and opening trends",
  "Inspirational blockchain success stories",
  "This day in crypto history - major milestones",
  "Weekly DeFi goals and strategies",
  "Morning analysis: Ethereum network health",
  "Base ecosystem morning briefing",
  "Crypto market psychology and trading mindset",
  "Layer 2 adoption rates this week"
];

// Afternoon Topics (15:00 UTC+3) - Developer Focus
const afternoonTopics = [
  "Smart contract optimization techniques",
  "Solidity best practices and common pitfalls",
  "Base development tutorial: Building your first dApp",
  "Web3 debugging tools and techniques",
  "Gas optimization strategies for Ethereum",
  "Hardhat vs Foundry: Developer tools comparison",
  "Testing smart contracts: Complete guide",
  "Cross-chain development patterns",
  "OpenZeppelin contracts: Security tips",
  "Base API integration examples"
];

// Evening Topics (21:00 UTC+3) - News & Analysis
const eveningTopics = [
  "Breaking: Major Ethereum upgrade announcement",
  "Base TVL reaches new all-time high analysis",
  "DeFi protocol security audit findings",
  "NFT marketplace volume comparison",
  "Layer 2 transaction costs deep dive",
  "Optimism Superchain expansion news",
  "Institutional crypto adoption trends",
  "Base bridge volume and cross-chain activity",
  "Ethereum gas fees: Weekly analysis",
  "Blockchain scalability solutions compared"
];

function getTopicsByTime() {
  const hour = new Date().getUTCHours() + 3; // UTC+3 for Turkey
  
  if (hour >= 6 && hour < 12) {
    return { topics: morningTopics, style: "morning" };
  } else if (hour >= 12 && hour < 18) {
    return { topics: afternoonTopics, style: "afternoon" };
  } else {
    return { topics: eveningTopics, style: "evening" };
  }
}

function getSystemPrompt(style) {
  const prompts = {
    morning: `You are an inspiring crypto morning briefing writer. 

Style:
- Energetic and motivational tone
- "Good morning" vibes
- Market opening analysis
- 240 characters max
- Use sunrise/morning emojis (🌅☀️📈)
- Positive and encouraging
- Quick actionable insights

Example: "☀️ Good morning! Ethereum network shows 98% uptime this week. Base processed 2.1M transactions yesterday. Layer 2s are thriving! Time to build. 🚀"`,

    afternoon: `You are a senior blockchain developer and educator.

Style:
- Technical but accessible
- Educational and practical
- Code-focused when relevant
- 250 characters max
- Use dev/tech emojis (💻⚙️🔧)
- Tutorial-style tips
- Actionable advice

Example: "💻 Pro tip: Use 'memory' instead of 'storage' for temporary variables in Solidity. Can save up to 100x on gas costs. Test it on Base testnet first! ⚡"`,

    evening: `You are a crypto news analyst and investigative reporter.

Style:
- Breaking news format
- Data-driven and analytical
- Professional journalism tone
- 250 characters max
- Use analysis emojis (📊🔍📰)
- Include metrics and numbers
- Objective and informative

Example: "📊 Base network analysis: TVL surged 35% to $1.8B this week. Top protocol Aerodrome commands 28% market share. DeFi migration from mainnet accelerating. 📈"`
  };
  
  return prompts[style];
}

function getImagePrompt(style, topic) {
  const baseStyle = "Professional, high-quality, modern design, blue color scheme (#0052FF), clean and minimal";
  
  const stylePrompts = {
    morning: `${baseStyle}, sunrise theme, warm orange and blue gradients, inspirational, uplifting mood, abstract blockchain network with morning light rays, motivational aesthetic`,
    
    afternoon: `${baseStyle}, technical blueprint style, code editor theme, developer workspace aesthetic, terminal windows, architectural diagrams, VS Code inspired, dark mode friendly`,
    
    evening: `${baseStyle}, financial news broadcast quality, data visualization, charts and graphs, infographic style, bold typography aesthetic, professional news network look`
  };
  
  return `Create an image about: ${topic}. ${stylePrompts[style]}. No text overlay.`;
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
    const errorText = await imgbbResponse.text();
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
      
      // Determine time-based content
      const { topics, style } = getTopicsByTime();
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      
      console.log(`Time style: ${style}, Topic: ${randomTopic}`);
      
      // Generate content
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: getSystemPrompt(style)
          },
          {
            role: "user",
            content: randomTopic
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      });
      
      const content = completion.choices[0].message.content.trim();
      console.log("Content generated:", content);
      
      // Generate image
      console.log("Generating image...");
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: getImagePrompt(style, randomTopic),
        size: "1024x1024",
        quality: "standard",
        n: 1,
      });
      
      const dalleImageUrl = imageResponse.data[0].url;
      
      // Upload to ImgBB
      console.log("Uploading to ImgBB...");
      const shortImageUrl = await uploadToImgBB(dalleImageUrl, process.env.IMGBB_API_KEY);
      
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
        message: `${style.charAt(0).toUpperCase() + style.slice(1)} post published!`,
        style: style,
        content: content,
        imageUrl: shortImageUrl,
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
