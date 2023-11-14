"use strict";
var runEffectInProcess = false;
var signals = {};
var effects = {};
var effectSignals = {};

export function createSignal(initialValue) {
  const handler = {
    set(target, property, value) {
      if (property == "value" && value != target.value) {
        /* *** for each effect that depends on this signal call that effect. *** */
        target[property] = value;
        Object.keys(effects).forEach((effectKey) => {
          Object.hasOwn(effects[effectKey].relevantSignals, uniqueID)
            ? runEffect(effectKey)
            : "nothing happens";
        });
      }
      return true;
    },
  };

  var uniqueID = Object.keys(signals).length;
  var signalProxy = new Proxy(
    { uniqueID: uniqueID, value: initialValue },
    handler
  );
  signals[uniqueID] = signalProxy;

  function signalSetter(newValue) {
    signals[uniqueID].value = newValue;
  }

  function getValue() {
    if (runEffectInProcess) {
      effectSignals[uniqueID] = signals[uniqueID];
    }
    return signals[uniqueID].value;
  }
  return [getValue, signalSetter];
}

// TODO: make sure when an effect runs the signal dependencies are re-populated.
// This is because there may be conditionals in the effect that would cause a
// different set of signals to be relevant.
export function createEffect(func) {
  var uniqueID = Object.keys(effects).length;
  effects[uniqueID] = { effect: func, relevantSignals: [] };
  runEffect(uniqueID);
}

/* *** Helper functions *** */
function runEffect(uniqueID) {
  runEffectInProcess = true;
  effects[uniqueID].effect();
  effects[uniqueID].relevantSignals = effectSignals;
  effectSignals = [];
  runEffectInProcess = false;
}
