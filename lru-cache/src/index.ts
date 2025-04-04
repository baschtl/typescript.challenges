interface LRUNode {
  key: number | null;
  value: number | null;
  prev: LRUNode | null;
  next: LRUNode | null;
}

class LRUCache {
  private size: number;
  private head: LRUNode;
  private tail: LRUNode;
  
  private lookupMap: Record<number, LRUNode>

  constructor(
    private capacity: number) {
    this.capacity = capacity;
    this.size = 0;

    this.head = { key: null, value: null, prev: null, next: null};
    this.tail = { key: null, value: null, prev: null, next: null};

    this.head.next = this.tail;
    this.tail.prev = this.head;

    this.lookupMap = {};
  }

  print() {
    let result = "";
    
    let current: LRUNode | null = this.head;
    while (current) {
      result += `${current.key}: ${current.value}`;

      if (current !== this.tail) {
        result += " -> ";
      }

      current = current.next;
    }

    console.log(result);
  }

  get(key: number): number {
    if (this.lookupMap[key]) {
      const node = this.lookupMap[key];
      this.moveToFront(node);

      return node.value || -1;
    }

    return -1;
  }

  put(key: number, value: number) {
    // Does the key exist?
    // Yes: Update value, move to the front and return
    if (this.lookupMap[key]) {
      const node = this.lookupMap[key];
      node.value = value;
      
      this.moveToFront(node);
      return;
    }

    // Key does not exist: new node
    // Check if capacity is reached, yes: pop tail
    if (this.size === this.capacity) {
      this.popTail();
    }

    // Create new node, and move to the front
    const newNode = {key, value, prev: null, next: null};
    this.moveToFront(newNode);
    this.lookupMap[key] = newNode;
    this.size++;
  }

  private moveToFront(node: LRUNode) {
    this.removeNode(node);

    node.prev = this.head;
    node.next = this.head.next;
    if (this.head.next) {
      this.head.next.prev = node;
      this.head.next = node;
    }
  }

  private popTail() {
    const toPop = this.tail.prev;

    this.removeNode(toPop);
    if (toPop?.key) delete this.lookupMap[toPop.key]
    this.size--;
  }

  private removeNode(node: LRUNode | null) {
    if (!node || node.next == null || node.prev == null) {
      return;
    }

    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
}

const lruCache = new LRUCache(5);
// Test insertion of nodes up to the capacity
lruCache.put(1, 1);
lruCache.print();
lruCache.put(1, 2);
lruCache.print();
lruCache.put(1, 3);
lruCache.print();
lruCache.put(2, 2);
lruCache.print();
lruCache.put(1, 1);
lruCache.print();
lruCache.put(2, 2);
lruCache.print();
lruCache.put(3, 3);
lruCache.print();
lruCache.put(4, 4);
lruCache.print();
lruCache.put(5, 5);
lruCache.print();
lruCache.put(6, 6);
lruCache.print();

// Test getting node values and moving node to the front
console.log(lruCache.get(5));
lruCache.print();
console.log(lruCache.get(2));
lruCache.print();