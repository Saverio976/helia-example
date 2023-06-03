import { FsBlockstore } from 'blockstore-fs';
import { createHelia } from 'helia';
import { FsDatastore } from 'datastore-fs';
import { createLibp2p } from 'libp2p';

import { config, configp2p } from './config.js';

export async function createNode() {
    // Comment stocker les block
    // blockstore-fs -> file system
    // blockstore-level -> leveldb (database)
    // blockstore-core -> in memory
    // plus d'info: https://github.com/ipfs-examples/helia-101/blob/1c6a35364071512b86b48bb48ca6fa301f2dab1b/201-storage.js#L7-L12
    const blockstore = new FsBlockstore(config.blockstoreDir, {createIfMissing: true});
    // créer le dossier si il existe pas (fait une erreur sinon, je sais pas pourquoi)
    await blockstore.open();
    await blockstore.close();

    const datastore = new FsDatastore(config.datastoreDir, {createIfMissing: true});
    // créer le dossier si il existe pas (fait une erreur sinon, je sais pas pourquoi)
    await datastore.open();
    await datastore.close();

    const libp2p = await createLibp2p(configp2p(datastore));

    const helia = await createHelia({blockstore, datastore, libp2p});

    return {helia};
}
