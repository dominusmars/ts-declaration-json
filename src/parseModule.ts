import * as ts from "typescript";
import fs from "fs";
import path from "path";
import { ModuleDeclaration } from "./types";
import { parseInterfaceNode } from "./parseInterfaceNode";
import { parseTypeNode } from "./parseTypeNode";

export function getModuleDeclarations(modulePath: string) {
    const files = fs.readdirSync(modulePath);
    const props: ModuleDeclaration = {};

    files.forEach((file) => {
        const filePath = path.join(modulePath, file);
        if (fs.statSync(filePath).isDirectory()) {
            let basename = path.basename(filePath);
            props[basename] = getModuleDeclarations(filePath);
            return;
        }
        const fileContent = fs.readFileSync(filePath, "utf-8");

        const sourceFile = ts.createSourceFile(file, fileContent, ts.ScriptTarget.Latest, true);

        ts.forEachChild(sourceFile, (node) => {
            if (ts.isInterfaceDeclaration(node) && node.name) {
                props[node.name.getText()] = parseInterfaceNode(node);
            }

            if (ts.isTypeAliasDeclaration(node) && node.name) {
                props[node.name.getText()] = parseTypeNode(node);
            }
            if (ts.isTypeNode(node)) {
                if (!(node as any).name) {
                    // check parent for name
                    if (ts.isTypeAliasDeclaration(node.parent)) {
                        props[node.parent.name.getText()] = parseTypeNode(node);
                    } else {
                        // Unable to find name just use node text
                        // props[node.getText()] = parseTypeNode(node);
                    }
                } else props[(node as any).name.getText()] = parseTypeNode(node);
            }
        });
    });

    return props;
}
