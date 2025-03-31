import { Bookmark } from "../types/Bookmark";

export async function fetchBookmarks(): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
    const bookmarks = await chrome.bookmarks.getTree();

    return bookmarks;
}

export function generateFaviconUrl(bookmarkUrl: string): string{
    const favicon = new URL(chrome.runtime.getURL("/_favicon/"));
    favicon.searchParams.set("pageUrl", bookmarkUrl);
    favicon.searchParams.set("size", "24");
    return favicon.toString();
}