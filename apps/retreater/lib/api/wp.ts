import axios from 'axios';

export const wp = axios.create({
  baseURL: 'http://styrsomissionskyrka-api.local/wp-json',
  auth:
    typeof window === 'undefined'
      ? {
          username: process.env.WP_AUTH_USER!,
          password: process.env.WP_AUTH_PASSWORD!,
        }
      : undefined,
});
