import { expect } from "../../testlib";

export function testLifeEvent(test) {
  let t = 0;

  let testReq = [];
  const expectOnPreload = test.it('测试 onPreload 是否执行')
  const expectBeforeOnload = test.it('测试 onPreload 在 onLoad 之前执行')

  return {
    onPreload(){
      testReq = [];
      t = Date.now();
      console.log('onPreload', Date.now());
      testReq.push('preload')
      expectOnPreload();
    },
    onLoad(){
      console.log('onLoad', Date.now(), Date.now() - t);
      test.run();
      testReq.push('load')
      expectBeforeOnload(()=>{
        expect(testReq).toEqual(['preload', 'load']);
      })
    }
  }
}