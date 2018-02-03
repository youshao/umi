import { join } from 'path';
import { existsSync } from 'fs';

export default function(api) {
  const { paths } = api.service;
  const { winPath } = api.utils;

  api.register('modifyRouterFile', ({ memo }) => {
    const cssImports = [
      join(paths.absSrcPath, 'global.css'),
      join(paths.absSrcPath, 'global.less'),
    ]
      .filter(f => existsSync(f))
      .map(f => `import('${winPath(f)}');`);

    if (cssImports.length) {
      return memo.replace(
        '<%= codeForPlugin %>',
        `
${cssImports.join('\r\n')}
<%= codeForPlugin %>
          `.trim(),
      );
    } else {
      return memo;
    }
  });

  api.register('modifyPageWatchers', ({ memo }) => {
    return [
      ...memo,
      join(paths.absSrcPath, 'global.css'),
      join(paths.absSrcPath, 'global.less'),
    ];
  });
}
