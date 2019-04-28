// @flow

import axios from 'axios';
import DomUtils from './domUtil';
import type { $AxiosXHR } from 'axios';

type Callback = ({ promise: $AxiosXHR<mixed> | Promise<Object>, cancelSource: Object }) => null
type Axios = { CancelToken: { source: () => mixed } };
type Window = { [string]: mixed }

const loadScript = (namespace: string, url: string, callback: Callback, windowObj: Window = window) => {
  const target: mixed | null = windowObj[namespace];

  if (target) {
    return callback({
      cancelSource: null,
      promise: Promise.resolve(target),
    });
  }

  const { CancelToken }: Axios = axios;
  const source: { token: string } = CancelToken.source();
  const configurationObject = {
    cancelToken: source.token,
    method: 'GET',
    url,
  };
  const handleLoadScriptSuccess = ({ data }: { data: string }) => {
    DomUtils.attachScript(data, document);
    return windowObj[namespace];
  };
  const handleLoadScriptsError = (error: { message: string }) => {
    if (axios.isCancel(error)) {
      return error;
    }

    return error.message;
  };

  return callback({
    cancelSource: source,
    promise: axios(configurationObject)
      .then(handleLoadScriptSuccess)
      .catch(handleLoadScriptsError),
  });
};

export default loadScript;
