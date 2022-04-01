function add(a:number, b:number):number {
  if (a > 10) {
    throw new Error('参数a 不能大于10');
  }
  return a + b;
}

function sub(a:number, b:number):number {
  return a - b;
}

function sdyHi(name:string):string {
  return `${name} hi`;
}

export {
  add,
  sub,
  sdyHi,
};
