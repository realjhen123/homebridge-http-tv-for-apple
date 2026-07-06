"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.powerOn = powerOn;
exports.powerOff = powerOff;
exports.arrowUp = arrowUp;
exports.arrowDown = arrowDown;
exports.arrowLeft = arrowLeft;
exports.arrowRight = arrowRight;
exports.confirm = confirm;
exports.goBack = goBack;
exports.information = information;
exports.nextTrack = nextTrack;
exports.volumeUp = volumeUp;
exports.volumeDown = volumeDown;
const node_http_1 = __importDefault(require("node:http"));
const BASE_URL = 'http://north.autohome.api.home/tv';
/**
 * Send a GET request to the TV API.
 * All TV API endpoints use GET method with the endpoint path.
 */
function tvRequest(endpoint) {
    return new Promise((resolve, reject) => {
        const url = `${BASE_URL}${endpoint}`;
        node_http_1.default.get(url, (res) => {
            // Consume response data to free up memory
            res.resume();
            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    resolve();
                }
                else {
                    reject(new Error(`TV API returned status ${res.statusCode} for ${endpoint}`));
                }
            });
        }).on('error', (err) => {
            reject(new Error(`TV API request failed for ${endpoint}: ${err.message}`));
        });
    });
}
/** Power on */
async function powerOn() {
    return tvRequest('/on');
}
/** Power off */
async function powerOff() {
    return tvRequest('/off');
}
/** Arrow up */
async function arrowUp() {
    return tvRequest('/up');
}
/** Arrow down */
async function arrowDown() {
    return tvRequest('/down');
}
/** Arrow left */
async function arrowLeft() {
    return tvRequest('/left');
}
/** Arrow right */
async function arrowRight() {
    return tvRequest('/right');
}
/** Confirm / OK */
async function confirm() {
    return tvRequest('/sure');
}
/** Go back */
async function goBack() {
    return tvRequest('/back');
}
/** Information key → settings */
async function information() {
    return tvRequest('/setting');
}
/** Play/pause → switch */
async function nextTrack() {
    return tvRequest('/switch');
}
/** Volume up */
async function volumeUp() {
    return tvRequest('/v_up');
}
/** Volume down */
async function volumeDown() {
    return tvRequest('/v_down');
}
