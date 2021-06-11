type Logger = (...messages: any) => void;

let info: Logger;
let error: Logger;
let warn: Logger;

if (process.env.NODE_ENV === 'production') {
  let noop = () => {};
  info = noop;
  error = noop;
  warn = noop;
} else {
  info = (...messages) => console.log(...messages);
  error = (...messages) => console.error(...messages);
  warn = (...messages) => console.warn(...messages);
}

export { info, error, warn };
