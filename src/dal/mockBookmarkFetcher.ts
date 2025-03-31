import { Bookmark } from "../types/Bookmark";

const bookmarks: chrome.bookmarks.BookmarkTreeNode[] = [];

const childBookmarks: chrome.bookmarks.BookmarkTreeNode[] = [];

const rootBookmarkFolder: chrome.bookmarks.BookmarkTreeNode = {
    id: 'd1',
    title: 'my folder',
    children: childBookmarks,
}


bookmarks.push(rootBookmarkFolder);


for (let i = 1; i <= 100; i++) {
    childBookmarks.push({
        title: `test ${i}`,
        id: `${i}`,
        url: `https://example.com/test${i}`,
        parentId: 'd1',
    });
}

export async function fetchBookmarks(): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
    return bookmarks;
}

export function generateFaviconUrl(bookmarkUrl: string): string{
    return '';
}