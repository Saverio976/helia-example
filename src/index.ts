import { createNode } from './createNode.js';

import { dbConfs, config } from './config.js';

// @ts-ignore
import { Events } from '../orbitdb/src/db/index.js';
// @ts-ignore
import { Identities, KeyStore } from '../orbitdb/src/index.js';
// @ts-ignore

const printHelp = () => {
    console.log("USAGE:");
    console.log("\tnpm run start help");
    console.log("\tnpm run start events add <value>");
}

if (process.argv[2] === 'help') {
    printHelp();
    process.exit(0);
}

const eventsCmds = async (evt: Events) => {
    console.log(evt);
    console.log(evt.add);

    console.log(await evt());

    if (process.argv[3] === 'add') {
        const value = process.argv[4];
        const res = await evt.add(value);
        console.log(res);
    }
    printHelp();
    throw new Error("Cmd not recognized");
};

async function main() {
    const { helia } = await createNode();
    const keystore = await KeyStore({ path: config.keyPath })
    const identities = await Identities({ keystore })
    const identity = await identities.createIdentity({ id: 'userA' })
    const evt = await Events()({ipfs: helia, name: dbConfs.events.name, identity});

    if (process.argv[2] === 'events') {
        await eventsCmds(evt);
    }
    throw new Error("Cmd not recognized");
}

main().then(() => {
    printHelp();
    process.exit(1);
}).catch(e => {
    console.error(e);
    printHelp();
    process.exit(1);
});
