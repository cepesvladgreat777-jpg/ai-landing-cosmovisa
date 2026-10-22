const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '../..');

/** Compile production TS in memory; inject browser APIs without installing a DOM. */
function loadTs(relativePath, { globals = {}, mocks = {} } = {}) {
  const cache = new Map();
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} };
    cache.set(filename, module);
    const source = fs.readFileSync(filename, 'utf8');
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    });
    vm.runInNewContext(
      outputText,
      {
        module,
        exports: module.exports,
        require(name) {
          if (name in mocks) return mocks[name];
          if (!name.startsWith('.')) return require(name);
          const base = path.resolve(path.dirname(filename), name);
          const target = [base + '.ts', base + '.tsx', path.join(base, 'index.ts')].find(fs.existsSync);
          if (!target) throw new Error(`Cannot resolve ${name} from ${filename}`);
          return load(target);
        },
        ...globals,
      },
      { filename },
    );
    return module.exports;
  }
  return load(path.resolve(ROOT, relativePath));
}

module.exports = { loadTs, ROOT };
