import { useState } from "react";
import { Highlighter, CalendarPlus, Palette } from "lucide-react";
import {
  Wysiwyg,
  WysiwygToolbar,
  WysiwygSeparator,
  WysiwygControl,
  useWysiwygContext,
  WysiwygBold,
  WysiwygItalic,
  WysiwygUnderline,
  WysiwygStrikethrough,
  WysiwygHeading,
  WysiwygParagraph,
  WysiwygBlockquote,
  WysiwygFontSize,
  WysiwygUnorderedList,
  WysiwygOrderedList,
  WysiwygAlign,
  WysiwygLink,
  WysiwygUnlink,
  WysiwygClearFormatting,
  WysiwygContent,
} from "react-html-content-editor";

/**
 * A custom toolbar control built on the generic `WysiwygControl`. It runs an
 * `execCommand` (`hiliteColor`) and provides its own `isActive` so the button
 * lights up when the selection is already highlighted.
 */
function WysiwygHighlight() {
  return (
    <WysiwygControl
      command='hiliteColor'
      value='#fde047'
      useCss
      title='Highlight'
      isActive={({ queryValue }) => {
        const color = queryValue("hiliteColor") || queryValue("backColor");
        return (
          !!color && color !== "transparent" && color !== "rgba(0, 0, 0, 0)"
        );
      }}
    >
      <Highlighter size={16} aria-hidden='true' />
    </WysiwygControl>
  );
}

/**
 * A custom control with fully bespoke behaviour. It reads the editor context
 * with `useWysiwygContext` and runs its own action through `onActivate`
 * (inheriting the toolbar button styling from `WysiwygControl`).
 */
function WysiwygInsertDate() {
  const { exec } = useWysiwygContext();
  return (
    <WysiwygControl
      command='insertText'
      title="Insert today's date"
      onActivate={() => exec("insertText", new Date().toLocaleDateString())}
    >
      <CalendarPlus size={16} aria-hidden='true' />
    </WysiwygControl>
  );
}

const TEXT_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#7c3aed"];

/**
 * A custom control that renders its own UI — not just a button. It reads
 * `exec` from context and applies a text colour via the `foreColor` command,
 * showing that a control can own local state and a popover.
 */
