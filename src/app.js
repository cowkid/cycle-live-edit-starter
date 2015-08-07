/** @jsx hJSX */
import Cycle from '@cycle/core';
import { hJSX, makeDOMDriver } from '@cycle/dom';
import { hello } from './foo';

function main(responses) {
  let interval$ = Cycle.Rx.Observable.interval(1000).startWith(-1);
  // combine interval$ with responses.reload$, but only pass interval data to state$
  // now we will re-render every 1 seconds and on file changes
  let state$ = Cycle.Rx.Observable.combineLatest(interval$, responses.reload$, interval => interval);

  return {
    DOM: state$.map(interval =>
      <div>
        <h1>{interval + 1} seconds elapsed.</h1>
        <p>From main module: Edit me!</p>
        <p>{hello()}</p>
      </div>
    )
  };
}

let drivers = {
  DOM: makeDOMDriver('#app'),
  reload$: () => Cycle.Rx.Observable.fromEvent(window, 'fb-flo-reload').startWith(null)
};

Cycle.run(main, drivers);
