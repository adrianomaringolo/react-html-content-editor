import { useState } from "react";
import { version } from "react-html-content-editor";
import { QuickStartExample } from "./examples/QuickStartExample";
import BasicExample from "./examples/BasicExample";
import FullscreenExample from "./examples/FullscreenExample";
import AutoSaveExample from "./examples/AutoSaveExample";
import ThemeExample from "./examples/ThemeExample";
import ErrorHandlingExample from "./examples/ErrorHandlingExample";
import { WysiwygExample } from "./examples/WysiwygExample";
import "./App.css";

type ExampleTab =
  | "quickstart"
  | "basic"
  | "wysiwyg"
  | "fullscreen"
  | "autosave"
  | "theme"
  | "error";

function App() {
  const [activeTab, setActiveTab] = useState<ExampleTab>("quickstart");

  return (
    <div className='app'>
      <header className='app-header'>
        <h1>React HTML Content Editor</h1>
        <p className='version'>v{version}</p>
      </header>

      <nav className='app-nav'>
        <button
          className={activeTab === "quickstart" ? "active" : ""}
          onClick={() => setActiveTab("quickstart")}
        >
          🚀 Quick Start
        </button>
        <button
          className={activeTab === "basic" ? "active" : ""}
          onClick={() => setActiveTab("basic")}
        >
          Basic Usage
        </button>
        <button
          className={activeTab === "wysiwyg" ? "active" : ""}
          onClick={() => setActiveTab("wysiwyg")}
        >
          🚧 WYSIWYG (WIP)
        </button>
        <button
          className={activeTab === "fullscreen" ? "active" : ""}
          onClick={() => setActiveTab("fullscreen")}
        >
          Fullscreen Mode
        </button>
        <button
          className={activeTab === "autosave" ? "active" : ""}
          onClick={() => setActiveTab("autosave")}
        >
          Auto-Save
        </button>
        <button
          className={activeTab === "theme" ? "active" : ""}
          onClick={() => setActiveTab("theme")}
        >
          Themes
        </button>
        <button
          className={activeTab === "error" ? "active" : ""}
          onClick={() => setActiveTab("error")}
        >
          Error Handling
        </button>
      </nav>

      <main className='app-main'>
        {activeTab === "quickstart" && <QuickStartExample />}
        {activeTab === "basic" && <BasicExample />}
        {activeTab === "wysiwyg" && <WysiwygExample />}
        {activeTab === "fullscreen" && <FullscreenExample />}
        {activeTab === "autosave" && <AutoSaveExample />}
        {activeTab === "theme" && <ThemeExample />}
        {activeTab === "error" && <ErrorHandlingExample />}
      </main>

      <footer className='app-footer'>
        <p>
          Built with React and Monaco Editor • MIT License •{" "}
          <a
            href='https://github.com/yourusername/react-html-content-editor'
            target='_blank'
            rel='noopener noreferrer'
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
