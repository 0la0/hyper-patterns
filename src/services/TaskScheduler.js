let functions = [];
let nextPaint;

// TODO: move into util
export function batchRender(fn) {
  functions.push(fn);
  if (nextPaint) {
    return;
  }
  nextPaint = requestAnimationFrame(() => {
    functions.forEach(fn => fn());
    functions = [];
    nextPaint = undefined;
  });
}
