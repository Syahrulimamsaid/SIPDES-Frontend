# Laporan Presence Range Filter Walkthrough

The presence report has been updated to filter by a single date range picker instead of separate Month and Year dropdowns.

---

## Changes Made

### 1. Date Range Filter
- Replaced the Month/Year dropdown selections with a single `DatePicker` in range mode (`mode="range"`), labeled **Periode Range Tanggal**.
- When the user selects a range, the start and end dates are saved.

### 2. Client-Side Aggregation
- Finds all covered months within the date range and calls the `ReportController.presence` API in parallel.
- Aggregates the results per village apparatus:
  - **Hadir Tepat Waktu**, **Terlambat**, **Cuti / Izin**, and **Alpa** are summed.
  - **Persentase Kehadiran** is averaged across the covered months.
  - The stats cards at the top dynamically calculate values based on the aggregated data.

### 3. Filters Layout
- Organized as a single grid row containing the **Periode Range Tanggal**, **Perangkat Desa**, and **Reset Filter** button.
