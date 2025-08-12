import React, { useEffect, useMemo } from 'react';
import styles from '../style/MCDA.module.css';

const FileSelector = ({
  availableFiles,
  selectedFile,
  onFileSelect,
  onRefresh,
  label = 'Select Excel File',
  loading = false, // Pass loading state from parent if needed
}) => {
  // 1) Fallback for null/undefined
  const files = useMemo(
    () => (Array.isArray(availableFiles) ? availableFiles : []),
    [availableFiles]
  );
  const hasFiles = files.length > 0;

  // 2) Controlled value fix: if selectedFile is not in the list, use empty string to avoid controlled component warning
  const valueInList = hasFiles && selectedFile && files.includes(selectedFile);
  const selectValue = valueInList ? selectedFile : '';

  // 3) When files first become available, auto-select the first one to avoid empty value issues
  useEffect(() => {
    if (hasFiles && !valueInList) {
      onFileSelect?.(files[0]);
    }
  }, [hasFiles, valueInList, files, onFileSelect]);

  return (
    <div className={styles.fileSelector}>
      <div className={styles.fileSelectorHeader}>
        <label htmlFor="fileSelect" className={styles.fileSelectorLabel}>
          {label}
        </label>
        <button
          type="button"
          onClick={() => onRefresh?.()}
          className={styles.refreshButton}
        >
          Refresh Files
        </button>
      </div>

      <select
        id="fileSelect"
        value={selectValue}
        onChange={(e) => onFileSelect?.(e.target.value)}
        className={styles.fileInput}
        disabled={!hasFiles || loading}
      >
        {!hasFiles ? (
          <option value="">
            {loading ? 'Loading files...' : 'No files found'}
          </option>
        ) : (
          files.map((file) => (
            <option key={file} value={file}>
              {file.replace(/\.(xlsx|xls)$/i, '')}
            </option>
          ))
        )}
      </select>

      {/* Info message */}
      {!hasFiles && (
        <p className={styles.loadingMessage}>
          {loading ? 'Scanning Excel files in data folder...' : 'No Excel files detected.'}
        </p>
      )}
      {hasFiles && (
        <p className={styles.successMessage}>
          Found {files.length} Excel file{files.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

export default FileSelector;
