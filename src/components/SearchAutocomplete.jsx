import React, { useState, useEffect, useRef, useMemo } from "react";
import Fuse from "fuse.js";

export default function SearchAutocomplete({
  value,
  onChange,
  items,
  searchKeys,
  getLabel,
  getSublabel,
  getKey,
  onSelect,
  placeholder,
  inputRef,
  maxSuggestions = 8,
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setHighlighted(0);
  }, [value]);

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: searchKeys,
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [items, searchKeys],
  );

  const query = value.trim();
  const suggestions = query
    ? fuse.search(query, { limit: maxSuggestions }).map((r) => r.item)
    : [];

  const selectItem = (item) => {
    onSelect(item);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => (h + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => (h - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      if (suggestions[highlighted]) {
        e.preventDefault();
        selectItem(suggestions[highlighted]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const highlightMatch = (label) => {
    const idx = label.toLowerCase().indexOf(query);
    if (idx === -1) return label;
    return (
      <>
        {label.slice(0, idx)}
        <span className="font-semibold text-blue-600">
          {label.slice(idx, idx + query.length)}
        </span>
        {label.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div className="relative rounded-md shadow-sm flex-grow" ref={wrapperRef}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="block w-full rounded-md border-gray-300 pl-4 pr-10 py-3 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-autocomplete="list"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full max-h-72 overflow-auto rounded-md bg-white border border-gray-200 shadow-lg">
          {suggestions.map((item, i) => (
            <li
              key={getKey(item)}
              onMouseDown={(e) => {
                e.preventDefault();
                selectItem(item);
              }}
              onMouseEnter={() => setHighlighted(i)}
              className={`px-4 py-2 cursor-pointer flex flex-col ${
                i === highlighted ? "bg-blue-50" : ""
              }`}
            >
              <span className="text-sm text-gray-900">{highlightMatch(getLabel(item))}</span>
              {getSublabel && (
                <span className="text-xs text-gray-500">{getSublabel(item)}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
