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
  WysiwygHeadingMenu,
  WysiwygParagraph,
  WysiwygBlockquote,
  WysiwygCodeBlock,
  WysiwygHorizontalRule,
  WysiwygIndent,
  WysiwygOutdent,
  // inline
  WysiwygBold,
  WysiwygItalic,
  WysiwygUnderline,
  WysiwygStrikethrough,
  WysiwygSubscript,
  WysiwygSuperscript,
  WysiwygInlineCode,
  WysiwygFontSize,
  WysiwygFontSizeInput,
  WysiwygFontFamily,
  WysiwygTextColor,
  WysiwygClearColor,
  WysiwygHighlight,
  WysiwygEmoji,
  WysiwygSpecialChar,
  // lists
  WysiwygUnorderedList,
  WysiwygOrderedList,
  // alignment
  WysiwygAlign,
  WysiwygAlignMenu,
  // links
  WysiwygLink,
  WysiwygUnlink,
  WysiwygLinkEditor,
  // images
  WysiwygImage,
  WysiwygImageUpload,
  WysiwygImageResizer,
  // utilities
  WysiwygClearFormatting,
  WysiwygFullscreen,
  WysiwygWordCount,
} from "react-html-content-editor";
import {
  Undo2,
  Redo2,
  Heading,
  Heading1,
  Pilcrow,
  Quote,
  SquareCode,
  Minus,
  IndentIncrease,
  IndentDecrease,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Code,
  ALargeSmall,
  Ruler,
  Type,
  Baseline,
  DropletOff,
  Highlighter,
  Smile,
  Omega,
  Maximize,
  SquarePen,
  List,
  ListOrdered,
  TextAlignStart,
  TextAlignJustify,
  Link,
  Unlink,
  Image as ImageIcon,
  ImageUp,
  Scaling,
  RemoveFormatting,
  Hash,
  type LucideIcon,
} from "lucide-react";

/**
 * WYSIWYG — every control the library ships, in one toolbar.
 */

