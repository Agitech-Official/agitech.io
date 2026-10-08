import { buildFeed } from '../lib/feed';
export const GET = () => buildFeed('fr', '/feed.xml');
