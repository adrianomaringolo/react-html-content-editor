import { useState } from "react";
import {
  Wysiwyg,
  WysiwygToolbar,
  WysiwygSeparator,
  WysiwygContent,
  // history
  WysiwygUndo,
  WysiwygRedo,
  // block
  WysiwygHeading,
  WysiwygParagraph,
  WysiwygBlockquote,
  // inline
  WysiwygBold,
  WysiwygItalic,
  WysiwygUnderline,
  WysiwygStrikethrough,
  WysiwygFontSize,
  // lists
  WysiwygUnorderedList,
  WysiwygOrderedList,
  // alignment
  WysiwygAlign,
  WysiwygAlignMenu,
  // links
  WysiwygLink,
  WysiwygUnlink,
  // images
  WysiwygImage,
  WysiwygImageUpload,
  WysiwygImageResizer,
  // utilities
  WysiwygClearFormatting,
} from "react-html-content-editor";

/**
 * WYSIWYG — every control the library ships, in one toolbar.
 */

const INITIAL_HTML = `<h1>Every control, one toolbar</h1>
<p>This page mounts <strong>every</strong> ready-made WYSIWYG control so you can
try them all. Select some text and explore <em>inline styles</em>,
<u>block formats</u>, lists, alignment, links and images.</p>
<blockquote>Pick only the controls a given surface needs — they are all independent.</blockquote>
<ol>
  <li>Undo / redo history</li>
  <li>Headings, paragraph, blockquote, font size</li>
  <li>Lists, alignment (buttons and the grouped menu)</li>
  <li>Links, images (base64 / upload) and image resizing</li>
</ol>
<p><img src="https://picsum.photos/seed/controls/640/320" alt="Click me to resize" style="width: 50%; height: auto;" /></p>`;

/** Pretend to upload a file and return a hosted URL (see WysiwygImageUpload). */
function fakeUpload(file: File): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve(
          `https://picsum.photos/seed/${encodeURIComponent(file.name)}/640/360`,
        ),
      900,
    );
  });
}

const CONTROL_REFERENCE: { group: string; items: string[] }[] = [
  { group: "Layout", items: ["WysiwygToolbar", "WysiwygSeparator", "WysiwygContent"] },
  { group: "History", items: ["WysiwygUndo", "WysiwygRedo"] },
  {
    group: "Block",
    items: ["WysiwygHeading", "WysiwygParagraph", "WysiwygBlockquote"],
  },
  {
    group: "Inline",
    items: [
      "WysiwygBold",
      "WysiwygItalic",
      "WysiwygUnderline",
      "WysiwygStrikethrough",
      "WysiwygFontSize",
    ],
  },
  { group: "Lists", items: ["WysiwygUnorderedList", "WysiwygOrderedList"] },
  { group: "Alignment", items: ["WysiwygAlign", "WysiwygAlignMenu"] },
  { group: "Links", items: ["WysiwygLink", "WysiwygUnlink"] },
  {
    group: "Images",
    items: ["WysiwygImage", "WysiwygImageUpload", "WysiwygImageResizer"],
  },
  { group: "Utilities", items: ["WysiwygClearFormatting"] },
  { group: "Building block", items: ["WysiwygControl", "useWysiwygContext"] },
];

export function WysiwygControlsExample() {
  const [html, setHtml] = useState(INITIAL_HTML);

  return (
    <div>
      <div className='example-header'>
        <h2>WYSIWYG — all controls</h2>
        <p>
          Every ready-made control the library exports, mounted in a single
          toolbar. Each one is an independent component — include only the ones
          a given surface needs, or build your own with <code>WysiwygControl</code>.
        </p>
      </div>

      <Wysiwyg value={html} onChange={setHtml}>
        <WysiwygToolbar>
          <WysiwygUndo />
          <WysiwygRedo />
          <WysiwygSeparator />
          <WysiwygHeading level={1} />
          <WysiwygHeading level={2} />
          <WysiwygHeading level={3} />
          <WysiwygParagraph />
          <WysiwygBlockquote />
          <WysiwygSeparator />
          <WysiwygBold />
          <WysiwygItalic />
          <WysiwygUnderline />
          <WysiwygStrikethrough />
          <WysiwygFontSize />
          <WysiwygSeparator />
          <WysiwygUnorderedList />
          <WysiwygOrderedList />
          <WysiwygSeparator />
          {/* individual alignment buttons */}
          <WysiwygAlign value='left' />
          <WysiwygAlign value='center' />
          <WysiwygAlign value='justify' />
          <WysiwygAlign value='right' />
          {/* …and the grouped alignment menu (does the same, one button) */}
          <WysiwygAlignMenu />
          <WysiwygSeparator />
          <WysiwygLink />
          <WysiwygUnlink />
          <WysiwygSeparator />
          <WysiwygImage />
          <WysiwygImageUpload upload={fakeUpload} />
          <WysiwygSeparator />
          <WysiwygClearFormatting />
        </WysiwygToolbar>
        <WysiwygContent placeholder='Start writing…' minHeight='340px' />
        {/* Click any image to resize it (S / M / L / reset) */}
        <WysiwygImageResizer />
      </Wysiwyg>

      <div className='wysiwyg-panels'>
        <section className='wysiwyg-panel'>
          <header className='wysiwyg-panel__header'>Controls in this toolbar</header>
          <div className='controls-reference'>
            {CONTROL_REFERENCE.map((cat) => (
              <div className='controls-reference__group' key={cat.group}>
                <h4>{cat.group}</h4>
                <ul>
                  {cat.items.map((name) => (
                    <li key={name}>
                      <code>{name}</code>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
