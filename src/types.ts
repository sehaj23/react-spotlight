export interface SpotlightItem {
  id: string;
  name: string;
  url: string;
  tags: string[];
  icon?: string;
  onClick?: (item: SpotlightItem) => void; // Custom click handler for this specific item
}

export interface SpotlightProps {
  items: SpotlightItem[];
  onSelect: (item: SpotlightItem) => void;
  placeholder?: string;
  maxResults?: number;
  showRecent?: boolean;
  showInitialResults?: boolean; // Show results before user starts typing (default: true)
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
  customStyles?: string; // Path to custom CSS file or CSS string
  theme?: 'light' | 'dark' | 'auto';
}

export interface UseSpotlightReturn {
  query: string;
  setQuery: (query: string) => void;
  filteredItems: SpotlightItem[];
  recentItems: SpotlightItem[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  handleSelect: (item: SpotlightItem) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  autocompleteSuggestion: string;
}