import { SpecialZoomLevel, Viewer, Worker } from "@react-pdf-viewer/core";
import {
  defaultLayoutPlugin,
  ToolbarSlot,
  ToolbarProps,
} from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { ReactElement } from "react";

export default function SheetViewer({ url }: { url: string }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
    renderToolbar,
  });

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div className="rpv-core__viewer border rounded-md relative h-[600px] overflow-auto">
        <Viewer
          fileUrl={url}
          defaultScale={SpecialZoomLevel.PageFit}
          plugins={[
            // Register plugins
            defaultLayoutPluginInstance,
          ]}
        />
      </div>
    </Worker>
  );
}

const renderToolbar = (Toolbar: (props: ToolbarProps) => ReactElement) => (
  <Toolbar>
    {(slots: ToolbarSlot) => {
      const { Zoom, ZoomIn, ZoomOut } = slots;
      return (
        <div
          style={{
            justifyItems: "center",
            display: "flex",
            width: "100%",
            alignItems: "center",
          }}
        >
          <div style={{ padding: "0px 2px" }}>
            <ZoomOut />
          </div>
          <div style={{ padding: "0px 2px" }}>
            <Zoom />
          </div>
          <div style={{ padding: "0px 2px" }}>
            <ZoomIn />
          </div>
        </div>
      );
    }}
  </Toolbar>
);
