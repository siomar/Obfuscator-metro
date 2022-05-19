
# Obfuscator Metro

Este pacote serve para ofuscar o código desenvolvido em projeto React-Native utilizando como base o javascript-obfuscator

## Uso

    Para ofuscar bastar criar um arquivo .ts ou .tsx que possui o nome "obfuscate." dentro do diretorio "src/"

## Instalação

    npm install @siomarjr/obfuscator-metro --save-dev

### React Native >= 0.59 *

#### metro.config.js

```diff
 module.exports = {
+  transformer: {
+    babelTransformerPath: require.resolve("@siomarjr/obfuscator-metro")
+  },
 }
```

ou utilizando um arquivo para multiplos babelTransformerPath

```diff
 module.exports = {
+  transformer: {
+    babelTransformerPath: require.resolve("./transformer")
+  },
 }
```

#### /transformer.js

```js
const obfuscatorTransformer = require("@siomarjr/obfuscator-metro")
module.exports.transform = (props) => {
    return obfuscatorTransformer.transform(props);
}
```

#### Configuração usada

```js

{
    ignoreRequireImports: true,
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    debugProtection: false,
    deadCodeInjectionThreshold: 0.4,
    debugProtectionInterval: false,
    disableConsoleOutput: true,
    identifierNamesGenerator: "hexadecimal",
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    selfDefending: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayCallsTransformThreshold: 0.75,
    stringArrayEncoding: [], 
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 2,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 4,
    stringArrayWrappersType: "function",
    stringArrayThreshold: 0.75,
    unicodeEscapeSequence: false,
}
```