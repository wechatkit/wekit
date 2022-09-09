import { getCurrentPage } from "@wekit/shared"

export class Test {
  constructor(desc){
    this.its = [];
    this.desc = desc;
  }

  it(desc, timeout = 10000){
    let done = null;
    const itTask = {
      desc,
      status: 'norun', // pass ,nopass, norun
      error: null,
      finish: new Promise( resolve => {
        done = resolve;
      }),
    };
    this.its.push(itTask)
    const timeId = setTimeout(()=>{
      itTask.status = 'nopass';
      itTask.error = new Error('Timeout '+timeout);
      done();
    }, timeout);
    return (cb)=> {
      let res;
      try {
         res = cb && cb();
         itTask.status = 'pass';
      } catch (error) {
        itTask.status = 'nopass';
        itTask.error = error;
      }
      clearTimeout(timeId);
      done();
      return res;
    }
  }

  async run(){
    await Promise.all(this.its.map(item => item.finish));
    console.log(`%c [Testlib] BEGIN ${this.desc} `, 'color:black;background: white');
    let stats = {
      pass: 0,
      nopass: 0,
      norun: 0,
    }
    for (let i = 0; i < this.its.length; i++) {
      const it = this.its[i];
      console.log(`%c [Testlib] > [${i}] ${it.desc} => ${it.status}`, `color: ${{
        'pass': 'green',
        'nopass': 'red',
        'norun': 'yellow'
      }[it.status]};background: white`)
      stats[it.status] ++ ;
      if(it.status === 'nopass'){
        console.error(`[Testlib]`, it.error)
      }
    }
    console.log('%c [Testlib] > Pass: ' + stats.pass + ' NoPass:' + stats.nopass + ' NoRun:' + stats.norun, 'color:blue;background: white');
    console.log(`%c [Testlib] END ${this.desc} `, 'color:black;background: white');
  }
}

export function expect(value) {
  return {
    toBe(target){
      if(value !== target){
        throw new Error(`Expect: ${target} | Recive: ${value}`);
      }
    },
    toEqual(target){
      const s1 = JSON.stringify(value);
      const s2 = JSON.stringify(target);
      if(s1 !== s2){
        throw new Error(`Expect: ${target} | Recive: ${value}`);
      }
    }
  }
}