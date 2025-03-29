import { useState } from 'preact/hooks';
import { Bookmark } from './types/Bookmark';
import { useFetchBookmarks } from './hooks/fetchBookmarksHook';
import lunr from 'lunr';
import { debounceLater } from './Debouncer';

function App() {
	const { isLoading, data } = useFetchBookmarks();
	const [searchResults, setSearchResults] = useState<ResultEntryProps[]>([]);
	console.log('searchResults', searchResults)
	const debouncedOnKeyUpFunc = debounceLater<string>((searchTerm) => {

		// const s1 = lunr.tokenizer(searchTerm);
		// const s2 = s1.map(searchWord => lunr.stemmer(searchWord));
		// console.log('lunr stems', s1, s2);
		if (!data) {
			throw new Error('data undefined');
		}

		const { searchIndex, bookmarkMap } = data;

		const results = searchIndex.search(searchTerm).map(result => {
			const bookmark = bookmarkMap.get(result.ref);
			if (!bookmark) {
				throw new Error('bookmark not found');
			}

			return {
				bookmark,
				score: result.score,
				resultType: ResultTypes.SEARCH_RESULT
			};
		})

		setSearchResults(results);

	}, 300)

	if (isLoading) {
		return <div class="alert alert-warning">Loading...</div>;
	}

	if (!data) {
		return <div class="alert alert-danger">Error loading bookmarks</div>;
	}



	return (
		<div>
			<div class="input-group">
				<input type="text" class="form-control search" placeholder="Start typing to search..." id="searchTermInput" onKeyUp={event => debouncedOnKeyUpFunc(event.currentTarget.value)} />
				<div class="input-group-btn">
					<span class="btn btn-default">
						<i class="glyphicon glyphicon-search"></i>
					</span>
				</div>
			</div>
			{searchResults.length === 0 && <p>No results</p>}
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

type ResultType = { name: string, cssClass: string };

type ResultEntryProps = {
	bookmark: Bookmark
	resultType: ResultType
	score: number
}

function ResultEntry({ bookmark, resultType, score }: ResultEntryProps) {
	const { title, url, dateAdded, parentFolders } = bookmark;
	const [showMoreInfo, setShowMoreInfo] = useState(false);

	return (
		<li class={`padded-top result ${resultType.cssClass}`}>
			{url && <Favicon url={url} />}
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
				<span class="score">Score from lunr search: {score}</span>
				<br /><span class="resultType">Type of result: {resultType.name}</span>
				<br /><span>Date added: {dateAdded}</span>
			</div>)}
		</li>
	)
}

type FaviconProps = {
	url: string
}

function Favicon({ url }: FaviconProps) {
	// const faviconUrl = new URL(chrome.runtime.getURL("/_favicon/"));
	// faviconUrl.searchParams.set("pageUrl", url);
	// faviconUrl.searchParams.set("size", "24");

	// return <img src={faviconUrl.toString()} alt={url} />;
	return <img src="" />
}

export default App;
