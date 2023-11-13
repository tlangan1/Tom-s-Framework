"use strict";
var createEffectCall = false;
var effectDependencies = [];
var signalDependencies = [];

export function createSignal(initialValue) {
  const handler = {
    set(target, property, value) {
      if (property == "value" && value != target.value) {
        console.log("In set of handler");
        if (signalDependencies[0]) signalDependencies[0]();
        return true;
      }
    },
  };
  var signal = new Proxy({ value: initialValue }, handler);

  function signalSetter(newValue) {
    signal.value = newValue;
  }

  function getValue() {
    if (createEffectCall) {
      effectDependencies.push(signal);
    }
    return signal.value;
  }
  return [getValue, signalSetter];
}

export function createEffect(func) {
  createEffectCall = true;
  func();
  signalDependencies.push(func);
  createEffectCall = false;
}
