export default async function handler(req, res) {
  return res.status(200).json({ 
    message: "Farcaster Auto Post Bot",
    status: "running",
    endpoints: {
      test: "/api/test",
      post: "/api/post?manual=true"
    }
  });
}
