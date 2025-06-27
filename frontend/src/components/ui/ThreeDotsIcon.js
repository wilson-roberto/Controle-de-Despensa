import React from 'react';
import styles from './ThreeDotsIcon.module.css';

const ThreeDotsIcon = ({ className, onClick, testId }) => {
  return (
    <div 
      className={`${styles.threeDotsIcon} ${className || ''}`}
      onClick={onClick}
      data-testid={testId || 'three-dots-icon'}
    >
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </div>
  );
};

export default ThreeDotsIcon; 