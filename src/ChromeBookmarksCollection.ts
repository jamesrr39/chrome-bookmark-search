
const JAVASCRIPT_URL_PREFIX = "javascript:";


type Bookmark = chrome.bookmarks.BookmarkTreeNode & {
	folders: string[]
};

export async function fetchBookmarks(): Promise<Bookmark[]> {
	// return new Promise<Bookmark[]>((resolve) => {
	const tree = await chrome.bookmarks.getTree();

	const bookmarks: Bookmark[] = tree.flatMap(bookmark => flatten(bookmark, []))
	
	return bookmarks;
	// })
}

function flatten(bookmark: chrome.bookmarks.BookmarkTreeNode, parentFolders: string[]): Bookmark[] {
	if (!bookmark.children) {
		// it's a bookmark
		return [{
			...bookmark,
			folders: parentFolders
		}];
	}

	// it's a folder
	return bookmark.children.flatMap(child => {
		return flatten(child, parentFolders.concat(bookmark.title));
	})
}

// /**
//  * Takes a list of bookmarks and folders and returns a modified list of the bookmarks.
//  * Produces an additional property, <code>folders</code>, a list of names of folders the bookmark appears in.
//  * This is populated top to bottom, so the folder the bookmark is immeadiately in would be index 0, and it's folder would be at index 1, etc.
//  * @param {array} bookmarks list of Chrome bookmarks
//  * @param {array} folders list of folders
//  * @returns {array} list of bookmarks with a new <code>folders</code> property
//  */
// function mergeFoldersIntoBookmarks(bookmarks: chrome.bookmarks.BookmarkTreeNode[], folders: chrome.BookmarkFolder) {
// 	// map[id]Folder
// 	var foldersMap = {};
// 	folders.forEach(function (folder) {
// 		foldersMap[folder.id] = folder;
// 	});

// 	return bookmarks.map(function (bookmark) {
// 		var parentFolder,
// 			parentFolders = [];
// 		(function setFolders(node) {
// 			if (node.hasOwnProperty("parentId")) {
// 				// todo - performance, does this need to be moved to a collection
// 				parentFolder = foldersMap[node.parentId];
// 				if (parentFolder.title !== "" && parentFolder.title !== "Bookmarks bar") {
// 					parentFolders.push(parentFolder.title);
// 				}
// 				setFolders(parentFolder);
// 			}
// 		})(bookmark);
// 		return {
// 			...bookmark,
// 			folders: parentFolders
// 		};
// 	});
// }

// /**
//  * Flattens a bookmark structure from Chrome <code>bookmarks.getTree</code> API.
//  * Converts into a map with the following two keys:
//  * <ul>
//  * <li><code>bookmarks</code> list of all the bookmarks</li>
//  * <li><code>folders</code> list of the folders</li>
//  * </ul>
//  * @param {object|array} bookmarkSubTree Chrome <code>bookmarks.getTree</code> API callback passed-in parameter
//  * @returns {object} map with <code>bookmarks</code> and <code>folders</code> properties, both of which are lists.
//  */
// function flatten(bookmarkSubTree: chrome.bookmarks.BookmarkTreeNode): {bookmarks: chrome.bookmarks.BookmarkTreeNode[]} {
// 	var bookmarks = [],
// 		folders = [];
// 	(function flatten(bookmarkSubTree) {
// 		if (Array.isArray(bookmarkSubTree)) {
// 			return bookmarkSubTree.map(function (bookmarkSubTreeChild) {
// 				return flatten(bookmarkSubTreeChild);
// 			});
// 		} else if (bookmarkSubTree.hasOwnProperty("children")) {
// 			folders.push(bookmarkSubTree);
// 			return flatten(bookmarkSubTree.children);
// 		} else {
// 			// don't accept bookmarklets
// 			if (bookmarkSubTree.url.indexOf(JAVASCRIPT_URL_PREFIX) !== 0) {
// 				bookmarks.push(bookmarkSubTree);
// 			}
// 		}
// 	})(bookmarkSubTree);
// 	return {
// 		bookmarks: bookmarks,
// 		folders: folders
// 	};
// }

// // /**
// //  * Bookmarks Collection Object
// //  * @param {lunr.js searchIndex} searchIndex
// //  * @returns {ChromeBookmarksCollection}
// //  */
// // class BookmarksCollection {
// // 	var bookmarkMap = {},
// // 		bookmarkList;

// // 	return {
// // 		fetch: function (callback, context) {
// // 			chrome.bookmarks.getTree(function (chromeBookmarkTree) {
// // 				var bookmarksTree = flatten(chromeBookmarkTree),
// // 					bookmarks = mergeFoldersIntoBookmarks(bookmarksTree.bookmarks, bookmarksTree.folders);

// // 				bookmarkList = bookmarks;

// // 				bookmarks.forEach(function (bookmark) {
// // 					bookmarkMap[bookmark.url] = bookmark;
// // 					searchIndex.add(bookmark);
// // 				});
// // 				callback.call(context);
// // 			});
// // 		},
// // 		asMap: function () {
// // 			return bookmarkMap;
// // 		},
// // 		asList: function () {
// // 			return bookmarkList;
// // 		}
// 	};
// };

// export default BookmarksCollection;
