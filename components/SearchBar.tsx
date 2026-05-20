import React from 'react';

export default function SearchBar() {
  return (
    <div className="glass p-6 rounded-3xl shadow-2xl">
      <div className="flex flex-col md:flex-row gap-4">
        <input className="flex-1 p-4 rounded-xl bg-transparent border border-gray-700" placeholder="Search location, neighbourhood or property" />
        <select className="p-4 rounded-xl bg-transparent border border-gray-700">
          <option>All types</option>
          <option>Villa</option>
          <option>Penthouse</option>
        </select>
        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#062232] to-[#051022]">Search</button>
      </div>
    </div>
  );
}
