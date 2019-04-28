import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ScriptLoader from 'src';

describe('ScriptLoader', () => {
  const axiosMock = new MockAdapter(axios);

  describe('when loadScript is invoked', () => {
    const buildNameStub = 'IronMan';
    const jsStub = 'alert("Love you 3,000")';
    const urlStub = 'https://avengers.endgame.com/11';
    const callbackStub = jest.fn();

    global.window = {};
    global.document = {
      createElement: jest.fn(() => ({})),
      head: {
        appendChild: () => {
          window[buildNameStub] = jsStub;
        },
      },
    };

    afterAll(() => {
      global.window = undefined;
      global.document = undefined;
    });

    describe('the script exists in the global scope', () => {
      beforeEach(() => {
        window[buildNameStub] = jsStub;
      });

      afterEach(() => {
        callbackStub.mockClear();
      });

      it('should call the callback once', () => {
        ScriptLoader(buildNameStub, urlStub, callbackStub);
        expect(callbackStub).toHaveBeenCalledTimes(1);
      });

      it('should call the callback with the given from the window object', () => {
        ScriptLoader(buildNameStub, urlStub, ({ cancelSource, promise }) => {
          expect(cancelSource).toEqual(null);
          expect(promise).resolves.toEqual(jsStub);
        });
      });
    });

    describe('the script has successfully loaded', () => {
      beforeEach(() => {
        window[buildNameStub] = undefined;
        axiosMock.onGet(urlStub).reply(200, {
          data: jsStub,
        });
      });

      it('should return a cancel token', () => {
        ScriptLoader(buildNameStub, urlStub, ({ cancelSource }) => {
          expect(cancelSource).toEqual({
            cancel: expect.any(Function),
            token: expect.any(Object),
          });
        });
      });

      it('should return a promise which resolves with a script', () => {
        ScriptLoader(buildNameStub, urlStub, ({ promise }) => {
          expect(promise).resolves.toBe(jsStub);
        });
      });
    });

    describe('there was an error loading the script', () => {
      beforeEach(() => {
        window[buildNameStub] = undefined;
      });

      it('should return a promise that catches an error', () => {
        axiosMock.onGet(urlStub).reply(404);

        ScriptLoader(buildNameStub, urlStub, ({ promise }) => {
          expect(promise).resolves.toBe('Request failed with status code 404');
        });
      });

      it('should return a promise that catches an error when the request is cancelled', () => {
        const cancelMessageStub = 'I don\'t even know you!';

        axiosMock.onGet(urlStub).reply(200);
        ScriptLoader(buildNameStub, urlStub, ({ cancelSource, promise }) => {
          cancelSource.cancel(cancelMessageStub);
          expect(promise).resolves.toMatchObject({ message: cancelMessageStub });
        });
      });
    });
  });
});
