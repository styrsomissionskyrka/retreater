import { NextApiRequest, NextApiResponse } from 'next';

import { compile } from 'api/email-templates';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let result = await compile('new-order', {
      retreat: { name: 'whatever', startDate: Date.now() },
      order: { id: '123-123-123', name: 'Adam Bergman' },
    });
    res.json({ success: true, result });
  } catch (error) {
    console.error(error);
    res.json({ success: false, error });
  }
}
