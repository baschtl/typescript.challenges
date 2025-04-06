type EventMap = {
    [event: string]: any;
};

class EventEmitter<Events extends EventMap> {
    private listeners: {
        [K in keyof Events]?: Array<
            Events[K] extends void ? () => void : (payload: Events[K]) => void
        >
    } = {};

    on<K extends keyof Events>(
        eventName: K,
        listener: Events[K] extends void ? () => void : (payload: Events[K]) => void,
    ) {
        const existing = this.listeners[eventName] || [];
        this.listeners[eventName] = [...existing, listener];
    }

    emit<K extends keyof Events>(
        eventName: K,
        ...args: Events[K] extends void ? [] : [Events[K]]
    ) {
        if (!this.listeners[eventName]) return;

        for (const l of this.listeners[eventName]) {
            (l as any)(...args);
        }
    }
}

type Events = {
    login: { userId: string };
    logout: void;
};
  
const emitter = new EventEmitter<Events>();

emitter.on("login", (data) => {
    console.log(`User ${data.userId} logged in.`);
});

emitter.on("login", (data) => {
    console.log(`User Foo logged in.`);
});

emitter.on("logout", () => {
    console.log("User logged out");
});

emitter.emit("login", { userId: "abc123" });
emitter.emit("logout");
  