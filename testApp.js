import { createSignal, createEffect } from "./seed.js";

var [x, setX] = createSignal(0);
var [y, setY] = createSignal("frog");
var [showY, setShowY] = createSignal(false);

console.log(x());
console.log(y());

setX(1);
setY("dog");

console.log(x());
console.log(y());

function logger() {
  if (showY()) console.log(`x is ${x()} and y is ${y()}`);
  else console.log(`x is ${x()}`);
}

createEffect(logger);

console.log(x());
console.log(y());

setX(2);
setY("banana");
setShowY(true);
setShowY(false);
setY("orange");
