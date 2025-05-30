import React, { useState, useEffect, useRef } from "react";
import { fetchProcedures, fetchProcedure } from "../API/api_calls";
import PropTypes from "prop-types";
import { FiSearch } from "react-icons/fi";

/**
 * SearchProcedure component for searching procedures or document specs.
 *
 * @param {Object} props
 * @param {function} props.onProcedureSelect - Callback when a procedure is selected
 */
function SearchProcedure({ onProcedureSelect }) {
  const [query, setQuery] = useState("");
  const [procedures, setProcedures] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const inputRef = useRef(null);

  useEffect(() => {
    // Fetch all procedures on mount
    fetchProcedures()
      .then(setProcedures)
      .catch(() => setProcedures([]));
  }, []);

  useEffect(() => {
    if (!query) {
      // Show all if focused and query is empty
      setFiltered(
        procedures.flatMap((doc) =>
          doc.document_procedures.flatMap((proc) =>
            proc.entity.map((entity) => ({
              procedure_id: proc.procedure_id,
              procedure_name: proc.procedure_name,
              entity,
              document_spec: doc.document_spec,
              document_version: doc.document_version,
              document_release: doc.document_release,
              document_id: doc.document_id,
            }))
          )
        )
      );
      // Don't close dropdown here
      return;
    }
    // Filter by procedure name or document spec (case-insensitive)
    const q = query.toLowerCase();
    const results = [];
    procedures.forEach((doc) => {
      doc.document_procedures.forEach((proc) => {
        if (
          proc.procedure_name.toLowerCase().includes(q) ||
          doc.document_spec.toLowerCase().includes(q)
        ) {
          proc.entity.forEach((entity) => {
            results.push({
              procedure_id: proc.procedure_id,
              procedure_name: proc.procedure_name,
              entity,
              document_spec: doc.document_spec,
              document_version: doc.document_version,
              document_release: doc.document_release,
              document_id: doc.document_id,
            });
          });
        }
      });
    });
    setFiltered(results);
    // Don't close dropdown here
    setHighlightedIdx(-1);
  }, [query, procedures]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      setHighlightedIdx((idx) => Math.min(idx + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      setHighlightedIdx((idx) => Math.max(idx - 1, 0));
    } else if (e.key === "Enter" && highlightedIdx >= 0) {
      handleSelect(filtered[highlightedIdx]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  // Handle selection
  const handleSelect = async (item) => {
    setQuery("");
    setShowDropdown(false);
    setHighlightedIdx(-1);
    // Fetch full procedure data
    try {
      const data = await fetchProcedure(item.procedure_id, item.entity);
      if (data && onProcedureSelect) {
        onProcedureSelect({
          ...data,
          id: item.procedure_id,
          name: item.procedure_name,
          entity: item.entity,
          document_id: item.document_id,
          spec: item.document_spec,
          release: item.document_release,
          doc_version: item.document_version,
        });
      }
    } catch (err) {
      // Optionally handle error
      console.error("Error fetching procedure:", err);
    }
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClick = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Show dropdown on focus
  const handleFocus = () => {
    setShowDropdown(true);
    // Show all if query is empty
    if (!query) {
      setFiltered(
        procedures.flatMap((doc) =>
          doc.document_procedures.flatMap((proc) =>
            proc.entity.map((entity) => ({
              procedure_id: proc.procedure_id,
              procedure_name: proc.procedure_name,
              entity,
              document_spec: doc.document_spec,
              document_version: doc.document_version,
              document_release: doc.document_release,
              document_id: doc.document_id,
            }))
          )
        )
      );
    }
  };

  return (
    <div className="search-procedure-container" ref={inputRef}>
      <div className="search-procedure-input-wrapper">
        <FiSearch className="search-procedure-icon" />
        <input
          className="search-procedure-input"
          type="text"
          placeholder="Search by procedure name or document spec"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          aria-label="Search procedures"
        />
      </div>
      {showDropdown && (
        <div className="search-procedure-dropdown">
          {filtered.map((item, idx) => (
            <div
              key={`${item.procedure_id}-${item.entity}`}
              className={`search-procedure-item${idx === highlightedIdx ? " highlighted" : ""}`}
              onMouseDown={() => handleSelect(item)}
              onMouseEnter={() => setHighlightedIdx(idx)}
            >
              <div className="search-procedure-row">
                <span className="search-procedure-name">{item.procedure_name}</span>
                <span className="search-procedure-entity">{item.entity}</span>
                <span className="search-procedure-spec">TS {item.document_spec}</span>
                <span className="search-procedure-version">V{item.document_version}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="search-procedure-no-results">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}

SearchProcedure.propTypes = {
  onProcedureSelect: PropTypes.func,
};

export default SearchProcedure;