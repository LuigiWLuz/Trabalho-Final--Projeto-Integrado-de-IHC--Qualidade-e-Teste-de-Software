// --- Arquivo: src/App.jsx ---

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import ShowDetails from "./pages/ShowDetails";
import Checkout from "./components/Checkout"; 
import OrderSuccess from "./components/OrderSuccess";

import "./index.css";
import FilterSidebar from "./components/FilterSidebars"; 

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    if (value.length > 0) {
      scrollToShows();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const [filterCities, setFilterCities] = useState([]); 
  const [filterRatings, setFilterRatings] = useState([]); 

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);
  
  const [isContrastMode, setIsContrastMode] = useState(false);
  const toggleContrastMode = () => setIsContrastMode(prev => !prev);

  const scrollToShows = () => {
    const showsSection = document.getElementById('Shows');
    if (showsSection) {
      showsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFilterChange = (type, value) => {
    if (type === "city") setFilterCities(value);
    if (type === "rating") setFilterRatings(value);
    
    if (value && value.length > 0) {
        scrollToShows();
    }
  };

  return (
    <Router>
      <div className={`${isContrastMode ? 'high-contrast' : ''}`}> 
        
        <Navbar 
            filterCities={filterCities}         
            filterRatings={filterRatings}     
            onFilterChange={handleFilterChange} 
            onToggleDrawer={toggleDrawer}
            onToggleContrast={toggleContrastMode} 
            isContrastMode={isContrastMode}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
        />

        <div className="parallax-background"></div>
        
        <div className="relative z-10 min-h-screen flex flex-col">
            <main className="flex-grow">
              <Routes>
                <Route
                  path="/"
                  element={
                    <Home
                      filterCities={filterCities}    
                      filterRatings={filterRatings}  
                      onFilterChange={handleFilterChange}
                      searchTerm={searchTerm} 
                    />
                  }
                />
                <Route path="/shows/:showSlug" element={<ShowDetails />} />
                <Route path="/checkout/:showSlug" element={<Checkout />} />
                <Route path="/success" element={<OrderSuccess />} />
              </Routes>
            </main>
            
            <Footer />

            <div className="drawer drawer-end fixed top-0 left-0 w-full h-full z-[9999] pointer-events-none"> 
                <input 
                    id="drawer-filter" 
                    type="checkbox" 
                    className="drawer-toggle" 
                    checked={isDrawerOpen}
                    onChange={toggleDrawer}
                />
            
                <div className="drawer-content"></div>

                <div className="drawer-side z-50 pointer-events-auto">
                    <label 
                        htmlFor="drawer-filter" 
                        aria-label="close sidebar" 
                        className="drawer-overlay"
                    ></label>
                    {/* 🎯 AJUSTE AQUI: Adicionado 'pt-24'
                        A Navbar tem h-20 (80px). O pt-24 (96px) empurra o conteúdo 
                        da sidebar para baixo, evitando que o cabeçalho o cubra.
                    */}
                    <div className="w-80 min-h-full bg-zinc-900 text-white flex flex-col pt-24 shadow-2xl">
                        <div className="p-0 h-full">
                            <FilterSidebar 
                                onFilterChange={handleFilterChange}
                                currentFilters={{ city: filterCities, rating: filterRatings }}
                                onClose={toggleDrawer} 
                            />
                        </div>
                    </div>
                </div>
            </div> 
        </div> 
      </div> 
    </Router>
  );
}