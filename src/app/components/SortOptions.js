import React, { useState, useRef, useEffect } from 'react';
import styles from './SortOptions.module.css'; // 导入 CSS 模块

const SortOptions = ({ sortOption, onSortChange }) => {
    const initialValue = sortOption ? `${sortOption.sortBy},${sortOption.sortOrder}` : 'id,desc';
    const [selectedValue, setSelectedValue] = useState(initialValue);
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);
    const optionsRef = useRef(null);

    const handleChange = (value) => {
        setSelectedValue(value);
        onSortChange(value);
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles.sortOptionsContainer}>
            <div className={styles.selectWrapper} ref={selectRef} onClick={toggleDropdown}>
                <div className={`${styles.customSelect} ${isOpen ? styles.open : ''}`}>
                    <div className={styles.customSelectTrigger}>
                        排序
                        <span className={styles.customSelectIcon}>
                            {/* 向上箭头 */}
                            <svg className={styles.arrowUp} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2v14M5 9l7-7 7 7" /> {/* 修改了这里 */}
                            </svg>
                            {/* 向下箭头 */}
                            <svg className={styles.arrowDown} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22V8m-7 7l7 7 7-7" /> {/* 修改了这里 */}
                            </svg>
                        </span>
                    </div>
                    <div
                        className={styles.customOptions}
                        ref={optionsRef}
                        style={{ display: isOpen ? 'block' : 'none' }}
                    >
                        {[
                            { label: '默认', value: 'id,desc' },
                            { label: '高优先级', value: 'priority,asc' },
                            { label: '低优先级', value: 'priority,desc' },
                            { label: '最近截止', value: 'dueDate,asc' },
                            { label: '最后截止', value: 'dueDate,desc' },
                        ].map((option) => (
                            <span
                                key={option.value}
                                className={`${styles.customOption} ${selectedValue === option.value ? styles.selected : ''}`}
                                onClick={() => handleChange(option.value)}
                            >
                                {option.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SortOptions;
