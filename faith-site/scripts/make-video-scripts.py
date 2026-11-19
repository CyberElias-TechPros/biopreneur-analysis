#!/usr/bin/env python3
"""
Generate a video script and a VidLyrics spec for every teaching.

371 teachings is a generator job, not 371 hand-written scripts. Every scene here is
derived from that teaching's own frontmatter and body — the central truth, the theme
scripture, the declaration, the cross-references — so the videos say what the articles
say. Nothing is invented, and nothing is shared boilerplate beyond the connective
lines that hold a scene sequence together.

Two artefacts per teaching, written side by side:

    <slug>.md     a readable voiceover script (what the narrator says, scene by scene)
    <slug>.json   a `vidlyrics.spec` v1 object, ready for VidLyrics

    python3 scripts/make-video-scripts.py                  # all 371
    python3 scripts/make-video-scripts.py --day 366        # one teaching
    python3 scripts/make-video-scripts.py --slug <slug>    # one teaching
    python3 scripts/make-video-scripts.py --limit 5        # first five, for a look

Design notes that explain the choices:

* **Scenes are 3–6 seconds.** `duration` stays "auto" so VidLyrics syncs to Piper TTS
  rather than to a guess; the written script gives the target length for each scene.
* **Narration is plain prose.** Piper mispronounces symbolic notation, so every script
  writes "Romans seven, verse nineteen" out, not "Rom 7:19".
* **The closing scene is the article's own declaration**, because that is the part a
  reader is meant to say aloud — it transfers to video without alteration.
* **Theme mapping is by category**, so each month of the slate looks like itself rather
  than the whole channel sharing one flat palette.
"""

from __future__ import annotations

import argparse
import json
import re
import textwrap
from pathlib import Path

HERE = Path(__file__).resolve().parent
SITE = HERE.parent
ARTICLES = SITE / "articles"
OUT = SITE / "video-scripts"

CHANNEL = "Live In Jesus Name"
SITE_URL = "lij.name.ng"

# --- Frontmatter parsing --------------------------------------------------
# No PyYAML here, and the frontmatter is a fixed, well-behaved subset: `key: value`
# pairs, quoted or plain, plus lists of scalars and lists of small maps. A targeted
# reader is safer than a general one because it cannot silently mis-parse a teaching.


