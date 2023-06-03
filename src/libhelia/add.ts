import { strings } from '@helia/strings';
import { json } from '@helia/json';
import { CID } from 'multiformats/cid'
import type { Libp2p } from '@libp2p/interface-libp2p'
import type { Helia } from '@helia/interface';

export async function add(helia: Helia<Libp2p<{ x: Record<string, unknown>; }>>, value: string | object): Promise<CID> {
    const typeT = typeof value

    if (typeT === 'string') {
        const s = strings(helia); // use @helia/strings to store strings
        const str: string = value as string;

        console.log(`Storing string: ${str}`);
        const cid = await s.add(str);
        return cid;
    } else if (typeT === 'object') {
        const j = json(helia); // use @helia/json to store json
        const obj = value as object;

        console.log(`Storing json: ${obj}`);
        const cid = await j.add(obj);
        return cid;
    } else {
        throw Error('Invalid type');
    }
}
