import { createJiti } from 'jiti';
import type jiti from 'jiti';
import { transform, Options } from 'sucrase';

type Jiti = ReturnType<typeof jiti>;
type JITIOptions = Jiti['options'];

let jitiInstance: ReturnType<typeof jiti> | null = null;
function lazyJiti(option: JITIOptions = {}, transformOpt = {} as Options) {
  return (
    jitiInstance ??
    (jitiInstance = createJiti(__filename, {
      interopDefault: true,
      ...option,
      transform: (opts) => {
        return transform(opts.source, {
          transforms: ['typescript', 'imports'],
          ...transformOpt,
        });
      },
    }))
  );
}

export interface LoadConfOption {
  jiti?: boolean;
  jitiOptions?: JITIOptions;
  transformOption?: Options;
}

export async function loadConf<T>(path: string, option: LoadConfOption = {}): Promise<T> {
  const { jiti = true, jitiOptions, transformOption } = option;
  let config = await (async function () {
    try {
      if (jiti) {
        return path ? await lazyJiti(jitiOptions, transformOption).import(path) : {};
      } else {
        return path ? require(path) : {};
      }
    } catch {
      return await lazyJiti(jitiOptions, transformOption).import(path);
    }
  })();

  // Ensure both default export and named exports are handled
  if (config.default) {
    if (typeof config.default === 'function') {
      const defaultFunc = config.default;
      Object.assign(defaultFunc, config);
      return defaultFunc;
    } else {
      config = { ...config.default, ...config };
    }
  }

  // ⚠️ 🚨 For some reason, the CI test default does not exist on the Windows platform.
  // To ensure platform consistency, default has been removed.
  if (path && path.endsWith('.cjs')) {
    delete config.default;
  }

  return config;
}

export async function jsLoader<T>(filepath: string, content: string, option: LoadConfOption = {}): Promise<T> {
  return await loadConf<T>(filepath, option);
}
