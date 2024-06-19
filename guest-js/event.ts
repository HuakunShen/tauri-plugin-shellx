/**
 * @since 2.0.0
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class EventEmitter<E extends Record<string, any>> {
  /** @ignore */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  private eventListeners: Record<keyof E, Array<(arg: any) => void>> =
    Object.create(null);

  /**
   * Alias for `emitter.on(eventName, listener)`.
   *
   * @since 2.0.0
   */
  addListener<N extends keyof E>(
    eventName: N,
    listener: (arg: E[typeof eventName]) => void
  ): this {
    return this.on(eventName, listener);
  }

  /**
   * Alias for `emitter.off(eventName, listener)`.
   *
   * @since 2.0.0
   */
  removeListener<N extends keyof E>(
    eventName: N,
    listener: (arg: E[typeof eventName]) => void
  ): this {
    return this.off(eventName, listener);
  }

  /**
   * Adds the `listener` function to the end of the listeners array for the
   * event named `eventName`. No checks are made to see if the `listener` has
   * already been added. Multiple calls passing the same combination of `eventName`and `listener` will result in the `listener` being added, and called, multiple
   * times.
   *
   * Returns a reference to the `EventEmitter`, so that calls can be chained.
   *
   * @since 2.0.0
   */
  on<N extends keyof E>(
    eventName: N,
    listener: (arg: E[typeof eventName]) => void
  ): this {
    if (eventName in this.eventListeners) {
      // eslint-disable-next-line security/detect-object-injection
      this.eventListeners[eventName].push(listener);
    } else {
      // eslint-disable-next-line security/detect-object-injection
      this.eventListeners[eventName] = [listener];
    }
    return this;
  }

  /**
   * Adds a **one-time**`listener` function for the event named `eventName`. The
   * next time `eventName` is triggered, this listener is removed and then invoked.
   *
   * Returns a reference to the `EventEmitter`, so that calls can be chained.
   *
   * @since 2.0.0
   */
  once<N extends keyof E>(
    eventName: N,
    listener: (arg: E[typeof eventName]) => void
  ): this {
    const wrapper = (arg: E[typeof eventName]): void => {
      this.removeListener(eventName, wrapper);
      listener(arg);
    };
    return this.addListener(eventName, wrapper);
  }

  /**
   * Removes the all specified listener from the listener array for the event eventName
   * Returns a reference to the `EventEmitter`, so that calls can be chained.
   *
   * @since 2.0.0
   */
  off<N extends keyof E>(
    eventName: N,
    listener: (arg: E[typeof eventName]) => void
  ): this {
    if (eventName in this.eventListeners) {
      // eslint-disable-next-line security/detect-object-injection
      this.eventListeners[eventName] = this.eventListeners[eventName].filter(
        (l) => l !== listener
      );
    }
    return this;
  }

  /**
   * Removes all listeners, or those of the specified eventName.
   *
   * Returns a reference to the `EventEmitter`, so that calls can be chained.
   *
   * @since 2.0.0
   */
  removeAllListeners<N extends keyof E>(event?: N): this {
    if (event) {
      // eslint-disable-next-line security/detect-object-injection
      delete this.eventListeners[event];
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.eventListeners = Object.create(null);
    }
    return this;
  }

  /**
   * @ignore
   * Synchronously calls each of the listeners registered for the event named`eventName`, in the order they were registered, passing the supplied arguments
   * to each.
   *
   * @returns `true` if the event had listeners, `false` otherwise.
   *
   * @since 2.0.0
   */
  emit<N extends keyof E>(eventName: N, arg: E[typeof eventName]): boolean {
    if (eventName in this.eventListeners) {
      // eslint-disable-next-line security/detect-object-injection
      const listeners = this.eventListeners[eventName];
      for (const listener of listeners) listener(arg);
      return true;
    }
    return false;
  }

  /**
   * Returns the number of listeners listening to the event named `eventName`.
   *
   * @since 2.0.0
   */
  listenerCount<N extends keyof E>(eventName: N): number {
    if (eventName in this.eventListeners)
      // eslint-disable-next-line security/detect-object-injection
      return this.eventListeners[eventName].length;
    return 0;
  }

  /**
   * Adds the `listener` function to the _beginning_ of the listeners array for the
   * event named `eventName`. No checks are made to see if the `listener` has
   * already been added. Multiple calls passing the same combination of `eventName`and `listener` will result in the `listener` being added, and called, multiple
   * times.
   *
   * Returns a reference to the `EventEmitter`, so that calls can be chained.
   *
   * @since 2.0.0
   */
  prependListener<N extends keyof E>(
    eventName: N,
    listener: (arg: E[typeof eventName]) => void
  ): this {
    if (eventName in this.eventListeners) {
      // eslint-disable-next-line security/detect-object-injection
      this.eventListeners[eventName].unshift(listener);
    } else {
      // eslint-disable-next-line security/detect-object-injection
      this.eventListeners[eventName] = [listener];
    }
    return this;
  }

  /**
   * Adds a **one-time**`listener` function for the event named `eventName` to the_beginning_ of the listeners array. The next time `eventName` is triggered, this
   * listener is removed, and then invoked.
   *
   * Returns a reference to the `EventEmitter`, so that calls can be chained.
   *
   * @since 2.0.0
   */
  prependOnceListener<N extends keyof E>(
    eventName: N,
    listener: (arg: E[typeof eventName]) => void
  ): this {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper = (arg: any): void => {
      this.removeListener(eventName, wrapper);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      listener(arg);
    };
    return this.prependListener(eventName, wrapper);
  }
}
