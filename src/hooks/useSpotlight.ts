import { useState, useEffect, useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';
import { SpotlightItem, UseSpotlightReturn } from '../types';

const RECENT_ITEMS_KEY = 'spotlight-recent-items';
const MAX_RECENT_ITEMS = 6;

export const useSpotlight = (
  items: SpotlightItem[],
  onSelect: (item: SpotlightItem) => void,
  maxResults: number = 8
): UseSpotlightReturn => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentItems, setRecentItems] = useState<SpotlightItem[]>([]);

  // Load recent items from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_ITEMS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SpotlightItem[];
        setRecentItems(parsed);
      }
    } catch (error) {
      console.warn('Failed to load recent items:', error);
    }
  }, []);

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: [
        { name: 'name', weight: 0.7 },
        { name: 'tags', weight: 0.3 }
      ],
      threshold: 0.3,
      ignoreLocation: true,
      includeScore: true
    });
  }, [items]);

  // Get autocomplete suggestion from first match
  const autocompleteSuggestion = useMemo(() => {
    if (!query.trim()) return '';
    
    const results = fuse.search(query);
    if (results.length > 0) {
      const firstMatch = results[0].item.name;
      if (firstMatch.toLowerCase().startsWith(query.toLowerCase())) {
        return firstMatch.slice(query.length);
      }
    }
    return '';
  }, [query, fuse]);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return recentItems.slice(0, Math.min(maxResults, MAX_RECENT_ITEMS));
    }

    const results = fuse.search(query);
    return results
      .slice(0, maxResults)
      .map(result => result.item);
  }, [query, fuse, recentItems, maxResults]);

  // Reset selected index when filtered items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  // Save item to recent items
  const saveToRecent = useCallback((item: SpotlightItem) => {
    setRecentItems(prev => {
      // Remove item if it already exists
      const filtered = prev.filter(recent => recent.id !== item.id);
      // Add to beginning and limit to MAX_RECENT_ITEMS
      const updated = [item, ...filtered].slice(0, MAX_RECENT_ITEMS);
      
      try {
        localStorage.setItem(RECENT_ITEMS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save recent items:', error);
      }
      
      return updated;
    });
  }, []);

  // Handle item selection
  const handleSelect = useCallback((item: SpotlightItem) => {
    saveToRecent(item);
    
    // If item has its own onClick handler, use it; otherwise use the global onSelect
    if (item.onClick) {
      item.onClick(item);
    } else {
      onSelect(item);
    }
    
    setQuery('');
  }, [onSelect, saveToRecent]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredItems.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex]);
        }
        break;
      case 'Tab':
        e.preventDefault();
        if (autocompleteSuggestion) {
          setQuery(query + autocompleteSuggestion);
        }
        break;
      case 'ArrowRight':
        if (autocompleteSuggestion && (e.target as HTMLInputElement).selectionStart === query.length) {
          e.preventDefault();
          setQuery(query + autocompleteSuggestion);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setQuery('');
        break;
    }
  }, [filteredItems, selectedIndex, handleSelect, autocompleteSuggestion, query]);

  return {
    query,
    setQuery,
    filteredItems,
    recentItems,
    selectedIndex,
    setSelectedIndex,
    handleSelect,
    handleKeyDown,
    autocompleteSuggestion
  };
};