function WysiwygTextColor() {
  const { exec, disabled } = useWysiwygContext();
  const [open, setOpen] = useState(false);

  return (
    <span className='wysiwyg-color-control'>
      <button
        type='button'
        title='Text color'
        aria-label='Text color'
        aria-haspopup='true'
        aria-expanded={open}
        disabled={disabled}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((prev) => !prev)}
        className='wysiwyg-color-control__trigger'
      >
        <Palette size={16} aria-hidden='true' />
      </button>
      {open && (
        <div className='wysiwyg-color-control__menu' role='menu'>
          {TEXT_COLORS.map((color) => (
            <button
              key={color}
              type='button'
              role='menuitem'
              title={color}
              aria-label={`Set text color ${color}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                exec("foreColor", color, true);
                setOpen(false);
              }}
              style={{ background: color }}
              className='wysiwyg-color-control__swatch'
            />
          ))}
        </div>
      )}
    </span>
  );
}

/**
 * WYSIWYG Editor — component composition
 *
 * The editor is assembled from small, focused parts. Drop in only the
 * controls you need, arrange them in any order, and add your own with the
 * generic `WysiwygControl` building block.
 */

const INITIAL_HTML = `<h2>Compose your own editor</h2>
<p>This rich-text editor is built entirely from <strong>composable pieces</strong>. Select some text and try the toolbar — <em>bold</em>, <u>underline</u>, headings, lists, links and more.</p>
<blockquote>Only include the controls a given surface actually needs.</blockquote>
<ul>
  <li>Toggle inline styles like bold and italic</li>
  <li>Apply block formats and font sizes</li>
  <li>Build custom controls with <code>WysiwygControl</code></li>
</ul>`;

const SNIPPET = `<Wysiwyg value={html} onChange={setHtml}>
  <WysiwygToolbar>
    <WysiwygBold />
    <WysiwygItalic />
    <WysiwygUnderline />
    <WysiwygSeparator />
    <WysiwygHeading level={1} />
    <WysiwygHeading level={2} />
    <WysiwygFontSize />
    <WysiwygSeparator />
    <WysiwygUnorderedList />
    <WysiwygOrderedList />
    <WysiwygLink />
  </WysiwygToolbar>
  <WysiwygContent placeholder="Start writing…" />
</Wysiwyg>`;

const CUSTOM_SNIPPET = `import { WysiwygControl, useWysiwygContext } from "react-html-content-editor";
import { Highlighter, CalendarPlus } from "lucide-react";

// 1. Declarative — wrap any execCommand, add your own active state.
function WysiwygHighlight() {
  return (
    <WysiwygControl
      command="hiliteColor"
      value="#fde047"
      useCss
      title="Highlight"
      isActive={({ queryValue }) => {
        const color = queryValue("hiliteColor") || queryValue("backColor");
        return !!color && color !== "transparent" && color !== "rgba(0, 0, 0, 0)";
      }}
    >
      <Highlighter size={16} aria-hidden="true" />
    </WysiwygControl>
  );
}

// 2. Bespoke behaviour — read the context and run your own action.
function WysiwygInsertDate() {
  const { exec } = useWysiwygContext();
  return (
    <WysiwygControl
      command="insertText"
      title="Insert today's date"
      onActivate={() => exec("insertText", new Date().toLocaleDateString())}
    >
      <CalendarPlus size={16} aria-hidden="true" />
    </WysiwygControl>
  );
}

// 3. Own UI — a control isn't limited to a single button. Keep local state
//    and render a popover; apply the result with exec("foreColor", …).
function WysiwygTextColor() {
  const { exec } = useWysiwygContext();
  const [open, setOpen] = useState(false);
  return (
    <span className="wysiwyg-color-control">
      <button type="button" aria-label="Text color" aria-expanded={open}
        onMouseDown={(e) => e.preventDefault()} onClick={() => setOpen((o) => !o)}>
        <Palette size={16} aria-hidden="true" />
      </button>
      {open && (
        <div role="menu">
          {["#ef4444", "#3b82f6", "#7c3aed"].map((color) => (
            <button key={color} role="menuitem" style={{ background: color }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { exec("foreColor", color, true); setOpen(false); }} />
          ))}
        </div>
      )}
    </span>
  );
}

// Then drop them into the toolbar like any built-in control:
// <WysiwygToolbar> … <WysiwygHighlight /> <WysiwygInsertDate /> <WysiwygTextColor /> </WysiwygToolbar>`;

export function WysiwygExample() {
  const [html, setHtml] = useState(INITIAL_HTML);

  return (
    <div>
      <div className='example-header'>
        <h2>WYSIWYG Editor</h2>
        <p>
          A rich-text editor assembled through <strong>component composition</strong>.
          Add only the formatting controls you want — each one is an independent
          component, and you can build your own with <code>WysiwygControl</code>.
        </p>
      </div>

      <Wysiwyg value={html} onChange={setHtml}>
        <WysiwygToolbar>
          <WysiwygHeading level={1} />
          <WysiwygHeading level={2} />
          <WysiwygParagraph />
          <WysiwygSeparator />
          <WysiwygBold />
          <WysiwygItalic />
          <WysiwygUnderline />
          <WysiwygStrikethrough />
          <WysiwygFontSize />
          <WysiwygSeparator />
          <WysiwygUnorderedList />
          <WysiwygOrderedList />
          <WysiwygBlockquote />
          <WysiwygSeparator />
          <WysiwygAlign value='left' />
          <WysiwygAlign value='center' />
          <WysiwygAlign value='right' />
          <WysiwygSeparator />
          <WysiwygLink />
          <WysiwygUnlink />
          <WysiwygClearFormatting />
          <WysiwygSeparator />
          {/* Custom controls — see the "Custom control" panel below */}
          <WysiwygHighlight />
          <WysiwygInsertDate />
          <WysiwygTextColor />
        </WysiwygToolbar>
        <WysiwygContent placeholder='Start writing…' minHeight='320px' />
      </Wysiwyg>

      <div className='wysiwyg-panels'>
        <section className='wysiwyg-panel'>
          <header className='wysiwyg-panel__header'>Compose it</header>
          <pre className='wysiwyg-code'>
            <code>{SNIPPET}</code>
          </pre>
        </section>
        <section className='wysiwyg-panel'>
          <header className='wysiwyg-panel__header'>
            Custom control — Highlight &amp; Insert date
          </header>
          <pre className='wysiwyg-code'>
            <code>{CUSTOM_SNIPPET}</code>
          </pre>
        </section>
        <section className='wysiwyg-panel'>
          <header className='wysiwyg-panel__header'>Generated HTML</header>
          <pre className='wysiwyg-code'>
            <code>{html}</code>
          </pre>
        </section>
      </div>
    </div>
  );
}
