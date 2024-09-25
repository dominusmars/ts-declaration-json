import { getModuleDeclarations } from "@/src/index";

let test1Module = "react-calendar";
import test1 from "react-calendar";
let test2Module = "react-social-media-embed";
import * as test2 from "react-social-media-embed";

import path from "path";
import fs from "fs";
import { searchObjectForAllKeys } from "./utils/objectIncludes";

describe("getModuleDeclarations function", () => {
    it("should list all Module Declaration of the package from react-calender", async () => {
        let pathToModule = path.join(require.resolve(test1Module), "/..");

        const result = await getModuleDeclarations(pathToModule);

        fs.writeFileSync("testing.json", JSON.stringify(result, null, 4));
        expect(searchObjectForAllKeys(result, ["Calendar"])).toEqual(true);
    });
    it("should list all Module Declaration of the package from react-social-media-embed", async () => {
        const expectedExports = Object.keys(test2);
        let pathToModule = path.join(require.resolve(test2Module), "/..");

        const result = await getModuleDeclarations(pathToModule);

        fs.writeFileSync("testing2.json", JSON.stringify(result, null, 4));
        expect(searchObjectForAllKeys(result, expectedExports)).toEqual(true);
    });
});
