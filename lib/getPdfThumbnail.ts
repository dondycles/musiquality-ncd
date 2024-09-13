// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFJS = require("pdfjs-dist/webpack");

export async function getPdfThumbnail(pdfUrl: string) {
  const pdf = await PDFJS.getDocument(pdfUrl).promise;
  const page = await pdf.getPage(1);
  const scale = 1;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  await page.render(renderContext).promise;

  // Convert canvas to a data URL
  const imageUrl = canvas.toDataURL("image/png");

  return imageUrl;
}
