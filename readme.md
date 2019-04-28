# Async Script Loader

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> This tiny util allows you to dynamically load a script into the global scope.

### Usage
Call `loadScript` with the three required parameters:
  * `namespace` e.g. if the script is accessible via `window.coolUtil` the namespace is `coolUtil`
  * `url`
  * `callback` function - this recieves the promise which will either resolve or reject and a `cancelSource` token if you need to abort the request.
  * `window` object

#### Example
```
// import the util
import loadScript from 'async-script-loader;

// define your callback function
const callbackFn = (response) => {
  // if successful the script will be available in the global scope under the namespace you provided

  // if unsuccessful the error message is returned
}

// do the thing
loadScript('coolUtil', 'https://coolutil.com', window, callbackFn);

```

* Backed by tests in [Jest](https://jestjs.io/)
* Typed with [FlowType](https://flow.org)
* Linted with [ESLint](https://eslint.org)
* PR's welcome
* API improvements welcome
