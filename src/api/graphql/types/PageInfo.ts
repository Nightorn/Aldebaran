/* eslint-disable no-underscore-dangle */
export default class PageInfo {
	_endCursor: string | null;
	_startCursor: string | null;
	_totalCount: number | null;
	_hasNextPage: boolean | null;
	_hasPreviousPage: boolean | null;

	constructor(
		endCur?: string,
		startCur?: string,
		totalCount?: number,
		hasNextPage?: boolean,
		hasPreviousPage?: boolean
	) {
		this._endCursor = endCur || null;
		this._startCursor = startCur || null;
		this._totalCount = totalCount || null;
		this._hasNextPage = hasNextPage || null;
		this._hasPreviousPage = hasPreviousPage || null;
	}

	endCursor() {
		return this._endCursor;
	}

	hasNextPage() {
		return this._hasNextPage;
	}

	totalCount() {
		return this._totalCount;
	}

	hasPreviousPage() {
		return this._hasPreviousPage;
	}

	startCursor() {
		return this._startCursor;
	}
}
