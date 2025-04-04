import { sleep } from "../../common";

const runInBatches = async <T>(tasks: (() => Promise<T>)[], batchSize: number): Promise<T[]> => {
    const results: T[] = [];
    const workers: Promise<void>[] = [];
    const taskQueue = tasks.map((task, index) => ({ task, index }));

    const worker = async () => {
        while (taskQueue.length > 0) {
            const t = taskQueue.shift();
            if (!t) return;

            results[t.index] = await t.task();
            console.log(`Task ${t.index} finished.`);
        }
    }

    for (let i = 0; i < Math.min(batchSize, tasks.length); i++) {
        workers.push(worker());
    }

    await Promise.all(workers);
    
    return results;
}

const tasks = [
  () => sleep(1000).then(() => "Task 1"),
  () => sleep(500).then(() => "Task 2"),
  () => sleep(2000).then(() => "Task 3"),
  () => sleep(800).then(() => "Task 4"),
];

runInBatches(tasks, 3).then(console.log);
// Prints: ["Task 1", "Task 2", "Task 3", "Task 4"]
