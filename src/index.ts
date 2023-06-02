import { createHelia } from 'helia';
import { FsBlockstore } from 'blockstore-fs';
import { strings } from '@helia/strings';
import { json } from '@helia/json';
import { CID } from 'multiformats/cid'

import config from './config.js';

const printHelp = () => {
    console.log("USAGE:");
    console.log("\tnpm run start help");
    console.log("\tnpm run start string add <string to store>");
    console.log("\tnpm run start string get <cid>");
    console.log("\tnpm run start json add <json to store>");
    console.log("\tnpm run start json get <cid>");
}

console.log(process.argv);

if (process.argv[2] === 'help') {
    printHelp();
    process.exit(0);
}

async function main() {
    // Comment stocker les info
    // blockstore-fs -> file system
    // blockstore-level -> leveldb (database)
    // blockstore-core -> in memory
    // plus d'info: https://github.com/ipfs-examples/helia-101/blob/1c6a35364071512b86b48bb48ca6fa301f2dab1b/201-storage.js#L7-L12
    const blockstore = new FsBlockstore(config.dbDir);

    const helia = await createHelia({blockstore});

    if (process.argv[3] === 'add') {
        let cid: CID;

        if (process.argv[2] === 'string') {
            const str = process.argv[4];
            // use @helia/strings to store strings
            const s = strings(helia);

            console.log(`Storing string: ${str}`);
            cid = await s.add(process.argv[4]);
        } else if (process.argv[2] === 'json') {
            const obj = JSON.parse(process.argv[4]);
            // use @helia/json to store json
            const j = json(helia);

            console.log(`Storing json: ${obj}`);
            cid = await j.add(obj);
        } else {
            printHelp();
            process.exit(1);
        }
        console.log(`CID: ${cid}`);
        process.exit(0);
    }

    if (process.argv[3] === 'get') {
        // use multiformats/cid to parse string CID to CID
        const cid = CID.parse(process.argv[4]);

        if (process.argv[2] === 'string') {
            // use @helia/strings to retrieve strings
            const s = strings(helia);
            const str = await s.get(cid);

            console.log(`Retrieved string: ${str}`);
        } else if (process.argv[2] === 'json') {
            const j = json(helia);
            // use @helia/json to retrieve json
            const obj = await j.get(cid);

            console.log(`Retrieved json: ${obj}`);
        } else {
            printHelp();
            process.exit(1);
        }
        process.exit(0);
    }
}

main().then(() => {
    printHelp();
    process.exit(1);
});
