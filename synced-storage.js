/*!
 *
 * Synced Storage v1.0.1
 *
 * https://github.com/kasimi/JS-Synced-Storage
 * Copyright 2016 kasimi
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
var syncedStorage = function(options) {

	"use strict";

	var mergeFlatDefensive = function(obj, mergingObj) {
		for (var key in mergingObj) {
			if (mergingObj.hasOwnProperty(key) && !obj.hasOwnProperty(key)) {
				obj[key] = mergingObj[key];
			}
		}
	};

	var getStorage = function(type) {
		try {
			var storage = window[type];
			var x = '__storage_test__';
			storage.setItem(x, x);
			storage.removeItem(x);
			return storage;
		}
		catch(e) {
			return false;
		}
	};

	mergeFlatDefensive(options, {
		storage			: 'localStorage',
		storageKey		: 'syncedStorage',
		sessionLength	: false,
		cachedDataTTL	: options.updateInterval
	});

	var storage = getStorage(options.storage) || false;
	var sessionLength = options.sessionLength;
	var lastStorageEventTime = 0;

	var writeToStorage = function(data) {
		var storageContent = JSON.stringify({
			time: new Date().getTime(),
			data: data
		});
		storage && storage.setItem(options.storageKey, storageContent);
	};

	var readFromStorage = function() {
		var storageContent = storage.getItem(options.storageKey);
		return JSON.parse(storageContent).data;
	};

	var updateData = function(done) {
		if (lastStorageEventTime > new Date().getTime() - options.updateInterval) {
			done();
		} else {
			options.getData(function(data) {
				writeToStorage(data);
				options.processData(data);
				done();
			});
		}
	};

	var scheduleUpdate = function() {
		setTimeout(function() {
			updateData(function() {
				if (sessionLength === false || (sessionLength -= options.updateInterval) > 0) {
					scheduleUpdate();
				}
			});
		}, options.updateInterval);
	};

	window.addEventListener('storage', function(e) {
		if (e.key == options.storageKey) {
			lastStorageEventTime = new Date().getTime();
			options.processData(readFromStorage());
		}
	});

	scheduleUpdate();
};
