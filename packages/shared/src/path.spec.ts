import { calcRelativePath } from "./path";

describe('path.ts', () => {
  it('calcRelativePath', () => {
    expect(calcRelativePath('/pages/index/index', '/pages/index/index')).toBe('/pages/index/index');
    expect(calcRelativePath('/pages/index/index', '/pages/index/index.js')).toBe('/pages/index/index.js');
    expect(calcRelativePath('/pages/index/index', '/pages/index/index.json')).toBe('/pages/index/index.json');
    expect(calcRelativePath('/pages/index/index', '/pages/index/index.wxml')).toBe('/pages/index/index.wxml');
    expect(calcRelativePath('/pages/index/index', '/pages/index/index.wxss')).toBe('/pages/index/index.wxss');
    expect(calcRelativePath('/pages/index/index', '/pages/index/index.wxs')).toBe('/pages/index/index.wxs');
    expect(calcRelativePath('/pages/teacher/teacher', '../index/index.wxs')).toBe('/pages/index/index.wxs');
    expect(calcRelativePath('', '../index/index.wxs')).toBe('index/index.wxs');
    expect(calcRelativePath('', 'index/index.wxs')).toBe('/index/index.wxs');
    expect(calcRelativePath('', '/index/index.wxs')).toBe('/index/index.wxs');
    expect(calcRelativePath('/pages/teacher/index', '')).toBe('/pages/teacher/');
  });
});