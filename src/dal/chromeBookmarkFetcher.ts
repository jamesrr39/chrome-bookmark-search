import { Bookmark } from "../types/Bookmark";

export async function fetchBookmarks(): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
    const bookmarks = await chrome.bookmarks.getTree();

    return bookmarks;
}
