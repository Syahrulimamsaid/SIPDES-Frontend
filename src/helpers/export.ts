
export interface ExportColumn<T = any> {
  header: string;
  key?: string; // nested path key like 'user.fullname' or 'alpa'
  valueGetter?: (row: T, index: number) => any; // custom formatting function
}

export class Export {
  static excel = async <T = any>(
    data: T[],
    columns: ExportColumn<T>[],
    filename: string = "export"
  ): Promise<boolean> => {
    // Helper to get nested properties
    const getNestedValue = (obj: any, path: string): any => {
      if (!path) return undefined;
      return path.split('.').reduce((acc, part) => {
        return acc && acc[part] !== undefined ? acc[part] : undefined;
      }, obj);
    };

    // Helper to escape CSV cell values
    const escapeCSVValue = (val: any): string => {
      if (val === null || val === undefined) {
        return '""';
      }
      const str = String(val);
      return `"${str.replace(/"/g, '""')}"`;
    };

    // Construct headers
    const headersRow = columns.map(col => escapeCSVValue(col.header)).join(",");

    // Construct rows
    const dataRows = data.map((row, index) => {
      return columns.map(col => {
        let val: any = "";
        if (col.valueGetter) {
          val = col.valueGetter(row, index);
        } else if (col.key) {
          val = getNestedValue(row, col.key);
        }
        return escapeCSVValue(val);
      }).join(",");
    });

    // Combine content with BOM and excel separator line
    const csvContent = [
      "sep=,",
      headersRow,
      ...dataRows
    ].join("\r\n");

    const finalFilename = filename.toLowerCase().endsWith(".csv") ? filename : `${filename}.csv`;

    // Try modern File System Access API if supported (Chrome, Edge, Opera)
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: finalFilename,
          types: [{
            description: 'CSV File (Excel compatible)',
            accept: { 'text/csv': ['.csv'] }
          }]
        });
        const writable = await handle.createWritable();
        await writable.write("\uFEFF" + csvContent);
        await writable.close();
        return true; // Successfully saved
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // User clicked cancel in the save dialog
          return false;
        }
        // If other error, fallback to legacy download method
      }
    }

    // Fallback: Legacy link click method (Firefox, Safari, old browsers)
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", finalFilename);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true; // Resolved immediately for fallback method
  };
}