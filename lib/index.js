const generate = require("@babel/generator");
const upstreamTypescriptTransformer = require("react-native-typescript-transformer");
const Obfuscator = require("javascript-obfuscator");
const traverse = require("@babel/traverse");
const babylon = require("@babel/parser");
const { SourceMapConsumer } = require("source-map");
const fs = require("fs-extra");
const path = require("path");

const transform = async (props) => {
  const result = upstreamTypescriptTransformer.transform(props);

  /** Checar ambiente */
  // if (props.options.dev) {
  //   return result;
  // }

  /** Arquivos contidos no node_modules*/
  if (props.filename.includes("node_modules")) {
    return result;
  }

  if (result.code || result.ast) {
    // if (props.filename.includes("src/views")) {
      try {
        const { code, map } = transformASTinCode(result.ast, props.filename);

        //obfuscator.io
        const code_obfuscator = Obfuscator.obfuscate(code, {
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
          stringArrayEncoding: [], //TRAVA
          stringArrayIndexShift: true,
          stringArrayRotate: true,
          stringArrayShuffle: true,
          stringArrayWrappersCount: 2,
          stringArrayWrappersChainedCalls: true,
          stringArrayWrappersParametersMaxCount: 4,
          stringArrayWrappersType: "function",
          stringArrayThreshold: 0.75,
          unicodeEscapeSequence: false,
        }).getObfuscatedCode();
        console.log(code_obfuscator);

        const file = path.join(process.cwd(), ".log", props.filename);
        fs.outputFile(file, code_obfuscator, (err) => {
          if (err) {
            return console.error(err);
          }
          console.log("Directory created successfully!");
        });

        const ast = babylon.parse(code_obfuscator, {
          sourceType: "module",
        });

        const mapConsumer = new SourceMapConsumer(map);

        traverse.default.cheap(ast, (node) => {
          if (node.loc) {
            const originalStart = mapConsumer.originalPositionFor(
              node.loc.start
            );
            if (originalStart.line) {
              node.loc.start.line = originalStart.line;
              node.loc.start.column = originalStart.column;
            }
            const originalEnd = mapConsumer.originalPositionFor(node.loc.end);
            if (originalEnd.line) {
              node.loc.end.line = originalEnd.line;
              node.loc.end.column = originalEnd.column;
            }
          }
        });

        console.log(ast.program.body);

        console.log(`Obfuscate code file : ${props.filename}`);
        return { ast, code, map };
      } catch (error) {
        console.log(`Error obfuscate ${props.filename} Erro : ${error}`);
      }
    // }
  }

  return result;
};

function transformASTinCode(ast, filename) {
  const result = generate.default(ast, {
    filename: filename,
    retainLines: true,
    sourceMaps: true,
    sourceFileName: filename,
  });

  if (!result.map) {
    return { code: result.code };
  }

  const map = {
    version: result.map.version + "",
    mappings: result.map.mappings,
    names: result.map.names,
    sources: result.map.sources,
    sourcesContent: result.map.sourcesContent,
    file: result.map.file,
  };

  return { code: result.code, map: map };
}

module.exports.transform = transform;
