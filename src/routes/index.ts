import { Router } from 'express';

import * as file from '../../package.json';

const router = Router();

router.get('/', async (req: Request, res: any) => {
  res.reply({ data: { service: file.name, version: file.version, author: file.author } });
});

export default router;
