export type Bookmark = {
    parentFolders: chrome.bookmarks.BookmarkTreeNode[]
} & chrome.bookmarks.BookmarkTreeNode;
