# @wekit/core

## 2.1.3

### Patch Changes

- - fix(core): 更完善的兼容就的生命周

## 2.1.2

### Patch Changes

- - fix(core): 兼容旧版生命周期

## 2.1.1

### Patch Changes

- fix(core): 修正代码里的版本号

## 2.1.0

### Minor Changes

- - feat(shared): 支持拦截方法内中断调用
  - feat(core): 简化优化核心库实现

### Patch Changes

- Updated dependencies
  - @wekit/shared@2.0.0

## 2.0.1

### Patch Changes

- fix: setData 的刷新细节

## 2.0.0

### Major Changes

- fix: 极大的简化了 onPreload 的实现（onPreload 与 v1 不兼容）
  fix: data 不能是函数方式了
  perf: 更早的 onPreload 调用时机
  feat: 更完善的插件机制

## 2.0.0

### Major Changes

- refactor: 简化框架的 onPreload 逻辑，onPreload 取消 this 访问

## 1.3.1

### Patch Changes

- fix: 修复可能发生的错误
- Updated dependencies
  - @wekit/shared@1.1.5

## 1.3.0

### Minor Changes

- feat: wait 返回页面实例

## 1.2.20

### Patch Changes

- feat: 为 flushViewed 事件增加时间计算

## 1.2.19

### Patch Changes

- feat: 新增事件钩子
- Updated dependencies
  - @wekit/shared@1.1.4

## 1.2.18

### Patch Changes

- fix(core): 在极端情况下 switchTab 页的 onPreload 不触发的问题

## 1.2.17

### Patch Changes

- 0101394: fix(core): 修复在 iphone8 第一次打开页面的时候加载两次 onPPreloa 的问题

## 1.2.16

### Patch Changes

- fix: 修复小程序的 swithTab 页的问题

## 1.2.15

### Patch Changes

- fix: 修复 data 问题

## 1.2.14

### Patch Changes

- 1a7a33e: fix: 修复 data 问题

## 1.2.13

### Patch Changes

- fix: 修复 wait 问题

## 1.2.12

### Patch Changes

- fix: 修复某些情况下 data 指向问题

## 1.2.11

### Patch Changes

- 优化初次 setData 行为

## 1.2.10

### Patch Changes

- 修复 BUG

## 1.2.9

### Patch Changes

- 优化 setData 函数
- Updated dependencies
  - @wekit/shared@1.1.3

## 1.2.8

### Patch Changes

- 优化低版本问题

## 1.2.7

### Patch Changes

- 修复错误
- Updated dependencies
  - @wekit/shared@1.1.2

## 1.2.6

### Patch Changes

- 修复小 BUG

## 1.2.5

### Patch Changes

- 修复 onPreload 的问题

## 1.2.4

### Patch Changes

- 优化在低版本上的性能问题

## 1.2.3

### Patch Changes

- 优化细节

## 1.2.2

### Patch Changes

- 修复低版本兼容性问题

## 1.2.1

### Patch Changes

- 修复 setData 的问题

## 1.2.0

### Minor Changes

- 添加新的 wkAPI wait

## 1.1.2

### Patch Changes

- 修复 onPreload 调用问题

## 1.1.1

### Patch Changes

- 修复 setData 事件问题
- Updated dependencies
  - @wekit/shared@1.1.1

## 1.1.0

### Minor Changes

- 优化插件类型提示和参数

### Patch Changes

- Updated dependencies
  - @wekit/shared@1.1.0

## 1.0.4

### Patch Changes

- - 解决低版本问题
  - 修改 meta.options 为 meta.instance
- Updated dependencies
  - @wekit/shared@1.0.4

## 1.0.2

### Patch Changes

- 更新包
- Updated dependencies
  - @wekit/shared@1.0.2

## 1.0.1

### Patch Changes

- 修复在 onUnload 事件内无法访问 data 的问题
- Updated dependencies
  - @wekit/shared@1.0.1

## 1.0.0

### Major Changes

- 8624164: 第一个版本发布

### Patch Changes

- Updated dependencies [8624164]
  - @wekit/shared@1.0.0
