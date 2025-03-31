import { useEffect, useState } from "preact/hooks";
// import { fetchBookmarks } from "../dal/mockBookmarkFetcher";
import { fetchBookmarks } from "../dal/chromeBookmarkFetcher";
import { Bookmark } from "../types/Bookmark";
import lunr from "lunr";

type FetchResponse<T> = {
    data: T | undefined
    isLoading: boolean
}

type BookmarkByUrlMap = Map<string, Bookmark>;

type FetchResponseData = {
    bookmarkMap: BookmarkByUrlMap,
    searchIndex: lunr.Index
}

export function useFetchBookmarks() {
    const [response, setIsResponse] = useState<FetchResponse<FetchResponseData>>({
        isLoading: true,
        data: undefined
    });

    useEffect(() => {
        fetchBookmarks().then(bookmarks => {
            console.log('all bookmarks', bookmarks)
            const bookmarkMap = new Map<string, Bookmark>();
            const onBookmarkFound = (bookmark: Bookmark) => {
                if (!bookmark.url) {
                    console.log('no URL for bookmark:', bookmark);
                    return;
                }
                bookmarkMap.set(bookmark.url, bookmark);
            };

            bookmarks.forEach(bookmark => traverse(bookmark, [], onBookmarkFound));

            const searchIndex = lunr(function () {
                this.field("url", {
                    boost: 10
                });
                this.field("title", {
                    boost: 5
                });
                this.field("folders", {
                    boost: 3
                });
                this.ref("url");
        
                bookmarkMap.forEach(bookmark => this.add(bookmark));
            });

            setIsResponse({
                data: {
                    bookmarkMap,
                    searchIndex
                },
                isLoading: false
            })
        });
    }, []);

    return response;
}

function traverse(bookmark: chrome.bookmarks.BookmarkTreeNode & {faviconUrl?: string}, parentFolders: chrome.bookmarks.BookmarkTreeNode[], onBookmarkFound: (bookmark: Bookmark) => void) {
    console.log('parentFolders', parentFolders, bookmark)
	if (!bookmark.children) {
        // it's a bookmark
		onBookmarkFound({
			...bookmark,
			parentFolders,
		});
        return;
	}

	// it's a folder
	bookmark.children.forEach(child => {
		traverse(child, parentFolders.concat(bookmark), onBookmarkFound);
	})
}
