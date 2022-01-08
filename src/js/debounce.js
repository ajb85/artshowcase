export default function debounce(cb, config) {
  let timeout = null;

  function debounced(...args) {
    timeout && clearTimeout(timeout);

    if (config.leading && !timeout) {
      cb?.apply(this, args);
    }

    if (!config.throttle || !timeout) {
      timeout = setTimeout(() => {
        if (config.trailing || !config.leading) {
          cb?.apply(this, args);
        }
        timeout = null;
      }, config.wait);
    }
  }

  debounced.swapCallback = (newCB) => {
    cb = newCB;
    return debounced;
  };

  return debounced;
}
