import { CID } from 'multiformats/cid'
import { createNode } from './createNode.js';

import { get } from './libhelia/get.js';
import { add } from './libhelia/add.js';

const printHelp = () => {
    console.log("USAGE:");
    console.log("\tnpm run start help");
    console.log("\tnpm run start string add <string to store>");
    console.log("\tnpm run start string get <cid>");
    console.log("\tnpm run start json add <json to store>");
    console.log("\tnpm run start json get <cid>");
    console.log("\tnpm run start blockstore-ls");
    console.log("\tnpm run start datastore-ls");
    console.log("\tnpm run start pin ls");
    console.log("\tnpm run start pin pin <cid>");
    console.log("\tnpm run start pin unpin <cid>");
}

if (process.argv[2] === 'help') {
    printHelp();
    process.exit(0);
}


async function main() {
    const { helia } = await createNode();

    if (process.argv[3] === 'add') {
        if (process.argv[2] === 'string' ) {
            await add(helia, process.argv[4]);
        } else if (process.argv[2] === 'json') {
            const obj = JSON.parse(process.argv[4]);
            await add(helia, obj);
        } else {
            printHelp();
            throw Error('Invalid type');
        }
    }
    if (process.argv[3] === 'get') {
        if (process.argv[2] === 'string') {
            await get(helia, CID.parse(process.argv[4]), 'string');
        } else if (process.argv[2] === 'json') {
            await get(helia, CID.parse(process.argv[4]), 'json');
        } else {
            printHelp();
            throw Error('Invalid type');
        }
    }

    if (process.argv[2] === 'blockstore-ls') {
        let list = [];

        for await (const { cid } of helia.blockstore.getAll()) {
            try {
                list.push(cid.toV1().toString());
            } catch (error) {
                list.push(cid.toString());
            }
        }
        console.log(list);
        process.exit(0);
    };

    if (process.argv[2] === 'pin') {
        if (process.argv[3] === 'ls') {
            let list: String[] = [];

            for await (const pin of helia.pins.ls()) {
                list.push(pin.cid.toString());
            }
            console.log(list);
            process.exit(0);
        }
        if (process.argv[3] === 'pin') {
            let cid: CID = CID.parse(process.argv[4]);

            await helia.pins.add(cid);
            process.exit(0);
        }
        if (process.argv[3] === 'unpin') {
            let cid: CID = CID.parse(process.argv[4]);

            await helia.pins.rm(cid);
            process.exit(0);
        }
    }

    if (process.argv[2] === 'datastore-ls') {
        let list = [];

        for await (const { key, value } of helia.datastore.query({})) {
            list.push({key, value});
        }
        console.log(list);
        process.exit(0);
    }
}

main().then(() => {
    printHelp();
    process.exit(1);
});
