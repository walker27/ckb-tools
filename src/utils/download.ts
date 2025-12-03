

export default function download(fileName: string, content: Blob | string, mimeType: string = 'text/plain') {

  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}