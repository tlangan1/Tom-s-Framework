"use strict";
var createEffectCall = false;
var signals = [];
var effects = [];

export function createSignal(initialValue) {
  const handler = {
    set(target, property, value) {
      if (property == "value" && value != target.value) {
        console.log("In set of handler");
        if (effects[0]) effects[0].effect();
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
      signals.push(signal);
    }
    return signal.value;
  }
  return [getValue, signalSetter];
}

export function createEffect(func) {
  createEffectCall = true;
  func();
  effects.push({
    effect: func,
    signals: signals,
  });
  signals = [];
  createEffectCall = false;
}
