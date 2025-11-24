import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import { fetchItems, setQuery, setPage } from "../features/items/itemsSlice"

import Spinner from '../components/Spinner'
import ErrorBox from '../components/ErrorBox'
import Card from '../components/Card'
import '../styles/Items.css'

export default function Items() {
    const dispatch = useDispatch();

    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get('q') || ''
    const page = parseInt(searchParams.get("page")) || 1;

    const {
        list,
        loadingList,
        errorList,
        totalPages
    } = useSelector((state) => state.items);

    useEffect(() => {
        if (!q.trim()) return;

        dispatch(fetchItems({ query: q, page }));
    }, [q, page]);

    function onChange(e) {
        const v = e.target.value;
        dispatch(setQuery(v));

        if (v) setSearchParams({ q: v, page: 1 });
        else setSearchParams({});
    }

    function goToPage(p) {
        if (p < 1 || p > totalPages) return;
        dispatch(setPage(p));

        setSearchParams({ q, page: p });
    }

    return (
        <div className="items-page">
            <h2 className="page-title">Discover Books</h2>

            <div className="search-row">
                <input
                    className="search-input"
                    placeholder="Search by title..."
                    value={q}
                    onChange={onChange}
                />
            </div>

            {q.trim() === "" ? (
                <div className="empty-search">
                    <img src="/book-search.png" alt="search" />
                    <h3>Start exploring 📚</h3>
                    <p>Type a book title or author to begin your search.</p>
                </div>
            ) : (
                <>
                    {loadingList && <Spinner />}
                    {errorList && <ErrorBox>{errorList}</ErrorBox>}

                    {!loadingList && !errorList && (
                        <>
                            <div className="items-grid">
                                {list.length === 0 && <p className="no-results">No matching results.</p>}
                                {list.map((it) => (
                                    <Card key={it.id} item={it} />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button onClick={() => goToPage(page - 1)} disabled={page === 1}>
                                        ← Prev
                                    </button>
                                    <span>Page {page} of {totalPages}</span>
                                    <button onClick={() => goToPage(page + 1)} disabled={page === totalPages}>
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    )
}
