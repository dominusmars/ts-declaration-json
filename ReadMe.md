# Typescript To Json

Simple package which reads typescript source files in modules and returns the declarations in JSON format

## Usage

```sh
npm i typescript-to-json
```

```js
import { getModuleDeclarations } from "typescript-to-json";

const result = await getModuleDeclarations(pathToModule);
```

## warning

Implementation is not full a lot of edge cases weren't considered and need work. The purpose of this was to parse out Props from react components from packages that aren't well known
