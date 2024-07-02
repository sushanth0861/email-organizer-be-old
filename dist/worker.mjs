"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const axios_1 = __importDefault(require("axios"));
// Configuration for the axios request
const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.upstox.com/v2/portfolio/short-term-positions',
    headers: {
        'Accept': 'application/json',
        'Api-Version': '2.0',
        'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiJLTDI3NzAiLCJqdGkiOiI2Njc0MWRmNTNjYmJmMDUyODc2ZWJlMGUiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaWF0IjoxNzE4ODg1ODc3LCJpc3MiOiJ1ZGFwaS1nYXRld2F5LXNlcnZpY2UiLCJleHAiOjE3MTg5MjA4MDB9.K3KPtIkH2HzoISHccoAdZKiOsnyxycxknZXhESAtWO0`,
    }
};
function fetchData() {
    (0, axios_1.default)(config)
        .then((response) => {
        console.log("short term positions: ", JSON.stringify(response.data));
    })
        .catch((error) => {
        console.log(error);
    });
}
// Run fetchData every second
setInterval(fetchData, 1000);
// Optional: Listen for a 'stop' message to terminate the worker
worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.on('message', (message) => {
    if (message === 'stop') {
        process.exit(0);
    }
});
//# sourceMappingURL=worker.mjs.map