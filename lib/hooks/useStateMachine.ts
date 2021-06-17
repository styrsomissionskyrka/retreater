import { useState, useCallback, useReducer, useRef } from 'react';

export type MachineEvent = {
  type: string;
  [key: string]: unknown;
};

export type StateChart<State extends string, Event extends MachineEvent | string> = {
  initial: State;
  states: Record<State, { on: Partial<Record<Event extends MachineEvent ? Event['type'] : Event, State>> }>;
};

export type Transition<Event extends MachineEvent | string> = (event: Event, onSuccess?: () => void) => boolean;

export type StateMachineOptions<State extends string, Event extends MachineEvent | string> = {
  onTransition?: (event: Event) => void;
  initialState?: State;
};

/**
 * Run a simple finite state machine. Transition state by executing events and
 * if the event isn't supported by the current state no state transition will
 * happen.
 *
 * This is a simple version of something more powerful like [xstate](https://xstate.js.org/).
 */
export function useStateMachine<State extends string, Event extends MachineEvent | string>(
  stateChart: StateChart<State, Event>,
  { onTransition, initialState = stateChart.initial }: StateMachineOptions<State, Event> = {},
) {
  const [, forceUpdate] = useState({});
  const stateRef = useRef(initialState);

  const transition: Transition<Event> = useCallback(
    (event, onSuccess) => {
      let type = 'type' in event ? event.type : event;

      let currentState = stateChart.states[stateRef.current];
      // @ts-ignore
      let nextState = (currentState && currentState.on[type]) as State | undefined;

      if (nextState != null) {
        stateRef.current = nextState;
        forceUpdate({});
        if (onTransition) onTransition(event);
        if (onSuccess) onSuccess();
      }

      return nextState != null;
    },
    [onTransition, stateChart.states],
  );

  return [stateRef.current, transition] as const;
}

/**
 * This is an extension of useStateMachine to enable keeping context or extra
 * data together with a finite state machine. The reducer will only fire if
 * the given event is supposed to be handled by the current state.
 * The reducer will then receive the given event, and its payload if provided.
 */
export function useReducerMachine<
  State extends string,
  Event extends MachineEvent,
  Data extends Record<string, unknown>,
>(stateChart: StateChart<State, Event>, reducer: React.Reducer<Data, Event>, initialData: Data) {
  const [data, dispatch] = useReducer(reducer, initialData);
  const [state, transition] = useStateMachine(stateChart, { onTransition: dispatch });

  return [state, data, transition] as const;
}
