import { useState, useEffect } from 'react';
import filterHeaderIcon from '../images/filter-header.svg';
import filterPlusIcon from '../images/filter-with-plus.svg';
import sortHeaderIcon from '../images/sort-header.svg';
import addIcon from '../images/add-icon.svg';
import trashIcon from '../images/trash-can-icon.svg';
import cancelIcon from '../images/cancel-icon.svg';
import sortIcon from '../images/sort-icon.svg';
import filterIcon from '../images/filter-icon.svg';
import refreshIcon from '../images/refresh-icon.svg';
import closeIcon from '../images/close.svg';
import showInfoIcon from '../images/show-info-icon.svg';
import downloadIcon from '../images/download-icon.svg';
import phoneIcon from '../images/phone-icon.svg';
import emailIcon from '../images/email-icon.svg';
import editIcon from '../images/edit-icon.svg';

const DynamicTable = ({
                          initialData = [],
                          columns = [],
                          pageSizeOptions = [3, 5, 10, 25, 50],
                          showSortPopup = true,
                          showFilterPopup = true,
                          showPagination = true,
                      }) => {
    const [data, setData] = useState(initialData);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(pageSizeOptions[0]);
    const [totalCount, setTotalCount] = useState(initialData.length);
    const [sortCriteria, setSortCriteria] = useState([]);
    const [tempSortCriteria, setTempSortCriteria] = useState([]);
    const [filterCriteria, setFilterCriteria] = useState([]);
    const [tempFilterCriteria, setTempFilterCriteria] = useState([]);
    const [isSortPopupOpen, setIsSortPopupOpen] = useState(false);
    const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);

    const applyFiltersAndSort = (dataToProcess) => {
        let result = [...dataToProcess];

        // Apply filters
        result = result.filter((item) => {
            return filterCriteria.every((filter) => {
                const { field, value, operator } = filter;
                const column = columns.find((col) => col.accessor === field);
                const itemValue =
                    column.type === 'number'
                        ? Number(item[field])
                        : column.type === 'date'
                            ? new Date(item[field])
                            : String(item[field]).toLowerCase();
                const filterValue =
                    column.type === 'number'
                        ? Number(value)
                        : column.type === 'date'
                            ? new Date(value)
                            : String(value).toLowerCase();

                if (value === '') return true;

                if (column.type === 'string') {
                    switch (operator) {
                        case 'equals':
                            return itemValue === filterValue;
                        case 'startsWith':
                            return itemValue.startsWith(filterValue);
                        case 'endsWith':
                            return itemValue.endsWith(filterValue);
                        case 'includes':
                            return itemValue.includes(filterValue);
                        default:
                            return true;
                    }
                } else if (column.type === 'number' || column.type === 'date') {
                    switch (operator) {
                        case 'equals':
                            return itemValue === filterValue;
                        case 'greater':
                            return itemValue > filterValue;
                        case 'less':
                            return itemValue < filterValue;
                        case 'greaterOrEqual':
                            return itemValue >= filterValue;
                        case 'lessOrEqual':
                            return itemValue <= filterValue;
                        default:
                            return true;
                    }
                }
                return true;
            });
        });

        // Apply sorting
        if (sortCriteria.length > 0) {
            result.sort((a, b) => {
                for (const { field, direction } of sortCriteria) {
                    const valueA =
                        columns.find((col) => col.accessor === field).type === 'number'
                            ? Number(a[field])
                            : columns.find((col) => col.accessor === field).type === 'date'
                                ? new Date(a[field])
                                : a[field];
                    const valueB =
                        columns.find((col) => col.accessor === field).type === 'number'
                            ? Number(b[field])
                            : columns.find((col) => col.accessor === field).type === 'date'
                                ? new Date(b[field])
                                : b[field];
                    if (valueA !== valueB) {
                        if (direction === 'asc') {
                            return valueA < valueB ? -1 : 1;
                        } else {
                            return valueA > valueB ? -1 : 1;
                        }
                    }
                }
                return 0;
            });
        }

        return result;
    };

    useEffect(() => {
        const filteredAndSorted = applyFiltersAndSort(initialData);
        setTotalCount(filteredAndSorted.length);
        if (showPagination) {
            const start = (currentPage - 1) * itemsPerPage;
            setData(filteredAndSorted.slice(start, start + itemsPerPage));
        } else {
            setData(filteredAndSorted);
        }
    }, [currentPage, itemsPerPage, sortCriteria, filterCriteria, initialData, showPagination]);

    const handleSortSubmit = () => {
        setSortCriteria([...tempSortCriteria]);
        setIsSortPopupOpen(false);
        setCurrentPage(1);
    };

    const handleFilterSubmit = () => {
        setFilterCriteria([...tempFilterCriteria]);
        setIsFilterPopupOpen(false);
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        const filteredAndSorted = applyFiltersAndSort(initialData);
        setTotalCount(filteredAndSorted.length);
        if (showPagination) {
            setData(filteredAndSorted.slice(0, itemsPerPage));
        } else {
            setData(filteredAndSorted);
        }
    };

    const addSortCriteria = () => {
        setTempSortCriteria((prev) => [...prev, { field: columns[0].accessor, direction: 'asc' }]);
    };

    const addFilterCriteria = () => {
        setTempFilterCriteria((prev) => [
            ...prev,
            { field: columns[0].accessor, operator: 'equals', value: '' },
        ]);
    };

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const renderCell = (row, column, rowIndex) => {
        const absoluteIndex = showPagination ? (currentPage - 1) * itemsPerPage + rowIndex : rowIndex;

        if (column.accessor === 'actions' && column.actions) {
            return (
                <div className="action-buttons">
                    {column.actions.showInfo?.enabled && (
                        <button
                            className="action-btn info-btn"
                            onClick={() => column.actions.showInfo.handler(absoluteIndex)}
                        >
                            <img src={showInfoIcon} alt="show info" />
                        </button>
                    )}
                    {column.actions.download?.enabled && (
                        <button
                            className="action-btn download-btn"
                            onClick={() => column.actions.download.handler(absoluteIndex)}
                        >
                            <img src={downloadIcon} alt="download" />
                        </button>
                    )}
                    {column.actions.call?.enabled && (
                        <button
                            className="action-btn call-btn"
                            onClick={() => column.actions.call.handler(row)}
                        >
                            <img src={phoneIcon} alt="call" />
                        </button>
                    )}
                    {column.actions.email?.enabled && (
                        <button
                            className="action-btn email-btn"
                            onClick={() => column.actions.email.handler(row)}
                        >
                            <img src={emailIcon} alt="email" />
                        </button>
                    )}
                    {column.actions.edit?.enabled && (
                        <button
                            className="action-btn edit-btn"
                            onClick={() => column.actions.edit.handler(absoluteIndex)}
                        >
                            <img src={editIcon} alt="edit" />
                        </button>
                    )}
                    {column.actions.delete?.enabled && (
                        <button
                            className="action-btn delete-btn"
                            onClick={() => column.actions.delete.handler(absoluteIndex)}
                        >
                            <img src={trashIcon} alt="delete" />
                        </button>
                    )}
                </div>
            );
        }

        if (column.accessor === 'raisedBy') {
            return (
                <>
                    <strong>{row.fullName}</strong>
                    <br />
                    <small>{row.contactMethod === 'email' ? row.email : row.phone}</small>
                </>
            );
        }

        if (column.accessor === 'ticketDetails') {
            return (
                <>
                    <strong>{row.subject}</strong>
                    <br />
                    <small>{row.message}</small>
                </>
            );
        }

        return row[column.accessor] || 'N/A';
    };

    return (
        <div className="dynamic-table-container">
            <div className="table-controls">
                {showSortPopup && (
                    <button
                        className={sortCriteria.length > 0 ? 'active-btn' : 'action-btn sort-btn'}
                        onClick={() => {
                            setTempSortCriteria([...sortCriteria]);
                            setIsSortPopupOpen(true);
                        }}
                    >
                        {sortCriteria.length > 0 ? (
                            <>
                                {sortCriteria.length} <u>Sort</u>
                                <span
                                    className="reset-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSortCriteria([]);
                                        setTempSortCriteria([]);
                                        handleRefresh();
                                    }}
                                >
                                    <img src={closeIcon} alt="close" />
                                </span>
                            </>
                        ) : (
                            <>
                                <img src={sortIcon} alt="sort" /> Sort
                            </>
                        )}
                    </button>
                )}
                {showFilterPopup && (
                    <button
                        className={filterCriteria.length > 0 ? 'active-btn' : 'action-btn filter-btn'}
                        onClick={() => {
                            setTempFilterCriteria([...filterCriteria]);
                            setIsFilterPopupOpen(true);
                        }}
                    >
                        {filterCriteria.length > 0 ? (
                            <>
                                {filterCriteria.length} <u>Filter</u>
                                <span
                                    className="reset-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFilterCriteria([]);
                                        setTempFilterCriteria([]);
                                        handleRefresh();
                                    }}
                                >
                                    <img src={closeIcon} alt="close" />
                                </span>
                            </>
                        ) : (
                            <>
                                <img src={filterIcon} alt="filter" /> Filter
                            </>
                        )}
                    </button>
                )}
                <button className="action-btn refresh-btn" onClick={handleRefresh}>
                    <img src={refreshIcon} alt="refresh" /> Refresh
                </button>
            </div>

            <table>
                <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col.accessor}>{col.header}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.length > 0 ? (
                    data.map((row, index) => (
                        <tr key={index}>
                            {columns.map((col) => (
                                <td key={col.accessor}>
                                    {renderCell(row, col, index)}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length}>No data available</td>
                    </tr>
                )}
                </tbody>
            </table>

            {showPagination && (
                <div className="pagination">
                    <button
                        className="page-btn"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(1)}
                    >
                        First page
                    </button>
                    <button
                        className="page-btn"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        className="page-btn"
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        Next
                    </button>
                    <button
                        className="page-btn"
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage(totalPages)}
                    >
                        Last page
                    </button>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size} per page
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {showSortPopup && isSortPopupOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <div className="popup-header">
                            <div className="popup-header-left">
                                <img src={sortHeaderIcon} alt="" />
                                <h3>Sort Table</h3>
                            </div>
                            <button className="cancel" onClick={() => setIsSortPopupOpen(false)}>
                                <img src={closeIcon} alt="close" />
                            </button>
                        </div>
                        <div className="sort-fields">
                            {tempSortCriteria.map((criteria, index) => (
                                <div key={index} className="sort-field">
                                    <select
                                        value={criteria.field}
                                        onChange={(e) => {
                                            const newCriteria = [...tempSortCriteria];
                                            newCriteria[index].field = e.target.value;
                                            setTempSortCriteria(newCriteria);
                                        }}
                                    >
                                        {columns
                                            .filter((col) => col.accessor !== 'actions')
                                            .map((col) => (
                                                <option key={col.accessor} value={col.accessor}>
                                                    {col.header}
                                                </option>
                                            ))}
                                    </select>
                                    <select
                                        value={criteria.direction}
                                        onChange={(e) => {
                                            const newCriteria = [...tempSortCriteria];
                                            newCriteria[index].direction = e.target.value;
                                            setTempSortCriteria(newCriteria);
                                        }}
                                    >
                                        <option value="asc">Ascending</option>
                                        <option value="desc">Descending</option>
                                    </select>
                                    <button
                                        onClick={() => {
                                            const newCriteria = [...tempSortCriteria];
                                            newCriteria.splice(index, 1);
                                            setTempSortCriteria(newCriteria);
                                        }}
                                    >
                                        <img src={trashIcon} alt="trash" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button id="add-sort" onClick={addSortCriteria}>
                            <img src={addIcon} alt="add" /> Add Sorter
                        </button>
                        <div className="popup-footer">
                            <button id="reset-sort" onClick={() => setTempSortCriteria([])}>
                                Reset Sort
                            </button>
                            <button id="submit-sort" onClick={handleSortSubmit}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showFilterPopup && isFilterPopupOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <div className="popup-header">
                            <div className="popup-header-left">
                                <img src={filterHeaderIcon} alt="" />
                                <h3>Filter Table</h3>
                            </div>
                            <button className="cancel" onClick={() => setIsFilterPopupOpen(false)}>
                                <img src={cancelIcon} alt="close" />
                            </button>
                        </div>
                        <div className="filter-fields">
                            {tempFilterCriteria.map((criteria, index) => {
                                const column = columns.find((col) => col.accessor === criteria.field);
                                let inputField;
                                if (column.accessor === 'ticketId') {
                                    inputField = (
                                        <input
                                            type="number"
                                            value={criteria.value}
                                            onChange={(e) => {
                                                const newCriteria = [...tempFilterCriteria];
                                                newCriteria[index].value = e.target.value;
                                                setTempFilterCriteria(newCriteria);
                                            }}
                                        />
                                    );
                                } else if (column.accessor === 'dateCreated') {
                                    inputField = (
                                        <input
                                            type="date"
                                            value={criteria.value}
                                            onChange={(e) => {
                                                const newCriteria = [...tempFilterCriteria];
                                                newCriteria[index].value = e.target.value;
                                                setTempFilterCriteria(newCriteria);
                                            }}
                                        />
                                    );
                                } else if (column.accessor === 'ticketDetails') {
                                    inputField = (
                                        <select
                                            value={criteria.value}
                                            onChange={(e) => {
                                                const newCriteria = [...tempFilterCriteria];
                                                newCriteria[index].value = e.target.value;
                                                setTempFilterCriteria(newCriteria);
                                            }}
                                        >
                                            <option value="">Select Subject</option>
                                            <option value="technical">Technical Issue</option>
                                            <option value="billing">Billing</option>
                                            <option value="general">General Inquiry</option>
                                        </select>
                                    );
                                } else {
                                    inputField = (
                                        <input
                                            type="text"
                                            value={criteria.value}
                                            onChange={(e) => {
                                                const newCriteria = [...tempFilterCriteria];
                                                newCriteria[index].value = e.target.value;
                                                setTempFilterCriteria(newCriteria);
                                            }}
                                        />
                                    );
                                }

                                return (
                                    <div key={index} className="filter-field">
                                        <select
                                            className="field-select"
                                            value={criteria.field}
                                            onChange={(e) => {
                                                const newCriteria = [...tempFilterCriteria];
                                                newCriteria[index].field = e.target.value;
                                                setTempFilterCriteria(newCriteria);
                                            }}
                                        >
                                            {columns
                                                .filter((col) => col.accessor !== 'actions')
                                                .map((col) => (
                                                    <option key={col.accessor} value={col.accessor}>
                                                        {col.header}
                                                    </option>
                                                ))}
                                        </select>
                                        <select
                                            value={criteria.operator}
                                            onChange={(e) => {
                                                const newCriteria = [...tempFilterCriteria];
                                                newCriteria[index].operator = e.target.value;
                                                setTempFilterCriteria(newCriteria);
                                            }}
                                        >
                                            {column.type === 'string' ? (
                                                <>
                                                    <option value="equals">Equals</option>
                                                    <option value="startsWith">Starts With</option>
                                                    <option value="endsWith">Ends With</option>
                                                    <option value="includes">Contains</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="equals">=</option>
                                                    <option value="greater">gt</option>
                                                    <option value="less">lt</option>
                                                    <option value="greaterOrEqual">≥</option>
                                                    <option value="lessOrEqual">≤</option>
                                                </>
                                            )}
                                        </select>
                                        {inputField}
                                        <button
                                            onClick={() => {
                                                const newCriteria = [...tempFilterCriteria];
                                                newCriteria.splice(index, 1);
                                                setTempFilterCriteria(newCriteria);
                                            }}
                                        >
                                            <img src={trashIcon} alt="delete" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        <button id="add-filter" onClick={addFilterCriteria}>
                            <img src={filterPlusIcon} alt="filter" /> Add Filter
                        </button>
                        <div className="popup-footer">
                            <button id="reset-filter" onClick={() => setTempFilterCriteria([])}>
                                Reset Filter
                            </button>
                            <button id="submit-filter" onClick={handleFilterSubmit}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DynamicTable;