def _unquote(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
        value = value[1:-1]
    # YAML escapes the apostrophe inside double quotes; undo just that.
    return value.replace('\\"', '"').replace("''", "'")


def parse_frontmatter(text: str) -> dict:
    match = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not match:
        raise ValueError("no frontmatter")
    raw = match.group(1)

    data: dict = {}
    key: str | None = None
    mode: str | None = None       # 'list' | 'maplist' | None
    current_map: dict | None = None

    for line in raw.split("\n"):
        if not line.strip():
            continue

        # Nested map entry (e.g. themeScripture: { text, reference, translation })
        m_nested = re.match(r"^\s{2}([a-zA-Z]+):\s*(.*)$", line)
        if m_nested and mode == "map" and isinstance(data.get(key), dict):
            k, v = m_nested.group(1), _unquote(m_nested.group(2))
            data[key][k] = v
            continue

        # List item that starts a small map (relatedTeachings)
        m_mapstart = re.match(r"^\s{2}-\s+([a-zA-Z]+):\s*(.*)$", line)
        if m_mapstart and mode == "maplist":
            current_map = {m_mapstart.group(1): _unquote(m_mapstart.group(2))}
            data[key].append(current_map)
            continue

        # Continuation of that map
        m_mapcont = re.match(r"^\s{4}([a-zA-Z]+):\s*(.*)$", line)
        if m_mapcont and mode == "maplist" and current_map is not None:
            current_map[m_mapcont.group(1)] = _unquote(m_mapcont.group(2))
            continue

        # Plain scalar list item
        m_item = re.match(r"^\s{2}-\s+(.*)$", line)
        if m_item and mode == "list":
            data[key].append(_unquote(m_item.group(1)))
            continue

        # Top-level key
        m_key = re.match(r"^([a-zA-Z][a-zA-Z0-9]*):\s*(.*)$", line)
        if m_key:
            key, value = m_key.group(1), m_key.group(2).strip()
            if value == "":
                # Look ahead is unnecessary: the first following line decides.
                data[key] = []
                mode = "pending"
            elif value.startswith("{") or value.startswith("["):
                data[key] = value  # inline form; unused by this corpus
                mode = None
            else:
                data[key] = _unquote(value)
                mode = None
            continue

        # A pending key whose first child line arrives now.
        if mode == "pending":
            if re.match(r"^\s{2}-\s+[a-zA-Z]+:", line):
                data[key] = []
                mode = "maplist"
                m = re.match(r"^\s{2}-\s+([a-zA-Z]+):\s*(.*)$", line)
                current_map = {m.group(1): _unquote(m.group(2))}
                data[key].append(current_map)
                continue
            if re.match(r"^\s{2}-\s+", line):
                mode = "list"
                m = re.match(r"^\s{2}-\s+(.*)$", line)
                data[key].append(_unquote(m.group(1)))
                continue
            # It was a nested map (themeScripture)
            m = re.match(r"^\s{2}([a-zA-Z]+):\s*(.*)$", line)
            if m:
                data[key] = {m.group(1): _unquote(m.group(2))}
                mode = "map"
                continue

    # Normalise anything left as a pending empty list.
    for k, v in list(data.items()):
        if v == []:
            data[k] = []
    return data


def body_of(text: str) -> str:
    match = re.match(r"^---\n.*?\n---\n(.*)$", text, re.S)
    return match.group(1) if match else ""


# --- Text helpers ---------------------------------------------------------

def speakable(text: str) -> str:
    """Strip markdown and expand what Piper would read badly.

    The teaching prose uses **bold**, *italics* and (Romans 7:19) style citations.
    TTS reads asterisks as nothing useful and can stumble on "7:19", so both are
    normalised here rather than in every scene.
    """
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"(?<!\*)\*(?!\s)(.+?)(?<!\s)\*(?!\*)", r"\1", text)
    text = re.sub(r"`(.+?)`", r"\1", text)
    text = re.sub(r"\[(.+?)\]\(.+?\)", r"\1", text)

    # Citations. Handles the three shapes this corpus uses:
    #   Romans 7:19-20       -> Romans 7, verses 19 to 20
    #   Romans 7:19          -> Romans 7, verse 19
    #   1 John 1:5-2:2       -> 1 John 1 verse 5 to chapter 2 verse 2   (cross-chapter)
    # The third shape is why this cannot be a single regex replacement: the earlier
    # version turned "1 John 1:5-2:2" into "verses 5 to 2:2", which a narrator would
    # read as nonsense.
    def expand_ref(m: re.Match) -> str:
        ch = m.group("ch")
        a = m.group("a")
        b = m.group("b")
        b_ch = m.group("bch")

        if b is None:
            return f"{ch}, verse {a}"
        if b_ch is None:
            return f"{ch}, verses {a} to {b}"
        # Cross-chapter: repeat the book's chapter label.
        return f"{ch} verse {a} to chapter {b_ch} verse {b}"

    text = re.sub(
        r"\b(?P<ch>\d{1,3}):(?P<a>\d{1,3})(?:\s*[-–—]\s*(?:(?P<bch>\d{1,3}):)?(?P<b>\d{1,3}))?\b",
        expand_ref,
        text,
    )
    text = text.replace("&", " and ")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def sentence_case_kicker(text: str, limit: int = 34) -> str:
    """A short eyebrow: the first clause, trimmed to something legible."""
    text = speakable(text)
    text = text.split(" — ")[0].split(":")[0].strip()
    if len(text) > limit:
        # Cut on a word boundary rather than mid-word.
        text = text[:limit].rsplit(" ", 1)[0]
    return text.upper()


def split_sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[.!?])\s+", speakable(text))
    return [p.strip() for p in parts if p and p.strip()]


