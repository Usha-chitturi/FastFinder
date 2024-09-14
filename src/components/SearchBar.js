// src/components/SearchBar.js
import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import './SearchBar.css';
import { FaSearch } from 'react-icons/fa'; // Import search icon from react-icons

const getSuggestions = (value, countries) => {
  const inputValue = value.toLowerCase();
  const inputLength = inputValue.length;
  return inputLength === 0 ? [] : countries.filter(country =>
    country.country.toLowerCase().slice(0, inputLength) === inputValue ||
    (country.capital && country.capital.toLowerCase().slice(0, inputLength) === inputValue)
  );
};

const getSuggestionValue = suggestion => suggestion.country;

const renderSuggestion = suggestion => {
  const capital = suggestion.capital ? ` (${suggestion.capital})` : '';
  return (
    <div className="suggestion-item">
      <FaSearch className="suggestion-icon" />
      <span className="suggestion-text">
        {suggestion.country}{capital}
      </span>
    </div>
  );
};

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    // Fetch data from public folder
    fetch('/countries.json')
      .then(response => response.json())
      .then(data => setCountries(data))
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  const handleSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value, countries));
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const handleSuggestionSelected = (event, { suggestion }) => {
    setQuery(suggestion.country);
  };

  const inputProps = {
    placeholder: 'Type a country or capital',
    value: query,
    onChange: (event, { newValue }) => setQuery(newValue)
  };

  return (
    <div className="page-container">
      <div className="search-bar-card">
        <h1 className="page-heading">Search Countries</h1>
        <div className="search-bar">
          <div className="search-bar-wrapper">
            <FaSearch className="search-icon" />
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
              onSuggestionsClearRequested={handleSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              onSuggestionSelected={handleSuggestionSelected}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
