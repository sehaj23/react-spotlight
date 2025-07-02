import React, { useRef, useEffect } from 'react';
import { Box, InputBase, Typography, Chip, Fade, Paper } from '@mui/material';
import { Search, KeyboardReturn, Article, Dashboard, Settings, Analytics, Group, Assignment, Message, Event, Folder } from '@mui/icons-material';
import { SpotlightProps } from '../types';
import { useSpotlight } from '../hooks/useSpotlight';
import '../style.css';

const getDefaultIcon = (item: any) => {
  const name = item.name.toLowerCase();
  const tags = item.tags.join(' ').toLowerCase();
  
  if (name.includes('dashboard') || tags.includes('dashboard')) return <Dashboard />;
  if (name.includes('settings') || tags.includes('settings')) return <Settings />;
  if (name.includes('analytics') || tags.includes('analytics')) return <Analytics />;
  if (name.includes('team') || name.includes('user') || tags.includes('team')) return <Group />;
  if (name.includes('project') || tags.includes('project')) return <Assignment />;
  if (name.includes('message') || tags.includes('message')) return <Message />;
  if (name.includes('calendar') || tags.includes('calendar')) return <Event />;
  if (name.includes('file') || tags.includes('file')) return <Folder />;
  return <Article />;
};

export const Spotlight: React.FC<SpotlightProps> = ({
  items,
  onSelect,
  placeholder = "Search...",
  maxResults = 8,
  showRecent = true,
  showInitialResults = true,
  className = '',
  isOpen = true,
  onClose,
  customStyles,
  theme = 'dark'
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    query,
    setQuery,
    filteredItems,
    recentItems,
    selectedIndex,
    handleSelect,
    handleKeyDown,
    autocompleteSuggestion
  } = useSpotlight(items, onSelect, maxResults);

  // Focus input when component mounts or opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Load custom styles
  useEffect(() => {
    if (customStyles) {
      const styleElement = document.createElement('style');
      if (customStyles.startsWith('http') || customStyles.endsWith('.css')) {
        // It's a URL or file path
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = customStyles;
        linkElement.className = 'spotlight-custom-styles';
        document.head.appendChild(linkElement);
        return () => {
          const existing = document.querySelector('.spotlight-custom-styles');
          if (existing) existing.remove();
        };
      } else {
        // It's CSS string
        styleElement.textContent = customStyles;
        styleElement.className = 'spotlight-custom-styles';
        document.head.appendChild(styleElement);
        return () => {
          const existing = document.querySelector('.spotlight-custom-styles');
          if (existing) existing.remove();
        };
      }
    }
  }, [customStyles]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayItems = (!query.trim() && !showInitialResults) ? [] : filteredItems;
  const showingRecent = !query.trim() && showRecent && recentItems.length > 0 && showInitialResults;

  return (
    <Fade in={isOpen}>
      <Box 
        className={`spotlight-overlay ${className}`} 
        onClick={onClose}
        data-theme={theme}
      >
        <Paper 
          className="spotlight-container" 
          elevation={0}
          onClick={e => e.stopPropagation()}
        >
          <Box className="spotlight-search">
            <Box className="spotlight-search-icon">
              <Search sx={{ fontSize: 20 }} />
            </Box>
            <Box sx={{ position: 'relative', flex: 1 }}>
              <InputBase
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="spotlight-input"
                fullWidth
                sx={{
                  fontSize: 18,
                  fontWeight: 400,
                  '& .MuiInputBase-input': {
                    padding: 0,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'
                  }
                }}
              />
              {autocompleteSuggestion && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    pointerEvents: 'none',
                    fontSize: 18,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    color: 'rgba(142, 142, 147, 0.6)',
                    whiteSpace: 'pre'
                  }}
                >
                  {query + autocompleteSuggestion}
                </Box>
              )}
            </Box>
          </Box>

          {displayItems.length > 0 && (
            <Box className="spotlight-results">
              {showingRecent && (
                <Typography className="spotlight-section-header">
                  Recently Used
                </Typography>
              )}
              
              {displayItems.map((item, index) => (
                <Box
                  key={item.id}
                  className={`spotlight-item ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => {}}
                >
                  <Box className="spotlight-item-icon">
                    {item.icon ? (
                      <img src={item.icon} alt="" className="spotlight-icon-image" />
                    ) : (
                      <Box className="spotlight-icon-placeholder">
                        {getDefaultIcon(item)}
                      </Box>
                    )}
                  </Box>
                  
                  <Box className="spotlight-item-content">
                    <Typography className="spotlight-item-name">
                      {item.name}
                    </Typography>
                  </Box>

                  <Box className="spotlight-item-shortcut">
                    {index === selectedIndex && (
                      <Chip 
                        icon={<KeyboardReturn sx={{ fontSize: 14 }} />}
                        label=""
                        size="small"
                        className="spotlight-enter-hint"
                        sx={{
                          height: 24,
                          '& .MuiChip-icon': {
                            margin: 0
                          },
                          '& .MuiChip-label': {
                            display: 'none'
                          }
                        }}
                      />
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {query.trim() && displayItems.length === 0 && (
            <Box className="spotlight-no-results">
              <Box className="spotlight-no-results-icon">
                <Search sx={{ fontSize: 48, opacity: 0.5 }} />
              </Box>
              <Typography className="spotlight-no-results-text">
                No results found
              </Typography>
              <Typography className="spotlight-no-results-suggestion">
                Try different keywords or check your spelling
              </Typography>
            </Box>
          )}

          {!query.trim() && (!showRecent || recentItems.length === 0 || !showInitialResults) && (
            <Box className="spotlight-empty-state">
              <Box className="spotlight-empty-icon">
                <Search sx={{ fontSize: 48, opacity: 0.5 }} />
              </Box>
              <Typography className="spotlight-empty-text">
                Start typing to search
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Fade>
  );
};