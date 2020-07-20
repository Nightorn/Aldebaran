/* eslint-disable no-underscore-dangle */
module.exports = class PageInfo {
	constructor(endCur, startCur, totalCount, hasNextPage, hasPreviousPage) {
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
};
