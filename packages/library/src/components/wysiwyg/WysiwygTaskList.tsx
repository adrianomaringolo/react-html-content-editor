import React, { useEffect } from "react";
import { ListTodo } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import { useWysiwygContext } from "./context";
import type { NamedControlProps } from "./types";

/** Empty task list inserted at the caret (one unchecked item). */
const TASK_LIST_HTML =
  '<ul data-wysiwyg-task-list="true"><li><br></li></ul><p><br></p>';

/**
 * Insert a task list (checklist) and toggle its items.
 *
 * The checkbox is drawn from CSS in the list's left gutter, so pressing Enter
 * continues the list with a fresh unchecked item — no interactive form control
 * is embedded in the content. Clicking an item's checkbox toggles its
 * `data-checked` attribute (which is what persists in the emitted HTML).
 *
 * The toggle handler is attached while this control is mounted; include it in
 * the toolbar for task lists to be interactive.
 */
export const WysiwygTaskList: React.FC<NamedControlProps> = ({
  className,
  title = "Task list",
}) => {
  const { exec, editorRef, commit } = useWysiwygContext();

  // Toggle an item when its checkbox (the list's left gutter) is clicked.
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const li = target?.closest?.("li") ?? null;
      const list = li?.parentElement;
      if (!li || !list?.hasAttribute("data-wysiwyg-task-list")) return;
      const rect = li.getBoundingClientRect();
      const gutter = parseFloat(getComputedStyle(li).paddingLeft) || 26;
      // Only the checkbox gutter toggles; the rest of the row stays editable.
      if (e.clientX - rect.left > gutter) return;
      if (li.getAttribute("data-checked") === "true") {
        li.removeAttribute("data-checked");
      } else {
        li.setAttribute("data-checked", "true");
      }
      e.preventDefault();
      commit(el.innerHTML);
    };
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [editorRef, commit]);

  return (
    <WysiwygControl
      command='insertHTML'
      title={title}
      className={className}
      isActive={() => false}
      onActivate={() => exec("insertHTML", TASK_LIST_HTML)}
    >
      <ListTodo size={16} aria-hidden='true' />
    </WysiwygControl>
  );
};
