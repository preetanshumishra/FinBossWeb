import { useState, useRef, useEffect } from 'react';
import '../styles/ExportMenu.css';

interface ExportMenuProps {
  onExportCSV: () => void;
  onExportPDF: () => void;
  disabled?: boolean;
}

export const ExportMenu = ({ onExportCSV, onExportPDF, disabled = false }: ExportMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleExportCSV = () => {
    onExportCSV();
    setIsOpen(false);
  };

  const handleExportPDF = () => {
    onExportPDF();
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="export-menu" ref={menuRef}>
      <button
        className={`btn-export ${isOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        disabled={disabled}
        title="Export data"
      >
        ⬇️ Export
      </button>

      {isOpen && (
        <div className="export-dropdown">
          <button
            className="export-option"
            onClick={handleExportCSV}
            disabled={disabled}
          >
            📄 Export as CSV
          </button>
          <button
            className="export-option"
            onClick={handleExportPDF}
            disabled={disabled}
          >
            📋 Export as PDF
          </button>
        </div>
      )}
    </div>
  );
};
