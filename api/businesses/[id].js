import { route } from '../_lib/handler.js';

export default async function handler(req, res) {
  const id = req.query.id;
  return route(`/businesses/${id}`)(req, res);
}