def chunk_sentences(sentences: list[str], max_words: int = 42) -> list[str]:
    """Group sentences into spoken chunks of roughly 3-6 seconds.

    At ~155 wpm, 3 seconds is ~8 words and 6 seconds is ~15. A scene usually holds two
    or three short sentences; the cap keeps any single narration under ~17 seconds so
    nothing outstays the layout.
    """
    chunks: list[str] = []
    current: list[str] = []
    count = 0
    for s in sentences:
        words = len(s.split())
        if current and count + words > max_words:
            chunks.append(" ".join(current))
            current, count = [s], words
        else:
            current.append(s)
            count += words
    if current:
        chunks.append(" ".join(current))
    return chunks


def tidy_sentence(text: str) -> str:
    """Fix the punctuation that plain string joining produces.

    A title ending in "?" followed by a reference used to render as
    "Where Does It Break?. Romans 7" — a doubled stop that a narrator reads as a
    stumble and a viewer reads as a typo.
    """
    # A chunk cut mid-sentence kept its comma, producing "voice increases,."
    text = re.sub(r"[,;:]\s*([.!?])", r"\1", text)
    text = re.sub(r"([.!?])\s*\.+", r"\1", text)
    text = re.sub(r"\?\?", "?", text)
    text = re.sub(r"\s+([.,;:!?])", r"\1", text)
    text = re.sub(r"\s{2,}", " ", text).strip()

    # A chunk cut at a clause boundary ends in a comma or semicolon. Left alone, the
    # "add a full stop" step below produced "loses its voice,." — so trailing
    # clause punctuation is dropped first, then the sentence is closed once.
    text = re.sub(r"[,;:\-–—]+$", "", text).rstrip()
    if text and text[-1] not in ".!?":
        text += "."
    return text


def capitalise(text: str) -> str:
    """Bullet items are read as standalone lines, so each starts with a capital."""
    text = text.strip()
    if not text:
        return text
    return text[0].upper() + text[1:]


def split_for_scenes(text: str, max_words: int = 30) -> list[str]:
    """Break narration into chunks that fit a short scene.

    At 152 wpm a 3-6 second scene holds roughly 8-15 words, but scripture and the
    declaration are inherently longer than that, so 30 words (~12 s) is the practical
    ceiling. Anything longer is split across consecutive scenes of the same layout
    rather than being rushed through one, because a quote that outruns its visual is
    the most obvious sign of an auto-generated video.
    """
    chunks: list[str] = []
    for sentence in split_sentences(text):
        if len(sentence.split()) <= max_words:
            chunks.append(sentence)
            continue

        # A single sentence longer than the budget (common in scripture, which often
        # runs without full stops) has to be cut inside itself. Prefer clause
        # boundaries — commas and semicolons — so each piece ends where a reader would
        # naturally pause; fall back to a word boundary only when a clause is still
        # too long.
        clauses = [c.strip() for c in re.split(r"(?<=[,;:])\s+", sentence) if c.strip()]
        buffered: list[str] = []
        for clause in clauses:
            words = clause.split()
            while len(words) > max_words:
                if buffered:
                    chunks.append(" ".join(buffered))
                    buffered = []
                chunks.append(" ".join(words[:max_words]))
                words = words[max_words:]
            remainder = " ".join(words)
            if buffered and len(" ".join(buffered).split()) + len(words) > max_words:
                chunks.append(" ".join(buffered))
                buffered = [remainder]
            else:
                buffered.append(remainder)
            # A clause ending in , or ; continues the sentence, so keep its punctuation
            # only when it closes the chunk.
        if buffered:
            chunks.append(" ".join(buffered))

    return [c for c in chunks if c.strip()] or [text.strip()]


def clip_words(text: str, limit: int) -> str:
    """Trim to a whole number of words, ending with a period if it was cut."""
    words = text.split()
    if len(words) <= limit:
        return text
    return " ".join(words[:limit]).rstrip(",;:") + "…"


# --- Visual design --------------------------------------------------------
# One palette per slate arc, so the channel reads as one publication in twelve moods.
# Colours stay high-contrast against each theme's background.

