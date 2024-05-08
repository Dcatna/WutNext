"use strict";
/*
 * Copyright 2012-2014 Brandon Beck
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBuckets = void 0;
const Ticker_1 = require("./Ticker");
const TokenBucketImpl_1 = require("./TokenBucketImpl");
const FixedIntervalRefillStrategy_1 = require("./FixedIntervalRefillStrategy");
const YIELDING_SLEEP_STRATEGY = {
    sleep() {
        return new Promise(resolve => setTimeout(resolve, 1));
    }
};
const BUSY_WAIT_SLEEP_STRATEGY = {
    sleep() {
        // Do nothing, don't sleep.
        return Promise.resolve();
    }
};
class TokenBucketBuilder {
    constructor() {
        this.capacity = undefined;
        this.initialTokens = 0;
        this.refillStrategy = undefined;
        this.sleepStrategy = YIELDING_SLEEP_STRATEGY;
        this.ticker = Ticker_1.SYSTEM_TICKER;
    }
    /** Specify the overall capacity of the token bucket.  */
    withCapacity(numTokens) {
        console.assert(numTokens > 0, "Must specify a positive number of tokens");
        this.capacity = numTokens;
        return this;
    }
    /** Initialize the token bucket with a specific number of tokens.  */
    withInitialTokens(numTokens) {
        console.assert(numTokens > 0, "Must specify a positive number of tokens");
        this.initialTokens = numTokens;
        return this;
    }
    /** Refill tokens at a fixed interval.  */
    withFixedIntervalRefillStrategy(refillTokens, periodMillis) {
        return this.withRefillStrategy(new FixedIntervalRefillStrategy_1.FixedIntervalRefillStrategy(this.ticker, refillTokens, periodMillis));
    }
    /** Use a user defined refill strategy.  */
    withRefillStrategy(refillStrategy) {
        this.refillStrategy = refillStrategy;
        return this;
    }
    /** Use a sleep strategy that will always attempt to yield the CPU to other processes.  */
    withYieldingSleepStrategy() {
        return this.withSleepStrategy(YIELDING_SLEEP_STRATEGY);
    }
    /**
     * Use a sleep strategy that will not yield the CPU to other processes.  It will busy wait until more tokens become
     * available.
     */
    withBusyWaitSleepStrategy() {
        return this.withSleepStrategy(BUSY_WAIT_SLEEP_STRATEGY);
    }
    /** Use a user defined sleep strategy.  */
    withSleepStrategy(sleepStrategy) {
        this.sleepStrategy = sleepStrategy;
        return this;
    }
    /** Build the token bucket.  */
    build() {
        console.assert(this.capacity !== undefined, "Must specify a capacity");
        console.assert(this.refillStrategy !== undefined, "Must specify a refill strategy");
        return new TokenBucketImpl_1.TokenBucketImpl(this.capacity, this.initialTokens, this.refillStrategy, this.sleepStrategy);
    }
}
/** Static utility methods pertaining to creating [TokenBucketImpl] instances.  */
exports.TokenBuckets = {
    /** Create a new builder for token buckets.  */
    builder() {
        return new TokenBucketBuilder();
    }
};
