import { useFetchBookmarks } from './hooks/fetchBookmarksHook';
import Form from './components/Form';

function App() {
	const { isLoading, data } = useFetchBookmarks();

	if (isLoading) {
		return <div class="alert alert-warning">Loading...</div>;
	}

	if (!data) {
		return <div class="alert alert-danger">Error loading bookmarks</div>;
	}

	return (
		<Form bookmarkMap={data.bookmarkMap} searchIndex={data.searchIndex} />
	);
}

export default App;
