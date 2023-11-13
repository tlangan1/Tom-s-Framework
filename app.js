import { createSignal, createEffect } from "./seed.js";

var [x, setX] = createSignal(0);
var [y, setY] = createSignal("frog");

console.log(x());
console.log(y());

setX(1);
setY("dog");

console.log(x());
console.log(y());

function logger() {
  console.log(`x is ${x()} and y is ${y()}`);
}

createEffect(logger);

console.log(x());
console.log(y());

setX(2);
