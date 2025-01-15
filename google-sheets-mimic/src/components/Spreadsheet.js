import React, { useState } from "react";
import "./Spreadsheet.css";
import ChartComponent from "./chartComponent";


const Spreadsheet = () => {
  const [data, setData] = useState(
    Array(10)
      .fill(null)
      .map(() => Array(10).fill({ value: "", style: {} }))
  );
  const [selectedCell, setSelectedCell] = useState(null);
  const [formula, setFormula] = useState("");
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [dragStart, setDragStart] = useState(null);
  const [chartType, setChartType] = useState("bar");
  const [fontSize, setFontSize] = useState(14); // Default font size



  // Handle cell value changes
  const handleChange = (row, col, value) => {
    const updatedData = [...data];
    updatedData[row][col] = { ...updatedData[row][col], value };
    setData(updatedData);
  };

  const handleMouseDown = (row, col) => {
    setDragStart({ row, col });
  };

  const handleMouseEnter = (row, col) => {
    if (dragStart) {
      const startValue = data[dragStart.row][dragStart.col].value;
      const updatedData = [...data];
      const startRow = Math.min(dragStart.row, row);
      const endRow = Math.max(dragStart.row, row);
      const startCol = Math.min(dragStart.col, col);
      const endCol = Math.max(dragStart.col, col);

      for (let i = startRow; i <= endRow; i++) {
        for (let j = startCol; j <= endCol; j++) {
          updatedData[i][j] = { ...updatedData[i][j], value: startValue };
        }
      }

      setData(updatedData);
    }
  };

  const handleMouseUp = () => {
    setDragStart(null);
  };
  
  const applyStyle = (style) => {
    if (!selectedCell) {
      alert("Please select a cell first.");
      return;
    }
  
    const [row, col] = selectedCell;
  
    // Create a deep copy of data to avoid directly mutating the state
    const updatedData = data.map((rowData, rowIndex) =>
      rowData.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          const currentStyle = cell.style || {}; // Default to empty object if no style exists
          const updatedStyle = { ...currentStyle, ...style };
  
          // Handle font size separately
          if (style.fontSize) {
            updatedStyle.fontSize = `${style.fontSize}px`;
          }
  
          return {
            ...cell,
            style: updatedStyle,
          };
        }
        return cell; // Return unmodified cells
      })
    );
  
    setData(updatedData); // Update the state with the new data
  };
  

  // Add Row
  const addRow = () => {
    const newRow = Array(data[0].length).fill({ value: "", style: {} });
    setData([...data, newRow]);
  };

  // Add Column
  const addColumn = () => {
    const updatedData = data.map((row) => [...row, { value: "", style: {} }]);
    setData(updatedData);
  };

  // Delete Last Row
  const deleteRow = () => {
    if (data.length > 1) {
      setData(data.slice(0, -1));
    } else {
      alert("Cannot delete the last row.");
    }
  };

  // Delete Last Column
  const deleteColumn = () => {
    if (data[0].length > 1) {
      const updatedData = data.map((row) => row.slice(0, -1));
      setData(updatedData);
    } else {
      alert("Cannot delete the last column.");
    }
  };

  // Save spreadsheet to localStorage
  const saveSpreadsheet = () => {
    localStorage.setItem("spreadsheetData", JSON.stringify(data));
    alert("Spreadsheet saved successfully!");
  };

  // Load spreadsheet from localStorage
  const loadSpreadsheet = () => {
    const savedData = localStorage.getItem("spreadsheetData");
    if (savedData) {
      setData(JSON.parse(savedData));
      alert("Spreadsheet loaded successfully!");
    } else {
      alert("No saved spreadsheet found.");
    }
  };

  // Apply formula logic
  const evaluateFormula = () => {
    if (!selectedCell || !formula.startsWith("=")) return;

    const [row, col] = selectedCell;
    const command = formula.slice(1).toUpperCase();

    try {
      if (command.startsWith("SUM")) {
        const range = command.match(/\((.*)\)/)[1];
        const values = extractValuesFromRange(range);
        updateCellValue(row, col, values.reduce((a, b) => a + b, 0));
      } else if (command.startsWith("AVERAGE")) {
        const range = command.match(/\((.*)\)/)[1];
        const values = extractValuesFromRange(range);
        updateCellValue(row, col, values.reduce((a, b) => a + b, 0) / values.length);
      } else if (command.startsWith("MAX")) {
        const range = command.match(/\((.*)\)/)[1];
        const values = extractValuesFromRange(range);
        updateCellValue(row, col, Math.max(...values));
      } else if (command.startsWith("MIN")) {
        const range = command.match(/\((.*)\)/)[1];
        const values = extractValuesFromRange(range);
        updateCellValue(row, col, Math.min(...values));
      } else if (command.startsWith("COUNT")) {
        const range = command.match(/\((.*)\)/)[1];
        const values = extractValuesFromRange(range);
        updateCellValue(row, col, values.length);
      }
    } catch (error) {
      alert("Invalid formula syntax.");
    }
  };

  const extractValuesFromRange = (range) => {
    const [start, end] = range.split(":");
    const startRow = parseInt(start[1]) - 1;
    const startCol = start.charCodeAt(0) - 65;
    const endRow = parseInt(end[1]) - 1;
    const endCol = end.charCodeAt(0) - 65;

    const values = [];
    for (let i = startRow; i <= endRow; i++) {
      for (let j = startCol; j <= endCol; j++) {
        const value = parseFloat(data[i][j].value);
        if (!isNaN(value)) values.push(value);
      }
    }
    return values;
  };

  const updateCellValue = (row, col, value) => {
    const updatedData = [...data];
    updatedData[row][col] = { ...updatedData[row][col], value: String(value) };
    setData(updatedData);
  };

  // Data Quality Functions
  const applyTrim = () => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    const updatedData = [...data];
    updatedData[row][col].value = updatedData[row][col].value.trim();
    setData(updatedData);
  };

  const applyUpper = () => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    const updatedData = [...data];
    updatedData[row][col].value = updatedData[row][col].value.toUpperCase();
    setData(updatedData);
  };

  const applyLower = () => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    const updatedData = [...data];
    updatedData[row][col].value = updatedData[row][col].value.toLowerCase();
    setData(updatedData);
  };

  const removeDuplicates = () => {
    const uniqueRows = Array.from(new Set(data.map((row) => JSON.stringify(row)))).map((row) =>
      JSON.parse(row)
    );
    setData(uniqueRows);
  };

  const findAndReplace = () => {
    const updatedData = data.map((row) =>
      row.map((cell) => {
        if (cell.value.includes(findText)) {
          return { ...cell, value: cell.value.replace(findText, replaceText) };
        }
        return cell;
      })
    );
    setData(updatedData);
  };

  return (
    <div className="spreadsheet-container">
      {/* Toolbar */}
      <div className="toolbar">
            <div className="toolbar">
                <button onClick={() => applyStyle({ fontWeight: "bold" })}>Bold</button>
                <button onClick={() => applyStyle({ fontStyle: "italic" })}>Italic</button>
                {/* Dynamic Font Size Selector */}
                <select
                    id="fontSizeSelector"
                    value={fontSize} // State for dynamic font size
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    style={{
                    padding: "5px",
                    fontSize: "14px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    marginRight: "7px",
                    }}
                >
                  {[...Array(19)].map((_, i) => (
                    <option key={i + 2} value={i + 2}>
                      {i + 2}px
                    </option>
                  ))}
                </select>
                <button onClick={(fontSize) => applyStyle({ fontSize: `${fontSize}px` })}>
                    Apply Font Size
                </button>

                {/* Existing Buttons */}
                <button onClick={addRow}>Add Row</button>
                <button onClick={addColumn}>Add Column</button>
                <button onClick={deleteRow}>Delete Row</button>
                <button onClick={deleteColumn}>Delete Column</button>
                <button onClick={applyTrim}>Trim</button>
                <button onClick={applyUpper}>Uppercase</button>
                <button onClick={applyLower}>Lowercase</button>
                <button onClick={removeDuplicates}>Remove Duplicates</button>
                <button onClick={saveSpreadsheet}>Save</button>
                <button onClick={loadSpreadsheet}>Load</button>
        </div>
      </div>

      {/* Find and Replace */}
      <div className="find-replace">
        <input
          type="text"
          placeholder="Find"
          value={findText}
          onChange={(e) => setFindText(e.target.value)}
        />
        <input
          type="text"
          placeholder="Replace"
          value={replaceText}
          onChange={(e) => setReplaceText(e.target.value)}
        />
        <button onClick={findAndReplace}>Find & Replace</button>
      </div>

        <input
          type="text"
          placeholder="Enter formula (e.g., =SUM(A1:A5))"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
        />
        <button onClick={evaluateFormula}>Apply Formula</button>
        <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            style={{
            padding: "8px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginLeft: "10px",
            }}
        >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
        </select>

      {/* Spreadsheet Grid */}
      <div className="spreadsheet">
        <div className="grid-header">
            <div className="grid-header-cell"></div> {/* Empty cell for the top-left corner */}
            {data[0].map((_, colIndex) => (
                <div key={colIndex} className="grid-header-cell horizontal">
                    {String.fromCharCode(65 + colIndex)} {/* A, B, C, etc. */}
                </div>
            ))}
        </div>
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            <div className="grid-header-cell">{rowIndex + 1}</div>
            {row.map((cell, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                className={`grid-cell ${selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex ? "selected" : ""}`}
                value={cell.value}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                onMouseUp={handleMouseUp}
                onFocus={() => setSelectedCell([rowIndex, colIndex])}
                onChange={(e) =>
                  handleChange(rowIndex, colIndex, e.target.value)
                }
              />
            ))}
          </div>
        ))}
      </div>
      <ChartComponent data={data} chartType={chartType} />
    </div>
  );
};

export default Spreadsheet;
