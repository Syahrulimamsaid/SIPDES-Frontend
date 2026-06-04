import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

export interface DropDownSearchProps<T> {
    data: T[];
    value: T | null;
    onChange: (item: T | null) => void;
    getDisplayValue: (item: T) => string;
    getSearchText?: (item: T) => string;
    renderItem: (item: T) => React.ReactNode;
    renderSelected?: (item: T) => React.ReactNode;
    label?: string;
    placeholder?: string;
    showAllOnFocus?: boolean;
    className?: string;
}

export default function DropDownSearch<T>({
    data,
    value,
    onChange,
    getDisplayValue,
    getSearchText,
    renderItem,
    renderSelected,
    label,
    placeholder = "Cari...",
    showAllOnFocus = false,
    className = "space-y-1.5 relative md:col-span-2",
}: DropDownSearchProps<T>) {
    const [inputValue, setInputValue] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (value) {
            setInputValue(getDisplayValue(value));
        } else {
            setInputValue("");
        }
    }, [value, getDisplayValue]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
                // Reset input to current selection
                if (value) {
                    setInputValue(getDisplayValue(value));
                } else {
                    setInputValue("");
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [value, getDisplayValue]);

    const filteredData = (showAllOnFocus && inputValue.trim() === "")
        ? data
        : data.filter((item) => {
            const searchText = getSearchText ? getSearchText(item) : getDisplayValue(item);
            return searchText.toLowerCase().includes(inputValue.toLowerCase());
        });

    const handleSelectItem = (item: T) => {
        onChange(item);
        setInputValue(getDisplayValue(item));
        setShowDropdown(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        setShowDropdown(true);
        if (val.trim() === "") {
            onChange(null);
        }
    };

    const shouldShowDropdown = showDropdown && (showAllOnFocus || inputValue.trim() !== "");

    return (
        <div ref={containerRef} className={className}>
            {label && (
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {label}
                </label>
            )}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setShowDropdown(true)}
                    className="pl-9 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30"
                />
            </div>

            {shouldShowDropdown && (
                <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto z-50 rounded-xl border border-gray-100 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900 divide-y divide-gray-50 dark:divide-gray-850">
                    {filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleSelectItem(item)}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between"
                            >
                                {renderItem(item)}
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-sm text-gray-400 italic">
                            Tidak ada hasil yang cocok
                        </div>
                    )}
                </div>
            )}

            {value && (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-3 py-1.5 rounded-lg w-fit mt-1.5">
                    {renderSelected ? renderSelected(value) : `Terpilih: ${getDisplayValue(value)}`}
                </div>
            )}
        </div>
    );
}