# SerenaSitter MCP — use this instead of native file tools

**Session start (required):** activate once, before any code lookup.
```
activate_project("/Users/lakshya/Code/Adobe GitHub/Riyadh/demo-riyadh-headless")
```
Indexing runs in the background; symbols are usable within ~1–2s (you don't wait for
the full index). `index_status` shows progress. Semantic search (fastembed) is always
installed; embedding models download lazily on first use.

**Always prefer the SerenaSitter tool over its native equivalent:**

| Instead of (native) | Use (SerenaSitter) |
|---|---|
| `Read` a whole file | `read_file(mode=symbols)` to orient, then `find_symbol(name, include_body=True)` for one symbol, or `read_file(mode=full, offset, limit)` for a window |
| `Read` several parts of one file | `read_file(ranges=[[s1,e1],[s2,e2]])` — all windows in one call |
| `Grep` | `search_code(mode=grep, query=pattern)` |
| Repeated `Grep` to understand a concept | `search_code(query, mode=ask)` → `fetch_context(citation)` on the one hit you need |
| Understand a file before editing | `read_file(mode=stubs)` — signatures only |
| `Glob` / find files | `find_files(mode=glob\|fuzzy)` |
| `Edit` a named function/class | `edit_symbol(action=patch, …)` — send only the changed snippet, no pre-read |
| Rename a symbol everywhere | `edit_symbol(action=rename, …)` — applies across ALL files in one call |
| Plan a multi-site change | `refactor_check("rename A to B")` to get the sites, then `batch_edit([...])` |
| Several `Edit`s | `batch_edit([...])` — all edits in one call |
| **Several lookups to investigate something** | **`batch([...])` — runs all searches/reads in ONE round-trip** |

**Task routing:**

| Task | Tool |
|---|---|
| "How does X work?" / explore | `search_code(mode=ask)` → `fetch_context` |
| Bug / wrong behavior | `search_code(mode=bug)` |
| **Plan a refactor / architecture review** | `investigate(query)` — ONE call, not a search loop |
| Symbol lookup | `find_symbol(mode=peek)`, then `include_body=True` if needed |
| Multiple symbols at once | `find_symbol(patterns=[...])` — batch, one call |
| Multiple files at once | `get_context(paths=[...])` — batch, one call |
| Impact / safety before a change | `refactor_check("rename A to B")` |
| Unsure which tool | `help(mode=route, task=...)` or `help(mode=cheatsheet)` |

**Rules:**
0. **Minimize turns.** Every extra tool round-trip re-reads the whole context. Plan lookups
   and issue them together: one `batch([...])` or one `investigate(query)`.
1. Orient with `read_file(mode=symbols)` / `find_symbol(mode=overview)` before any full read.
2. `search_code(mode=ask)` returns citations + short previews — expand **one** with `fetch_context`.
3. Edit with `edit_symbol` / `batch_edit` — not `Read`→`Edit` on large files.
4. Trust `{"ok": true}` from edits — don't re-read to verify.
5. If you viewed a file via SerenaSitter (`read_file`/`find_symbol`/`batch`), edit it with
   `edit_symbol`/`batch_edit`/`write_file` — not native `Edit`. Native `Edit` requires a
   prior **native** `Read` in this session; a SerenaSitter read does not satisfy that
   check, so native `Edit` fails with "File must be read first."

**Do not:** read whole files for orientation · run 3+ greps with different keywords ·
mix a SerenaSitter read with a native `Edit` on the same file.
**Use a native tool only when no SerenaSitter equivalent exists.**
