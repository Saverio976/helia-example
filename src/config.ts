import { tcp } from '@libp2p/tcp';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
// import { bootstrap } from '@libp2p/bootstrap';
import { mdns } from '@libp2p/mdns';
import type { Datastore } from 'interface-datastore'

export const config = {
    blockstoreDir: "./.dbBlock",
    datastoreDir: "./.dbData",
    keyPath: "./.keys",
};

export const dbConfs = {
    events: {
        name: "eventsDb",
        identity: "userA",
    },
};

export const configp2p = (datastore: Datastore) => {
    return {
        datastore,
        addresses: {
            listen: [
                '/ip4/127.0.0.1/tcp/0'
            ]
        },
        transports: [
            tcp()
        ],
        connectionEncryption: [
            noise()
        ],
        streamMuxers: [
            yamux()
        ],
        peerDiscovery: [
            mdns({
                interval: 1
            }),
            // bootstrap({
            //     list: [
            //         '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
            //         '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
            //         '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
            //         '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
            //     ]
            // })
        ],
    }
};
