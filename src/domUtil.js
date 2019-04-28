// @flow

const attachScript = (data: string, documentObject: Document) => {
  const script = documentObject.createElement('script');

  script.text = data;
  if (documentObject.head) {
    const tempNode: HTMLScriptElement = documentObject.head.appendChild(script);

    tempNode && tempNode.parentNode && tempNode.parentNode.removeChild(script);
  }
};

export default {
  attachScript,
};
