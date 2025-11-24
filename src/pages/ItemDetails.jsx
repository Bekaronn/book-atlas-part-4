import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";
import "../styles/ItemDetails.css";

import { useDispatch, useSelector } from "react-redux";
import { fetchItemById } from "../features/items/itemsSlice";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedItem: item,
    loadingItem,
    errorItem,
  } = useSelector((state) => state.items);

  useEffect(() => {
    if (id) {
      dispatch(fetchItemById(id));
    }
  }, [id, dispatch]);

  if (loadingItem) return <Spinner />;
  if (errorItem) return <ErrorBox>{errorItem}</ErrorBox>;
  if (!item) return <div className="not-found">Book not found</div>

  const coverUrl = item.covers?.[0]
    ? `https://covers.openlibrary.org/b/id/${item.covers[0]}-L.jpg`
    : null

  function formatDate(dateString) {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="item-details-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="item-card">
        {coverUrl ? (
          <img className="item-cover" src={coverUrl} alt={item.title} loading="lazy" />
        ) : (
          <div className="no-cover">{item.title}</div>
        )}

        <div className="item-info">
          <h2 className="item-title">{item.title}</h2>

          {item.description && (
            <div className="item-section">
              <strong>Description:</strong>
              <p className="item-text">{item.description}</p>
            </div>
          )}

          <div className="item-section">
            <strong>First published:</strong> {item.first_publish_date || '—'}
          </div>

          <div className="item-section">
            <strong>Created:</strong> {formatDate(item.created?.value)}
          </div>

          <div className="item-section">
            <strong>Last modified:</strong> {formatDate(item.last_modified?.value)}
          </div>

          {item.authors.length > 0 && (
            <div className="item-section">
              <strong>Authors:</strong>
              <ul>
                {item.authors.map((a) => (
                  <li key={a.key}>
                    {a.name} {a.birth_date ? `(${a.birth_date}` : ''}{a.death_date ? `–${a.death_date})` : a.birth_date ? ')' : ''}
                    {a.photos.length > 0 && (
                      <img
                        src={`https://covers.openlibrary.org/a/id/${a.photos[0]}-S.jpg`}
                        alt={a.name}
                        style={{ marginLeft: '10px', verticalAlign: 'middle', borderRadius: '50%' }}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.subject_places.length > 0 && (
            <div className="item-section">
              <strong>Places:</strong>
              <ul>
                {item.subject_places.map((place) => (
                  <li key={place}>{place}</li>
                ))}
              </ul>
            </div>
          )}

          {item.subject_people.length > 0 && (
            <div className="item-section">
              <strong>People:</strong>
              <ul>
                {item.subject_people.map((person) => (
                  <li key={person}>{person}</li>
                ))}
              </ul>
            </div>
          )}

          {item.subject_times.length > 0 && (
            <div className="item-section">
              <strong>Times:</strong>
              <ul>
                {item.subject_times.map((time) => (
                  <li key={time}>{time}</li>
                ))}
              </ul>
            </div>
          )}

          {item.subjects.length > 0 && (
            <div className="item-section">
              <strong>Subjects:</strong>
              <div className="subjects-badges">
                {item.subjects.slice(0, 20).map((subj) => (
                  <span key={subj} className="subject-badge">{subj}</span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
