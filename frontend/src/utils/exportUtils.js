import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportAsPNG() {
  const element = document.querySelector('.react-flow');
  if (!element) return;
  const canvas = await html2canvas(element, { backgroundColor: '#0a0a12', scale: 2 });
  const link = document.createElement('a');
  link.download = 'family-tree.png';
  link.href = canvas.toDataURL();
  link.click();
}

export async function exportAsPDF() {
  const element = document.querySelector('.react-flow');
  if (!element) return;
  const canvas = await html2canvas(element, { backgroundColor: '#0a0a12', scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width / 2, canvas.height / 2] });
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
  pdf.save('family-tree.pdf');
}

export function exportAsJSON(tree) {
  const data = JSON.stringify(tree, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${tree.title || 'family-tree'}.json`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}
