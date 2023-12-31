/**
 * Executes multiple asynchronous tasks while ensuring that no more than a limited amount of asynchronous tasks
 * are running at the same time (which is useful to avoid things like running out of file handles).
 */

/**
 * Returns a new throttled worker.
 * @param {number} [limit]   Optional maximum number of asynchronous tasks that can be running.
 * @constructor
 */
function ThrottledWorker (limit) {
  this.doWork = function (callbacks, last, newLimit) {
    doWork(callbacks, last, newLimit || this.limit)
  }
  this.limit = limit || 10
}

/**
 * Creates, and returns a function to invoke to do some future work.
 * @param callback      Required callback to execute.
 * @param results       Required array to store results of callback execution.
 * @param next          Required function to invoke to call next callback.
 * @return {Function}   A non-null function that invokes the given callback.
 */
function createCallbackInvoker (callback, results, next) {
  return function (index) {
    callback(function () {
      results[index] = Array.prototype.slice.call(arguments)
      next()
    })
  }
}

/**
 * Executes callbacks asynchronously ensuring that a limited number of callbacks are allowed to execute at any time.
 *
 * @param {array} callbacks     Required array of callbacks to invoke.
 * @param {function} last       A callback function to invoke after all of the given callbacks have executed.
 * @param {number} [limit]      Optional amount of callbacks that can be allowed to run asynchronously.
 */
function doWork (callbacks, last, limit) {
  let results = []
  let running = 1
  let task = 0
  function next () {
    running -= 1
    if ((task === callbacks.length) && (running === 0)) {
      last(results)
    }
    while ((running < limit) && callbacks[task]) {
      createCallbackInvoker(callbacks[task], results, next)(task)
      task += 1
      running += 1
    }
  }

  next()
}

/**
 * Creates, and returns, a new throttled worker.
 *
 * @param {number} [limit]          Optional maximum number of asynchronous tasks that can be running.
 * @return {ThrottledWorker}        A non-null throttled worker.
 */
function newInstance (limit) {
  return new ThrottledWorker(limit)
}

exports.newInstance = newInstance
