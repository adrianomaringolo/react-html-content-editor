import { useState, type ReactElement } from "react";
import { version } from "react-html-content-editor";
import { QuickStartExample } from "./examples/QuickStartExample";
import BasicExample from "./examples/BasicExample";
import FullscreenExample from "./examples/FullscreenExample";
import AutoSaveExample from "./examples/AutoSaveExample";
import ThemeExample from "./examples/ThemeExample";
import ErrorHandlingExample from "./examples/ErrorHandlingExample";
import { WysiwygExample } from "./examples/WysiwygExample";
import { CompositionExample } from "./examples/CompositionExample";
import "./App.css";

type ExampleTab =
  | "quickstart"
  | "basic"
  | "wysiwyg"
  | "composition"
  | "fullscreen"
  | "autosave"
  | "theme"
  | "error";

type NavItem = {
  id: ExampleTab;
  label: string;
  icon: string;
  tag?: string;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const NAV: NavGroup[] = [
  {
    title: "Getting started",
    items: [{ id: "quickstart", label: "Quick Start", icon: "🚀" }],
  },
  {
    title: "Examples",
    items: [
      { id: "basic", label: "Basic Usage", icon: "📝" },
      { id: "wysiwyg", label: "WYSIWYG", icon: "🎨", tag: "NEW" },
      { id: "composition", label: "Composition", icon: "🧩", tag: "NEW" },
      { id: "fullscreen", label: "Fullscreen Mode", icon: "🖥️" },
      { id: "autosave", label: "Auto-Save", icon: "⚡" },
      { id: "theme", label: "Themes", icon: "🎭" },
      { id: "error", label: "Error Handling", icon: "🛡️" },
    ],
  },
];

const PANELS: Record<ExampleTab, ReactElement> = {
  quickstart: <QuickStartExample />,
  basic: <BasicExample />,
  wysiwyg: <WysiwygExample />,
  composition: <CompositionExample />,
  fullscreen: <FullscreenExample />,
  autosave: <AutoSaveExample />,
  theme: <ThemeExample />,
  error: <ErrorHandlingExample />,
};

const REPO = "https://github.com/adrianomaringolo/react-html-content-editor";
const NPM = "https://www.npmjs.com/package/react-html-content-editor";

function App() {
  const [activeTab, setActiveTab] = useState<ExampleTab>("quickstart");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <div className='app' data-theme={theme}>
      <header className='topbar'>
        <div className='topbar__brand'>
          <span className='brand-mark' aria-hidden='true'>
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor'>
              <path
                d='M9 7.5 5.25 12 9 16.5'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M15 7.5 18.75 12 15 16.5'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <rect
                x='11.4'
                y='8.6'
                width='1.2'
                height='6.8'
                rx='0.6'
                fill='currentColor'
                stroke='none'
                opacity='0.9'
              />
            </svg>
          </span>
          <span className='brand-name'>React HTML Content Editor</span>
          <span className='version-badge'>v{version}</span>
        </div>

        <div className='topbar__actions'>
          <a
            className='icon-link'
            href={NPM}
            target='_blank'
            rel='noopener noreferrer'
          >
            <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
              <path d='M2 4h20v16h-8v-3h-3v3H2V4Zm3 3v10h3V9h3v8h3V7H5Zm11 0v7h2V9h1v5h2V7h-5Z' />
            </svg>
            <span className='icon-link__label'>npm</span>
          </a>
          <a
            className='icon-link'
            href={REPO}
            target='_blank'
            rel='noopener noreferrer'
          >
            <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
              <path d='M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49l-.01-1.7c-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.59.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z' />
            </svg>
            <span className='icon-link__label'>GitHub</span>
          </a>
          <button
            className='theme-toggle'
            type='button'
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            {theme === "light" ? (
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' aria-hidden='true'>
                <path
                  d='M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            ) : (
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' aria-hidden='true'>
                <g
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <circle cx='12' cy='12' r='4' />
                  <path d='M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4' />
                </g>
              </svg>
            )}
          </button>
        </div>
      </header>

      <div className='layout'>
        <aside className='sidebar'>
          <nav aria-label='Examples'>
            {NAV.map((group) => (
              <div className='nav-group' key={group.title}>
                <p className='nav-group__title'>{group.title}</p>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    className={`nav-item${activeTab === item.id ? " active" : ""}`}
                    onClick={() => setActiveTab(item.id)}
                    aria-current={activeTab === item.id ? "page" : undefined}
                  >
                    <span className='nav-item__icon' aria-hidden='true'>
                      {item.icon}
                    </span>
                    {item.label}
                    {item.tag && <span className='nav-item__tag'>{item.tag}</span>}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        <main className='content'>
          <div className='content__inner'>
            <div className='panel' key={activeTab}>
              {PANELS[activeTab]}
            </div>
          </div>

          <footer className='app-footer'>
            <div className='app-footer__inner'>
              <p>Built with React and Monaco Editor · MIT License</p>
              <p className='app-footer__credit'>
                created with <span aria-label='love'>❤️</span> by{" "}
                <a
                  href='https://adrianomaringolo.dev'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  adrianomaringolo.dev
                </a>
              </p>
              <div className='app-footer__links'>
                <a href={REPO} target='_blank' rel='noopener noreferrer'>
                  GitHub
                </a>
                <a href={NPM} target='_blank' rel='noopener noreferrer'>
                  npm
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
