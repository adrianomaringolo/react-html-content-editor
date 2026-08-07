/**
 * A ~40-line syntax highlighter, written for {@link HighlightCodeEditor}.
 *
 * It is deliberately naive: a flat scanner with no notion of nesting, so an
 * `=` in body text can read as an attribute and `a:hover` as a property. That
 * is the trade for zero dependencies and no parser — good enough to colour an
 * editing surface, not something to build a linter on.
 */

type Rule = { type: string; pattern: RegExp };

/** One highlighted run of source. `type` is `null` for unclassified text. */
export type Token = { type: string | null; text: string };

const HTML_RULES: Rule[] = [
  { type: "comment", pattern: /<!--[\s\S]*?-->/y },
  { type: "doctype", pattern: /<!DOCTYPE[^>]*>/iy },
  { type: "string", pattern: /"[^"]*"|'[^']*'/y },
  { type: "tag", pattern: /<\/?[A-Za-z][\w:.-]*|\/?>/y },
  { type: "attr", pattern: /[A-Za-z_:][\w:.-]*(?=\s*=)/y },
];

const CSS_RULES: Rule[] = [
  { type: "comment", pattern: /\/\*[\s\S]*?\*\//y },
  { type: "string", pattern: /"[^"]*"|'[^']*'/y },
  { type: "at-rule", pattern: /@[\w-]+/y },
  { type: "property", pattern: /[-\w]+(?=\s*:)/y },
  { type: "number", pattern: /-?(?:\d*\.)?\d+[a-z%]*\b|#[0-9a-f]{3,8}\b/iy },
  { type: "punctuation", pattern: /[{}:;,]/y },
];

/**
 * Splits `code` into tokens. Every character lands in exactly one token, so
 * joining the token texts reproduces the input verbatim — which is what keeps
 * the highlighted layer aligned with the textarea above it.
 */
export function tokenize(code: string, language: "html" | "css"): Token[] {
  const rules = language === "css" ? CSS_RULES : HTML_RULES;
  const tokens: Token[] = [];
  let plain = "";
  let index = 0;

  const flushPlain = () => {
    if (plain) {
      tokens.push({ type: null, text: plain });
      plain = "";
    }
  };

  while (index < code.length) {
    const match = rules.reduce<{ type: string; text: string } | null>(
      (found, rule) => {
        if (found) return found;
        rule.pattern.lastIndex = index;
        const result = rule.pattern.exec(code);
        return result ? { type: rule.type, text: result[0] } : null;
      },
      null,
    );

    if (match) {
      flushPlain();
      tokens.push(match);
      index += match.text.length;
      continue;
    }

    plain += code[index];
    index += 1;
  }

  flushPlain();
  return tokens;
}
