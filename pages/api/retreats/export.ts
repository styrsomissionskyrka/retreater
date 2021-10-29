import { NextApiHandler } from 'next';
import { OrderStatus } from '@prisma/client';
import stringify from 'csv-stringify';

import { prisma } from 'api/context/prisma';
import { format } from 'lib/utils/date-fns';
import { authenticatedApi } from 'lib/auth/server';

const handler: NextApiHandler = async (req, res) => {
  try {
    let { retreatId } = req.query;
    let onlyConfirmed = req.query.confirmedOnly === 'true';

    if (typeof retreatId !== 'string') {
      res.status(400).json({ error: 'Parameter retreatId must be provided.' });
      return;
    }

    let retreat = await prisma.retreat.findUnique({ where: { id: retreatId } });
    if (retreat == null) {
      return res.status(404).json({ error: 'Retreat not found.' });
    }

    let orders = await prisma.order.findMany({
      where: { retreatId, status: onlyConfirmed ? OrderStatus.CONFIRMED : undefined },
    });

    stringify(
      orders,
      {
        header: true,
        columns: [
          { key: 'name', header: 'Namn' },
          { key: 'email', header: 'E-post' },
          { key: 'createdAt', header: 'Skapad' },
          { key: 'updatedAt', header: 'Uppdaterad' },
        ],
        cast: { date: (date) => format(date, 'yyyy-MM-dd HH:mm') },
      },
      (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
          return;
        }

        let filename = `${format(retreat!.startDate ?? new Date(), 'yyyy-MM-dd')}_${retreat!.slug}.csv`;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment;filename=${filename}`);
        res.send(data);
      },
    );
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

export default authenticatedApi(handler);
