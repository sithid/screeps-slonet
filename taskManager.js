const Queue = require('./queue');
var config = require('config');

class Task {
    constructor(data) {
        this.data = data;
    }
}

class TaskManager {
    constructor() {
        this.Tasks = new Queue();
    }
}

module.exports = { Task, TaskManager };