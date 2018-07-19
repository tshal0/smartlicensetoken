var _ = require("lodash");
var Promise = require("bluebird");
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

module.exports = {
    assertEvent: function(contract, filter) {
        return new Promise((resolve, reject) => {
            var event = typeof contract[filter.event] == 'function' ? contract[filter.event]() : reject(Error("Event doesn't exist"));
            event.watch();
            event.get((error, logs) => {
                var log = _.filter(logs, filter);
                if (log.length) {
                    resolve(log);
                } else {
                    reject("Failed to find filtered event for " + filter.event);
                }
            });
            event.stopWatching();
        });
    }
}