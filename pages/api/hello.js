// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// for when we want to do HTTP GET/POST requests

export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
