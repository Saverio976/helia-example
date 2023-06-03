import { strings } from '@helia/strings';
import { json } from '@helia/json';
import { CID } from 'multiformats/cid'
import type { Libp2p } from '@libp2p/interface-libp2p'
import type { Helia } from '@helia/interface';

export async function get(helia: Helia<Libp2p<{ x: Record<string, unknown>; }>>, cid: CID, type: 'string' | 'json'): Promise<string | object> {
    if (type === 'string') {
        const s = strings(helia); // use @helia/strings to retrieve strings
        const str = await s.get(cid);

        return str;
    } else if (type === 'json') {
        const j = json(helia); // use @helia/json to retrieve json
        const obj = await j.get<object>(cid);

        return obj;
    } else {
        throw Error('Invalid type');
    }
}
