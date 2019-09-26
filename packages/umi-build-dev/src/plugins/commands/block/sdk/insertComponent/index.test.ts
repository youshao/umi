import { join, basename } from 'path';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import insertComponent from './index';

const fixtures = join(__dirname, 'fixtures');

function testTransform(dir) {
  const filename = existsSync(join(fixtures, dir, 'origin.js'))
    ? join(fixtures, dir, 'origin.js')
    : join(fixtures, dir, 'origin.tsx');
  const origin = readFileSync(filename, 'utf-8');
  const configFile = join(fixtures, dir, 'config.json');
  const config = existsSync(configFile) ? require(join(configFile)) : {};
  const code = insertComponent(origin, {
    identifier: 'Foo',
    relativePath: './Foo',
    ...config,
  });
  const expectedFile = join(fixtures, dir, 'expected.js');
  if (existsSync(expectedFile)) {
    const expected = readFileSync(expectedFile, 'utf-8');
    expect(code.trim()).toEqual(expected.trim());
  } else {
    if (process.env.PRINT_CODE) {
      console.log(code);
    } else {
      writeFileSync(expectedFile, code, 'utf-8');
    }
  }
}

readdirSync(fixtures).forEach(dir => {
  if (dir.charAt(0) !== '.') {
    const fn = dir.endsWith('-only') ? test.only : test;
    fn(dir, () => {
      testTransform(dir);
    });
  }
});
