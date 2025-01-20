class Node{
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class Queue {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    push(data) {
        let newNode = new Node(data);

        if (this.head == null) {
          this.head = newNode;
          this.tail = newNode;
          return;
        }
      
        this.tail.next = newNode;
        this.tail = newNode; 
    }

    pop() {
        if (this.head == null) {
            return -1;
          }
        
          let oldHead = this.head;
          this.head = oldHead.next;
        
          if (this.head == null) {
            this.tail = null;
          }
        
          return oldHead.data;
    }
}

module.exports = Queue;