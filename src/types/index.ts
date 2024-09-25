export type UnknownDeclaration = {
    optional?: boolean;

    type: string;
    text: string;
};
export type FunctionDeclaration = {
    optional?: boolean;
    type: "function";
    text: string;
};

export type NumberDeclaration = {
    optional?: boolean;

    type: "number";
};
export type BooleanDeclaration = {
    optional?: boolean;

    type: "boolean";
};
export type StringDeclaration = {
    optional?: boolean;

    type: "string";
};
export type LiteralDeclaration = {
    optional?: boolean;
    text: string;
    type: string;
};
export type UnionDeclaration = {
    optional?: boolean;
    text: string;
    type: any[];
};
export type ArrayDeclaration = {
    optional?: boolean;

    type: string;
};
export type TupleDeclaration = {
    optional?: boolean;

    type: string[];
};
export type PropertyDeclaration =
    | ArrayDeclaration
    | TupleDeclaration
    | NumberDeclaration
    | BooleanDeclaration
    | StringDeclaration
    | UnknownDeclaration
    | FunctionDeclaration
    | Implementation
    | string;

export type Implementation = {
    [key: string]: LiteralDeclaration | TypeDeclaration | InterfaceDeclaration | UnionDeclaration | PropertyDeclaration;
};

export type TypeDeclaration = {
    name: string;
    implementation: Implementation | TypeDeclaration;
    text: string;
    error?: string;
    [key: string]: any;
};

export type InterfaceDeclaration = {
    name: string;
    implementation: Implementation;
    text: string;
    error?: string;
};

export type ModuleDeclaration = {
    [key: string]: InterfaceDeclaration | TypeDeclaration | ModuleDeclaration;
};
