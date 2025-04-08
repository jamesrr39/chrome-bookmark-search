import { useEffect, useState } from "preact/hooks";
import { Bookmark } from "../types/Bookmark";
import { Result } from "../types/Result"
import { generateFaviconUrl } from "../dal/bookmarkFetcher";
import { createRef } from "preact";
import { debounceLater } from "../Debouncer";
import { BookmarkByUrlMap } from "../hooks/fetchBookmarksHook";


const ResultTypes = {
    SEARCH_RESULT: {
        cssClass: "searchResult",
        name: "Search Result"
    },
    FILTER_RESULT: {
        cssClass: "filterResult",
        name: "Filter Result"
    }
};

type Props = {
    bookmarkMap: BookmarkByUrlMap,
    searchIndex: lunr.Index
}

function Form({ searchIndex, bookmarkMap }: Props) {
    const inputRef = createRef<HTMLInputElement>();

    const [latestSearch, setLatestSearch] = useState<{searchResults: ResultEntryProps[], searchTerm: string}>({searchResults: [], searchTerm: ''});
    const debouncedOnKeyUpFunc = debounceLater<string>((searchTerm) => {

        const results: Result[] = []
        const resultsMap = new Map<string, Bookmark>();
        searchIndex.search(searchTerm).forEach(result => {
            const bookmark = bookmarkMap.get(result.ref);
            if (!bookmark) {
                throw new Error('bookmark not found');
            }

            results.push({
                bookmark,
                score: result.score,
                resultType: ResultTypes.SEARCH_RESULT
            });
            if (!bookmark.url) {
                console.error('no bookmark URL');
                return;
            }
            resultsMap.set(bookmark.url, bookmark);
        });

        const filterResults: Result[] = []

        const upperCaseSearchTerms = searchTerm.split(' ').filter(fragment => Boolean(fragment)).map(fragment => fragment.toUpperCase());

        // now add filter results
        bookmarkMap.forEach(bookmark => {
            if (!bookmark.url) {
                return;
            }

            if (resultsMap.get(bookmark.url)) {
                // already in lunr results
                return;
            }

            if (bookmarkShouldAppearInFilterResults(upperCaseSearchTerms, bookmark)) {
                filterResults.push({
                    bookmark,
                    resultType: ResultTypes.FILTER_RESULT,
                })
            }
        });

        const searchResults = results.concat(filterResults);

        setLatestSearch({searchResults, searchTerm});

    }, 300);

    useEffect(() => {
        if (!inputRef.current) {
            return;
        }
        
        inputRef.current.focus();
    }, []);

    const {searchResults, searchTerm} = latestSearch;

    return (
        <div>
            <div class="input-group">
                <input
                    ref={inputRef}
                    type="text"
                    class="form-control search"
                    placeholder="Start typing to search..."
                    id="searchTermInput"
                    onKeyUp={event => debouncedOnKeyUpFunc(event.currentTarget.value)}
                />
                <div class="input-group-btn">
                    <span class="btn btn-default">
                        <i class="glyphicon glyphicon-search"></i>
                    </span>
                </div>
            </div>
            {searchResults.length === 0 && searchTerm !== "" && <p>No results</p>}
            {searchResults.length !== 0 && (
                <ul class="list-unstyled" id="bookmarksListing">
                    {searchResults.map(result => (
                        <ResultEntry bookmark={result.bookmark} resultType={result.resultType} score={result.score} />
                    ))}
                </ul>
            )}
        </div>
    )
}


type ResultType = { name: string, cssClass: string };

export type ResultEntryProps = {
    bookmark: Bookmark
    resultType: ResultType
    score?: number
}

function ResultEntry({ bookmark, resultType, score }: ResultEntryProps) {
    const { title, url, dateAdded, parentFolders } = bookmark;
    const [showMoreInfo, setShowMoreInfo] = useState(false);

    return (
        <li class={`padded-top result ${resultType.cssClass}`}>
            {url && <Favicon faviconUrl={generateFaviconUrl(url)} url={url} />}
            <a target="_blank" href={url}>
                <span class="emphasisable">{title}</span>
            </a>
            <span class="pull-right">
                <i class="fa fa-fw fa-bookmark"></i>
            </span>
            <br /><span class="emphasisable">{url}</span>
            <br /><span class="folders">{parentFolders.filter(parentFolder => Boolean(parentFolder)).map(parentFolder => (<span class="folder"> {parentFolder.title} </span>))}</span>
            <br /><a href="#" class="more" onClick={() => setShowMoreInfo(!showMoreInfo)}><span><i class="glyphicon glyphicon-info-sign">&nbsp;More</i></span></a>
            {showMoreInfo && (<div class="more-info">
                {score && <span class="score">Score from lunr search: {score}</span>}
                <br /><span class="resultType">Type of result: {resultType.name}</span>
                <br /><span>Date added: {dateAdded}</span>
            </div>)}
        </li>
    )
}

type FaviconProps = {
    url: string
    faviconUrl: string
}

function Favicon({ faviconUrl, url }: FaviconProps) {
    return <img src={faviconUrl} alt={url} />;
}


function bookmarkShouldAppearInFilterResults(filterTerms: string[], bookmark: Bookmark) {
    for (var i = 0; i < filterTerms.length; i++) {
        if (bookmark.url && bookmark.url.toUpperCase().indexOf(filterTerms[i]) !== -1) {
            return true;
        }
        if (bookmark.title.toUpperCase().indexOf(filterTerms[i]) !== -1) {
            return true;
        }
    }
    return false;
};


export default Form;