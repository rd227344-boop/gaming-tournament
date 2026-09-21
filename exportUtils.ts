import { PointTableRowData, PointTableStyleConfig } from '../types';
import { getPlacementPoints } from './tournamentUtils';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

/**
 * Clean CSV export with UTF-8 BOM so Excel opens with proper encoding
 */
export function exportPointTableToCSV(
  tournamentName: string,
  gameName: string,
  matchTitle: string,
  rows: PointTableRowData[]
): void {
  const sorted = [...rows].sort((a, b) => {
    const ptsA = (a.placePoints ?? getPlacementPoints(a.rank, gameName)) + a.kills;
    const ptsB = (b.placePoints ?? getPlacementPoints(b.rank, gameName)) + b.kills;
    return ptsB - ptsA;
  });

  const header = ['Rank', 'Squad / Team Name', 'Placement Points', 'Kills', 'Total Points'];
  const csvRows: string[][] = [
    [`TOURNAMENT: ${tournamentName}`],
    [`GAME: ${gameName}`],
    [`MATCH: ${matchTitle}`],
    [`EXPORT DATE: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`],
    [],
    header
  ];

  sorted.forEach((row, idx) => {
    const placePts = row.placePoints ?? getPlacementPoints(row.rank, gameName);
    const total = row.totalPoints ?? placePts + row.kills;
    csvRows.push([
      String(idx + 1),
      `"${row.teamName.replace(/"/g, '""')}"`,
      String(placePts),
      String(row.kills),
      String(total)
    ]);
  });

  const csvContent = '\uFEFF' + csvRows.map((r) => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = `${tournamentName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_point_table.csv`;

  triggerDownload(blob, filename);
}

/**
 * Real Excel (.xlsx) export using xlsx (SheetJS)
 */
export function exportPointTableToExcel(
  tournamentName: string,
  gameName: string,
  matchTitle: string,
  rows: PointTableRowData[]
): void {
  const sorted = [...rows].sort((a, b) => {
    const ptsA = (a.placePoints ?? getPlacementPoints(a.rank, gameName)) + a.kills;
    const ptsB = (b.placePoints ?? getPlacementPoints(b.rank, gameName)) + b.kills;
    return ptsB - ptsA;
  });

  const data = [
    { 'Standing': 'TOURNAMENT', 'Team Name': tournamentName, 'Place Points': '', 'Kills': '', 'Total Points': '' },
    { 'Standing': 'GAME', 'Team Name': gameName, 'Place Points': '', 'Kills': '', 'Total Points': '' },
    { 'Standing': 'ROUND', 'Team Name': matchTitle, 'Place Points': '', 'Kills': '', 'Total Points': '' },
    { 'Standing': 'DATE', 'Team Name': new Date().toLocaleDateString(), 'Place Points': '', 'Kills': '', 'Total Points': '' },
    { 'Standing': '', 'Team Name': '', 'Place Points': '', 'Kills': '', 'Total Points': '' },
    ...sorted.map((row, idx) => {
      const placePts = row.placePoints ?? getPlacementPoints(row.rank, gameName);
      const total = row.totalPoints ?? placePts + row.kills;
      return {
        'Standing': `#${idx + 1}`,
        'Team Name': row.teamName,
        'Place Points': placePts,
        'Kills': row.kills,
        'Total Points': total
      };
    })
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Point Table');

  const filename = `${tournamentName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_standings.xlsx`;
  XLSX.writeFile(workbook, filename);
}

/**
 * Clean, high-resolution PDF point table document
 */
export function exportPointTableToPDF(
  tournamentName: string,
  gameName: string,
  matchTitle: string,
  rows: PointTableRowData[],
  styleConfig?: PointTableStyleConfig
): void {
  const sorted = [...rows].sort((a, b) => {
    const ptsA = (a.placePoints ?? getPlacementPoints(a.rank, gameName)) + a.kills;
    const ptsB = (b.placePoints ?? getPlacementPoints(b.rank, gameName)) + b.kills;
    return ptsB - ptsA;
  });

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Dark esports aesthetic
  doc.setFillColor(10, 15, 26);
  doc.rect(0, 0, 210, 297, 'F');

  // Top header banner
  doc.setFillColor(16, 24, 39);
  doc.rect(10, 10, 190, 32, 'F');

  // Accent line
  doc.setFillColor(16, 185, 129); // Emerald
  doc.rect(10, 10, 190, 2, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(tournamentName.toUpperCase(), 15, 22);

  // Subtitle
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Official ${gameName} Standings • ${matchTitle}`, 15, 30);
  doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 15, 36);

  // Table Headers
  const startY = 50;
  doc.setFillColor(30, 41, 59);
  doc.rect(10, startY, 190, 9, 'F');

  doc.setTextColor(226, 232, 240);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('#', 15, startY + 6);
  doc.text('SQUAD / TEAM NAME', 28, startY + 6);
  doc.text('PLACE PTS', 115, startY + 6, { align: 'center' });
  doc.text('KILLS', 145, startY + 6, { align: 'center' });
  doc.text('TOTAL PTS', 180, startY + 6, { align: 'center' });

  // Rows
  let currentY = startY + 9;
  sorted.forEach((row, idx) => {
    const placePts = row.placePoints ?? getPlacementPoints(row.rank, gameName);
    const total = row.totalPoints ?? placePts + row.kills;

    // Row alternating background
    if (idx % 2 === 0) {
      doc.setFillColor(15, 23, 42);
    } else {
      doc.setFillColor(10, 15, 26);
    }
    doc.rect(10, currentY, 190, 8, 'F');

    // Winner highlight
    if (idx === 0) {
      doc.setTextColor(250, 204, 21); // Gold
      doc.setFont('helvetica', 'bold');
    } else if (idx === 1) {
      doc.setTextColor(226, 232, 240); // Silver
      doc.setFont('helvetica', 'bold');
    } else if (idx === 2) {
      doc.setTextColor(249, 115, 22); // Bronze
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setTextColor(203, 213, 225);
      doc.setFont('helvetica', 'normal');
    }

    doc.setFontSize(9);
    doc.text(String(idx + 1), 15, currentY + 5.5);
    doc.text(row.teamName.slice(0, 32), 28, currentY + 5.5);
    doc.text(String(placePts), 115, currentY + 5.5, { align: 'center' });
    doc.text(String(row.kills), 145, currentY + 5.5, { align: 'center' });
    
    // Bold total
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129); // Emerald
    doc.text(String(total), 180, currentY + 5.5, { align: 'center' });

    currentY += 8;
  });

  // Footer banner
  doc.setFillColor(15, 23, 42);
  doc.rect(10, 275, 190, 12, 'F');
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Gaming Tournament Hub • Official Fair-Play Verified Point Table Document', 15, 282);
  doc.text('Page 1 of 1', 190, 282, { align: 'right' });

  const filename = `${tournamentName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_standings.pdf`;
  doc.save(filename);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
