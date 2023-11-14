"use strict";
var createEffectCall = false;
var signals = [];
var effects = [];

export function createSignal(initialValue) {
  const handler = {
    // get(target, property) {
    //   return target.property;
    // },
    set(target, property, value) {
      if (property == "value" && value != target.value) {
        console.log("In set of handler");
        /* *** for each effect that depends on this signal call that effect. *** */
        effects.forEach((effectWrapper) =>
          effectWrapper.signals.forEach((target) =>
            effectWrapper.signals.includes(target)
              ? effectWrapper.effect()
              : "nothing happens"
          )
        );
      }
      target[property] = value;
      return true;
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
