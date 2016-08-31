# Synced Storage

Utility function for synchronizing data between browser windows/tabs using Web Storage and vanilla JS.

## What is this?

Frequently checking for new data by sending requests to a server is a common thing to do. When multiple windows/tabs are open, requests are sent in an isolated way: window A just fetched and processed new data, window B is still waiting for its next update to be triggered. This presents us with two problems and opportunities for optimization:

1. The server receives more requests from the client than necessary. There should be a way to limit the number of requests so that it is enforced that no more than one request is sent in a given `updateInterval`.
2. When a window/tab receives new data, it should send that data to other windows/tabs in order for them to process it immediately and not having to wait for their update to be triggered.

The `syncedStorage()` function solves these issues.

## Documentation

Available options to pass to the `syncedStorage()` function:

| Option | Required | Type | Description |
|---|---|---|---|
| `getData` | Yes | `function` | Callback function that is called when new data needs to be fetched. It receives a callback function as its first argument that should be called with the cacheable data as first argument. Do not return the data from within getData! |
| `processData` | Yes | `function` | Callback function that processes new data. It receives the data as its first argument. |
| `updateInterval` | Yes | `int` | Number of milliseconds after which the data should be updated. |
| `sessionLength` | No, default: `false` | `int|bool` | Number of milliseconds after which to stop updating the data. If `false` is passed, updates will never stop. |
| `storage` | No, default: `'localStorage'` | `string` | The name of storage object to use. |
| `storageKey` | No, default: `'syncedStorage'` | `string` | String with which to associate the data in the storage. |

## Example

```javascript
syncedStorage({
	getData: function(accept) {
		jQuery.getJSON('/api/json/update').done(accept);
	},
	processData: function(data) {
		jQuery('<div/>', {text: data.text}).appendTo(document);
	},
	updateInterval: 10 * 1000, // Update every 10 seconds
	sessionLength: 60 * 1000, // Stop updating after 1 minute
	storageKey: 'syncedStorageExample'
});

```

## Changelog

* v1.0.1
  * Transparent fallback to regular, isolated requests if Web Storage is not available

* v1.0.0
  * Initial release

## Copyright and license

Copyright 2016 kasimi. Released under the MIT license.
