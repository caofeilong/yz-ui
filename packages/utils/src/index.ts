function add(a:number, b:number):number {
  if (a > 10) {
    throw new Error('参数a 不能大于10');
  }
  return a + b;
}

export {
  add,
};
