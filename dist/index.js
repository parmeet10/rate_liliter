"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _RateLimiter_instances, _RateLimiter_clearStoreExpiredDump;
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const store = new Map();
class RateLimiter {
    // expiresIn SHOULD BE IN SECONDS
    constructor(expiresIn, count) {
        _RateLimiter_instances.add(this);
        if (expiresIn < 1 || count < 1) {
            throw new Error("Duration and count must have positive values");
        }
        this.expiresIn = expiresIn;
        this.count = count;
        __classPrivateFieldGet(this, _RateLimiter_instances, "m", _RateLimiter_clearStoreExpiredDump).call(this);
    }
    checkLimit(key) {
        if (store.has(key)) {
            const keyInfo = store.get(key);
            const now = (0, moment_1.default)().unix();
            if (keyInfo.expiresOn <= now) {
                store.set(key, {
                    count: 1,
                    expiresOn: now + this.expiresIn // Set new expiry time in seconds
                });
                return true;
            }
            else if (keyInfo.count >= this.count && keyInfo.expiresOn > now) {
                return false;
            }
            else if (keyInfo.count < this.count && keyInfo.expiresOn > now) {
                store.set(key, {
                    count: keyInfo.count + 1,
                    expiresOn: keyInfo.expiresOn // Keep the same expiry time
                });
                return true;
            }
        }
        else {
            store.set(key, {
                count: 1,
                expiresOn: (0, moment_1.default)().unix() + this.expiresIn // Set expiry time in seconds
            });
            return true;
        }
        return true;
    }
}
_RateLimiter_instances = new WeakSet(), _RateLimiter_clearStoreExpiredDump = function _RateLimiter_clearStoreExpiredDump() {
    setInterval(() => {
        const now = (0, moment_1.default)().unix();
        store.forEach((data, key) => {
            if (data.expiresOn < now - this.expiresIn * 3) { // Adjusted for seconds
                store.delete(key);
            }
        });
    }, 21600000); // 6 hours in milliseconds
};
exports.default = RateLimiter;
