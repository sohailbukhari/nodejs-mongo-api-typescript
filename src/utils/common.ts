import sha256 from 'sha256';

import keys from '../config/keys';

export const hash = (str: string) => {
  return sha256(str + keys.secret);
};

export const time = () => Math.floor(Date.now() / 1000);