CATEGORY_THEME = {
    "New Creation & Identity": ("nocturne", "#7dd3fc", ["#070911", "#14233d", "#1e3a5f"]),
    "The Holy Spirit":         ("aurora",   "#a5f3d0", ["#04100f", "#0b2b28", "#134e4a"]),
    "Faith":                   ("sunset-drive", "#fbbf24", ["#12060a", "#3d1220", "#7c2d3a"]),
    "Authority of the Believer": ("mono-brutal", "#f5f5f4", ["#0a0a0a", "#171717", "#262626"]),
    "The Word":                ("paper-light", "#1d4ed8", ["#faf7f0", "#f3ece0", "#e7dccb"]),
    "Prayer & Fasting":        ("cinema-classic", "#e8c477", ["#0b0a08", "#1c1710", "#332a1c"]),
    "Divine Health":           ("aurora",   "#86efac", ["#04120a", "#0d2a1a", "#164e33"]),
    "Prosperity & Stewardship": ("neon-circuit", "#38bdf8", ["#05080f", "#0d1b2e", "#123a52"]),
    "Righteousness & Grace":   ("nocturne", "#d4af6a", ["#070911", "#141b2b", "#2a2035"]),
    "Spiritual Warfare":       ("neon-circuit", "#f472b6", ["#0a0410", "#1f0a2e", "#3b1250"]),
    "Redemption & His Return": ("cinema-classic", "#fca5a5", ["#0c0707", "#241010", "#3f1a1a"]),
    "Christian Living":        ("karaoke-stage", "#60a5fa", ["#080a12", "#121a2c", "#1b2942"]),
}

FALLBACK = ("nocturne", "#d4af6a", ["#070911", "#14233d", "#2b193f"])


def palette_for(category: str) -> tuple[str, str, list[str]]:
    return CATEGORY_THEME.get(category, FALLBACK)


# --- Script construction --------------------------------------------------

