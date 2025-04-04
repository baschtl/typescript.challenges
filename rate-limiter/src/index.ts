import { sleep } from "../../common";

const throttleRequests = <T>(fn: () => Promise<T>, maxPerSecond: number): () => Promise<T> => {
    const queue: { resolve: (value: T) => void, reject: (reason?: any) => void}[] = [];
    let running = 0;

    setInterval(async () => {
        if (running >= maxPerSecond || queue.length === 0) return;
        
        running++;
        const { resolve, reject } = queue.shift()!;

        fn()
            .then(resolve)
            .catch(reject)
            .finally(() => running--)
    }, 1000 / maxPerSecond);

    return () => {
        return new Promise((resolve, reject) => {
            queue.push({resolve, reject});
        });
    }
}

const apiCall = async () => {
    console.log(`API call at ${new Date().toISOString()}`);
    await sleep(200);
    
    return "OK";
};

const throttledApiCall = throttleRequests(apiCall, 2);

for (let i = 0; i < 10; i++) {
    throttledApiCall();
}
