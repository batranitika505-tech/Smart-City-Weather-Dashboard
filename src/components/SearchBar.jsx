import React, { useState } from 'react';

const SearchBar = ({ onSearch, isLoading }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = city.trim();
    if (query) {
      onSearch(query);
      setCity(''); // Clear after search
    }
  };

  return (
    <form className="search-wrapper" onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Search any city (e.g. Pune, Tokyo)..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? '⏳' : 'Search'}
      </button>
    </form>
  );
};

export default SearchBar;
