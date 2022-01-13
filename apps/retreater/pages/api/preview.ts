import { NextApiHandler } from 'next';
import * as z from 'zod';

import { generatePostTypeUrl } from '../../lib/links';

const QuerySchema = z.object({
  id: z.string().transform((x) => Number(x)),
  type: z.string(),
  slug: z.string().transform((x) => (x === '' ? null : null)),
  parent_id: z.string().transform((x) => {
    if (x === '0') return null;
    return Number(x);
  }),
  parent_type: z.string(),
  parent_slug: z.string().transform((x) => (x === '' ? null : null)),
});

const handler: NextApiHandler = async (req, res) => {
  if (req.method?.toUpperCase() === 'GET') return initPreviewMode(req, res);
  if (req.method?.toUpperCase() === 'DELETE') return exitPreviewMode(req, res);

  res.setHeader('Allow', 'GET, DELETE');
  res.status(405);
  res.end('Method not allowed');
};

export default handler;

const initPreviewMode: NextApiHandler = async (req, res) => {
  try {
    let query = QuerySchema.parse(req.query);
    let slug = generatePostTypeUrl(
      query.type === 'revision' ? query.parent_type : query.type,
      query.type === 'revision' ? query.parent_id! : query.id,
    );

    res.setPreviewData(query);
    res.redirect(slug);
  } catch (error) {
    res.status(400);
    res.end('Preview data not available.');
  }
};

const exitPreviewMode: NextApiHandler = async (_, res) => {
  res.clearPreviewData().json({ message: 'Preview mode exited' });
};