const INITIAL_HTML = `<h1>Every control, one toolbar</h1>
<p>This page mounts <strong>every</strong> ready-made WYSIWYG control so you can
try them all. Select some text and explore <em>inline styles</em>,
<u>block formats</u>, lists, alignment, links and images.</p>
<blockquote>Pick only the controls a given surface needs — they are all independent.</blockquote>
<p>Try the <a href="https://github.com/adrianomaringolo/react-html-content-editor">project link</a> — click it to open, edit or remove it.</p>
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

type ControlInfo = { icon: LucideIcon; name: string; fn: string };

const CONTROL_REFERENCE: { group: string; items: ControlInfo[] }[] = [
  {
    group: "History",
    items: [
      { icon: Undo2, name: "WysiwygUndo", fn: "Undo the last edit" },
      { icon: Redo2, name: "WysiwygRedo", fn: "Redo the last undone edit" },
    ],
  },
  {
    group: "Block",
    items: [
      { icon: Heading1, name: "WysiwygHeading", fn: "Turn the block into a heading (level 1–6)" },
      { icon: Heading, name: "WysiwygHeadingMenu", fn: "H1–H6 + paragraph grouped in one dropdown" },
      { icon: Pilcrow, name: "WysiwygParagraph", fn: "Reset the block to a paragraph" },
      { icon: Quote, name: "WysiwygBlockquote", fn: "Format the block as a quote" },
      { icon: SquareCode, name: "WysiwygCodeBlock", fn: "Format the block as a <pre> code block" },
      { icon: Minus, name: "WysiwygHorizontalRule", fn: "Insert a horizontal rule" },
      { icon: IndentIncrease, name: "WysiwygIndent", fn: "Increase block indentation" },
      { icon: IndentDecrease, name: "WysiwygOutdent", fn: "Decrease block indentation" },
    ],
  },
  {
    group: "Inline",
    items: [
      { icon: Bold, name: "WysiwygBold", fn: "Toggle bold on the selection" },
      { icon: Italic, name: "WysiwygItalic", fn: "Toggle italic on the selection" },
      { icon: Underline, name: "WysiwygUnderline", fn: "Toggle underline on the selection" },
      { icon: Strikethrough, name: "WysiwygStrikethrough", fn: "Toggle strikethrough on the selection" },
      { icon: Subscript, name: "WysiwygSubscript", fn: "Toggle subscript" },
      { icon: Superscript, name: "WysiwygSuperscript", fn: "Toggle superscript" },
      { icon: Code, name: "WysiwygInlineCode", fn: "Wrap the selection in inline <code>" },
      { icon: ALargeSmall, name: "WysiwygFontSize", fn: "Dropdown of preset font sizes" },
      { icon: Ruler, name: "WysiwygFontSizeInput", fn: "Type an exact font size in px" },
      { icon: Type, name: "WysiwygFontFamily", fn: "Dropdown to set the font family" },
      { icon: Baseline, name: "WysiwygTextColor", fn: "Swatch picker for text color" },
      { icon: DropletOff, name: "WysiwygClearColor", fn: "Reset the text color to default" },
      { icon: Highlighter, name: "WysiwygHighlight", fn: "Swatch picker for highlight color" },
      { icon: Smile, name: "WysiwygEmoji", fn: "Insert an emoji from a picker" },
      { icon: Omega, name: "WysiwygSpecialChar", fn: "Insert a special character" },
    ],
  },
  {
    group: "Lists",
    items: [
      { icon: List, name: "WysiwygUnorderedList", fn: "Toggle a bulleted list" },
      { icon: ListOrdered, name: "WysiwygOrderedList", fn: "Toggle a numbered list" },
    ],
  },
  {
    group: "Alignment",
    items: [
      { icon: TextAlignStart, name: "WysiwygAlign", fn: "Align a block (left / center / right / justify) — one button per value" },
      { icon: TextAlignJustify, name: "WysiwygAlignMenu", fn: "One button showing the current alignment; opens a picker" },
    ],
  },
  {
    group: "Links",
    items: [
      { icon: Link, name: "WysiwygLink", fn: "Wrap the selection in a link" },
      { icon: Unlink, name: "WysiwygUnlink", fn: "Remove the link from the selection" },
      { icon: SquarePen, name: "WysiwygLinkEditor", fn: "Click a link to open / edit / remove it" },
    ],
  },
  {
    group: "Images",
    items: [
      { icon: ImageIcon, name: "WysiwygImage", fn: "Insert an image as base64 or by URL" },
      { icon: ImageUp, name: "WysiwygImageUpload", fn: "Upload a file and insert the returned URL" },
      { icon: Scaling, name: "WysiwygImageResizer", fn: "Click an image to resize it with presets" },
    ],
  },
  {
    group: "Utilities",
    items: [
      { icon: RemoveFormatting, name: "WysiwygClearFormatting", fn: "Strip inline formatting from the selection" },
      { icon: Maximize, name: "WysiwygFullscreen", fn: "Toggle fullscreen editing" },
      { icon: Hash, name: "WysiwygWordCount", fn: "Read-only word / character counter" },
    ],
  },
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
          {/* headings 1–6 as individual buttons… */}
          <WysiwygHeading level={1} />
          <WysiwygHeading level={2} />
          <WysiwygHeading level={3} />
          <WysiwygHeading level={4} />
          <WysiwygHeading level={5} />
          <WysiwygHeading level={6} />
          {/* …and the grouped heading dropdown */}
          <WysiwygHeadingMenu />
          <WysiwygParagraph />
          <WysiwygBlockquote />
          <WysiwygCodeBlock />
          <WysiwygSeparator />
          <WysiwygBold />
          <WysiwygItalic />
          <WysiwygUnderline />
          <WysiwygStrikethrough />
          <WysiwygSubscript />
          <WysiwygSuperscript />
          <WysiwygInlineCode />
          <WysiwygSeparator />
          <WysiwygFontSize />
          <WysiwygFontSizeInput />
          <WysiwygFontFamily />
          <WysiwygTextColor />
          <WysiwygClearColor />
          <WysiwygHighlight />
          <WysiwygEmoji />
          <WysiwygSpecialChar />
          <WysiwygSeparator />
          <WysiwygUnorderedList />
          <WysiwygOrderedList />
          <WysiwygIndent />
          <WysiwygOutdent />
          <WysiwygSeparator />
          {/* individual alignment buttons… */}
          <WysiwygAlign value='left' />
          <WysiwygAlign value='center' />
          <WysiwygAlign value='justify' />
          <WysiwygAlign value='right' />
          {/* …and the grouped alignment menu (does the same, one button) */}
          <WysiwygAlignMenu />
          <WysiwygSeparator />
          <WysiwygLink />
          <WysiwygUnlink />
          <WysiwygHorizontalRule />
          <WysiwygSeparator />
          <WysiwygImage />
          <WysiwygImageUpload upload={fakeUpload} />
          <WysiwygSeparator />
          <WysiwygClearFormatting />
          <WysiwygFullscreen />
          <WysiwygWordCount />
        </WysiwygToolbar>
        <WysiwygContent placeholder='Start writing…' minHeight='340px' />
        {/* Click any image to resize it (S / M / L / reset) */}
        <WysiwygImageResizer />
        {/* Click a link to open / edit / remove it */}
        <WysiwygLinkEditor />
      </Wysiwyg>

      <div className='wysiwyg-panels'>
        <section className='wysiwyg-panel'>
          <header className='wysiwyg-panel__header'>Controls in this toolbar</header>
          <div className='controls-reference'>
            {CONTROL_REFERENCE.map((cat) => (
              <div className='controls-reference__group' key={cat.group}>
                <h4>{cat.group}</h4>
                <ul>
                  {cat.items.map(({ icon: Icon, name, fn }) => (
                    <li className='control-ref' key={name}>
                      <span className='control-ref__icon' aria-hidden='true'>
                        <Icon size={16} />
                      </span>
                      <span className='control-ref__text'>
                        <code className='control-ref__name'>{name}</code>
                        <span className='control-ref__fn'>{fn}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
