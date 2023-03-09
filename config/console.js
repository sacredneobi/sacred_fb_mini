console.logUser = function (name, senderId, ...args) {
  console.log(`\x1b[33m[${name}][${senderId}]\x1b[0m:`, ...args);
};

console.logUserSuccess = function (name, ...args) {
  console.log(`\x1b[32m[SUCCESS][${name}]\x1b[0m:`, ...args);
};

console.logUserErr = function (name, ...args) {
  console.log(`\x1b[31m[ERROR][${name}]\x1b[0m:`, ...args);
};

console.logUserDone = function (name, ...args) {
  console.log(`\x1b[34m[DONE][${name}]\x1b[0m:`, ...args);
};
