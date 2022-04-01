function add(a, b) {
    if (a > 10) {
        throw new Error('参数a 不能大于10');
    }
    return a + b;
}
function sub(a, b) {
    return a - b;
}
function sdyHi(name) {
    return "".concat(name, " hi");
}

export { add, sdyHi, sub };
//# sourceMappingURL=util.js.map