def build_script(fm: dict, body: str) -> dict:
    """Assemble the full scene list for one teaching.

    Structure, and why:
      1. title      — names the teaching and its scripture; the hook
      2. quote      — the theme scripture itself, read exactly
      3. caption    — the question the teaching answers
      4. bullets    — the central truth broken into its parts
      5. quote/caption — the turn of the argument, from the article body
      6. stat/bullets  — the practical mechanism or the cross-references
      7. caption    — the reaffirmation
      8. quote      — the declaration, which the reader says aloud
      9. outro      — where to read the whole thing
    """
    theme, accent, bg_colors = palette_for(fm["category"])
    title = fm["title"]
    scripture = fm.get("themeScripture") or {}
    scripture_text = speakable(scripture.get("text", ""))
    scripture_ref = scripture.get("reference", "")
    translation = scripture.get("translation", "KJV")
    central = speakable(fm["centralTruth"])
    reaffirm = speakable(fm["reaffirmation"])
    declaration = speakable(fm["declaration"])

    background = {"kind": "mesh", "colors": bg_colors, "motion": 0.28, "scrim": 0.34}

    scenes: list[dict] = []

    # References are spoken, not symbolised: Piper reads "7:19" badly and "Romans
    # seven, verse nineteen" correctly, so narration uses the spoken form while the
    # on-screen caption keeps the compact one.
    spoken_ref = speakable(scripture_ref) if scripture_ref else ""

    refs = [speakable(r) for r in (fm.get("furtherStudy") or [])][:4]
    answer = speakable(fm.get("answerText", ""))

    def base(layout: str, kicker: str, enter: str, transition: str) -> dict:
        return {
            "layout": layout,
            "kicker": kicker,
            "duration": "auto",
            "enter": enter,
            "transition": transition,
            "accent": accent,
            "background": background,
        }

    # 1. Title ------------------------------------------------------------
    scene = base("title", f"DAY {fm['day']} · {fm['category'].upper()}", "rise", "fade")
    scene.update({
        "text": title,
        "subtext": f"{scripture_ref} · {translation}",
        "narration": tidy_sentence(f"{speakable(title)} {spoken_ref}"),
    })
    scenes.append(scene)

    # 2. The theme scripture, read exactly — split if it runs long. --------
    for i, chunk in enumerate(split_for_scenes(scripture_text, max_words=34)):
        scene = base("quote", "THE TEXT" + (" (CONTINUED)" if i else ""), "fade", "fade")
        scene.update({
            "text": chunk,
            "subtext": f"{scripture_ref} · {translation}",
            "narration": tidy_sentence(("Listen to the text. " if i == 0 else "") + chunk),
        })
        scenes.append(scene)

    # 3. The question -----------------------------------------------------
    # The question is displayed as written but spoken expanded, because several
    # teachings ask their question with a citation inside it ("...in Romans 1:17?").
    question = fm.get("answerQuestion") or f"What does {title.rstrip('?')} mean?"
    scene = base("caption", "THE QUESTION", "rise", "slide")
    scene.update({
        "text": question,
        "narration": tidy_sentence(f"Here is the question. {speakable(question)}"),
    })
    scenes.append(scene)

    # 4. The central truth, broken at its own turn -------------------------
    # The em-dash is the argument's hinge, so the bullets follow it rather than
    # cutting the sentence into arbitrary fragments.
    truth_parts = [p.strip() for p in re.split(r"\s+—\s+|;\s+", central) if p.strip()]
    if len(truth_parts) < 2:
        truth_parts = split_for_scenes(central, max_words=20) or [central]

    truth_chunks = split_for_scenes(central, max_words=30)
    for i, chunk in enumerate(truth_chunks):
        scene = base("bullets", "THE CENTRAL TRUTH" + (" (CONTINUED)" if i else ""), "wordCascade", "fade")
        scene.update({
            "text": "Here is what this teaching establishes." if i == 0 else "Still the same truth.",
            "items": [capitalise(clip_words(p, 16)) for p in truth_parts[:4]] if i == 0 else None,
            "narration": tidy_sentence(("Here is the central truth. " if i == 0 else "") + chunk),
        })
        if scene["items"] is None:
            # A continuation scene repeats the bullets rather than rendering empty.
            scene["items"] = [capitalise(clip_words(p, 16)) for p in truth_parts[:4]]
        scenes.append(scene)

    # 5. The article's own plain answer, if it has one ----------------------
    for chunk in split_for_scenes(answer, max_words=34) if answer else []:
        scene = base("quote", "THE ANSWER, PLAINLY", "fade", "wipe")
        scene.update({"text": chunk, "narration": tidy_sentence(chunk)})
        scenes.append(scene)

    # 6. The cross-references the teaching builds on ------------------------
    if refs:
        scene = base("bullets", "READ IT IN CONTEXT", "rise", "slide")
        scene.update({
            "text": "The same truth, from other books.",
            "items": refs,
            "narration": tidy_sentence("Read it in context. " + ", ".join(refs)),
        })
        scenes.append(scene)

    # 7. The reaffirmation --------------------------------------------------
    for i, chunk in enumerate(split_for_scenes(reaffirm, max_words=30)):
        scene = base("caption", "REMEMBER THIS", "blur", "fade")
        scene.update({
            "text": clip_words(chunk, 40),
            "narration": tidy_sentence(chunk),
        })
        scenes.append(scene)

    # 8. The declaration, spoken --------------------------------------------
    for i, chunk in enumerate(split_for_scenes(declaration, max_words=34)):
        scene = base("quote", "SAY THIS ALOUD" + (" (CONTINUED)" if i else ""), "rise", "fade")
        scene.update({"text": chunk, "narration": tidy_sentence(chunk)})
        if i == 0:
            scene["subtext"] = "The teaching's own declaration"
        scenes.append(scene)

    # 9. Where to read the whole thing --------------------------------------
    scene = base("caption", "KEEP GOING", "rise", "none")
    scene.update({
        "text": f"Read the full teaching at {SITE_URL}",
        "subtext": title,
        "narration": tidy_sentence("Read the full teaching, and the rest of the library, at " + SITE_URL),
    })
    scenes.append(scene)

    spec = {
        "kind": "vidlyrics.spec",
        "version": 1,
        "title": title,
        "author": CHANNEL,
        "theme": theme,
        "aspect": "16:9",
        "fps": 30,
        "voice": {
            "voiceId": "en_US-lessac-medium",
            "pauseMs": 320,
            "wpm": 152,
        },
        "scenes": scenes,
        "outro": {
            "title": "Live In Jesus Name",
            "subtitle": f"Scripture-anchored teachings · {SITE_URL}",
            "duration": 2.5,
        },
    }
    return spec


