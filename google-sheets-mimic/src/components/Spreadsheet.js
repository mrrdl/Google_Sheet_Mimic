import React, { useState } from "react";
import "./Spreadsheet.css";

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

  // Handle cell value changes
  const handleChange = (row, col, value) => {
    const updatedData = [...data];
    updatedData[row][col] = { ...updatedData[row][col], value };
    setData(updatedData);
  };

  // Apply styles to selected cell
  const applyStyle = (style) => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    const updatedData = [...data];
    updatedData[row][col] = {
      ...updatedData[row][col],
      style: { ...updatedData[row][col].style, ...style },
    };
    setData(updatedData);
  };

  // Add rows/columns
  const addRow = () => {
    const newRow = Array(data[0].length).fill({ value: "", style: {} });
    setData([...data, newRow]);
  };

  const addColumn = () => {
    const updatedData = data.map((row) => [...row, { value: "", style: {} }]);
    setData(updatedData);
  };

  // Delete rows/columns
  const deleteRow = () => {
    if (data.length > 1) {
      const updatedData = data.slice(0, -1);
      setData(updatedData);
    }
  };

  const deleteColumn = () => {
    if (data[0].length > 1) {
      const updatedData = data.map((row) => row.slice(0, -1));
      setData(updatedData);
    }
  };

  // Apply formula
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

  // Data Quality Features
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
      <div className="toolbar">
        <button onClick={() => applyStyle({ fontWeight: "bold" })}>Bold</button>
        <button onClick={() => applyStyle({ fontStyle: "italic" })}>Italic</button>
        <button onClick={addRow}>Add Row</button>
        <button onClick={addColumn}>Add Column</button>
        <button onClick={deleteRow}>Delete Row</button>
        <button onClick={deleteColumn}>Delete Column</button>
        <button onClick={applyTrim}>Trim</button>
        <button onClick={applyUpper}>Uppercase</button>
        <button onClick={applyLower}>Lowercase</button>
        <button onClick={removeDuplicates}>Remove Duplicates</button>
      </div>

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

      <div className="formula-bar">
        <input
          type="text"
          placeholder="Enter formula (e.g., =SUM(A1:A5))"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
        />
        <button onClick={evaluateFormula}>Apply Formula</button>
      </div>

      <div className="grid">
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cell, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                className="grid-cell"
                style={cell.style}
                value={cell.value}
                onFocus={() => setSelectedCell([rowIndex, colIndex])}
                onChange={(e) =>
                  handleChange(rowIndex, colIndex, e.target.value)
                }
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Spreadsheet;
