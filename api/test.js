export default async function handler(req, res) {
  return res.status(200).json({ 
    success: true,
    env_check: {
      neynar: !!process.env.NEYNAR_API_KEY,
      signer: !!process.env.SIGNER_UUID,
      openai: !!process.env.OPENAI_API_KEY
    }
  });
}