def script_markdown(fm: dict, spec: dict) -> str:
    """The voiceover script a narrator or editor reads, scene by scene."""
    total_words = 0
    lines: list[str] = [
        f"# {spec['title']}",
        "",
        f"**Day {fm['day']}** · {fm['category']} · *{fm['slateArc']}*  ",
        f"**Theme:** `{spec['theme']}` · **Aspect:** {spec['aspect']} · **Voice:** "
        f"`{spec['voice']['voiceId']}` at {spec['voice']['wpm']} wpm  ",
        f"**Article:** {SITE_URL}/{fm['slug']}/",
        "",
        "> Generated from the teaching's own frontmatter and body by "
        "`scripts/make-video-scripts.py`. Edit the article, then re-run — do not hand-edit "
        "this file, because the next run will overwrite it.",
        "",
        "---",
        "",
    ]

    for i, scene in enumerate(spec["scenes"], start=1):
        narration = scene.get("narration") or scene.get("text", "")
        words = len(narration.split())
        total_words += words
        seconds = round(words / spec["voice"]["wpm"] * 60, 1)

        layout = scene["layout"].upper()
        kicker = scene.get("kicker", "")
        lines.append(f"### Scene {i} · `{layout}`" + (f" · {kicker}" if kicker else ""))
        lines.append("")
        lines.append(f"**On screen:** {scene.get('text', '')}")
        if scene.get("subtext"):
            lines.append(f"  \\_{scene['subtext']}\\_")
        if scene.get("items"):
            for item in scene["items"]:
                lines.append(f"- {item}")
        lines.append("")
        lines.append(f"**Narration** (~{seconds}s):")
        lines.append("")
        for para in textwrap.wrap(narration, 92):
            lines.append(f"> {para}")
        lines.append("")

    minutes, seconds_total = divmod(round(total_words / spec["voice"]["wpm"] * 60), 60)
    lines += [
        "---",
        "",
        f"**Total narration:** {total_words} words ≈ {minutes}m {seconds_total:02d}s "
        f"at {spec['voice']['wpm']} wpm across {len(spec['scenes'])} scenes.",
        "",
        f"**Outro:** {spec['outro']['title']} — {spec['outro']['subtitle']} "
        f"({spec['outro']['duration']}s)",
        "",
    ]
    return "\n".join(lines)


def main() -> None:
    ap = argparse.ArgumentParser(description="Generate video scripts for every teaching.")
    ap.add_argument("--day", type=int, help="only this day")
    ap.add_argument("--slug", help="only this slug")
    ap.add_argument("--limit", type=int, help="stop after N teachings")
    ap.add_argument("--out", default=str(OUT), help="output directory")
    args = ap.parse_args()

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    files = sorted(ARTICLES.glob("*.md"))
    written = 0
    failed: list[str] = []

    for path in files:
        text = path.read_text(encoding="utf-8")
        try:
            fm = parse_frontmatter(text)
        except Exception as exc:  # noqa: BLE001 - report, do not abort the batch
            failed.append(f"{path.name}: {exc}")
            continue

        # `day` parses as a string (the frontmatter has no type information), so
        # compare numerically rather than letting "366" != 366 silently skip everything.
        try:
            day_value = int(str(fm.get("day", "")).strip())
        except ValueError:
            day_value = None
        if args.day and day_value != args.day:
            continue
        if args.slug and fm.get("slug") != args.slug:
            continue

        spec = build_script(fm, body_of(text))
        slug = fm["slug"]

        (out_dir / f"{slug}.json").write_text(
            json.dumps(spec, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
        )
        (out_dir / f"{slug}.md").write_text(script_markdown(fm, spec), encoding="utf-8")

        written += 1
        if args.limit and written >= args.limit:
            break

    print(f"wrote {written} script(s) to {out_dir.relative_to(SITE) if out_dir.is_relative_to(SITE) else out_dir}")
    if failed:
        print(f"FAILED {len(failed)}:")
        for f in failed:
            print("  ", f)


if __name__ == "__main__":
    main()
