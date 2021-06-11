type EventHandler<Event extends React.SyntheticEvent<unknown>> = (event: Event) => void;

export function composeEventHandlers<Event extends React.SyntheticEvent<unknown>>(
  ...handlers: EventHandler<Event>[]
): EventHandler<Event> {
  return (event) => {
    for (let handler of handlers) {
      handler(event);
      if (event.defaultPrevented) break;
    }
  };
}
