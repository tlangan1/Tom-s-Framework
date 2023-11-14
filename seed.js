"use strict";
var createEffectInProcess = false;
var signals = [];
var effects = [];

export function createSignal(initialValue) {
  const handler = {
    set(target, property, value) {
      if (property == "value" && value != target.value) {
        /* *** for each effect that depends on this signal call that effect. *** */
        target[property] = value;
        effects.forEach((effectWrapper) => {
          var effectRan = false;
          effectWrapper.relevantSignals.filter((target) =>
            effectWrapper.relevantSignals.includes(target) && !effectRan
              ? (effectWrapper.effect(), (effectRan = true))
              : "nothing happens"
          );
        });
      }
      return true;
    },
  };
  var signal = new Proxy({ value: initialValue }, handler);

  function signalSetter(newValue) {
    signal.value = newValue;
  }

  function getValue() {
    if (createEffectInProcess) {
      signals.push(signal);
    }
    return signal.value;
  }
  return [getValue, signalSetter];
}

export function createEffect(func) {
  createEffectInProcess = true;
  func();
  effects.push({
    effect: func,
    relevantSignals: signals,
  });
  signals = [];
  createEffectInProcess = false;
}
