#!/usr/bin/env python3
"""
Batch QA & 18-point Compliance Verifier for In Jesus Name teaching articles.
Fulfills TODO item E1 + FAITH_TEACHING_PROMPT.md Section 12 + Originality Law.
"""

import glob
import os
import re
import sys

BANNED_PHRASES = [
    "in today's fast-paced world",
    "delve",
    "unlock the power",
    "game-changer",
    "look no further",
    "in conclusion",
]


def parse_frontmatter(raw: str):
    if not raw.startswith("---\n"):
        return {}, raw
    end = raw.find("\n---\n", 4)
    if end == -1:
        return {}, raw
    fm_block = raw[4:end]
    body = raw[end + 5 :]
    fm = {}
    current_key = None
    for line in fm_block.splitlines():
        if re.match(r"^[a-zA-Z0-9_]+:\s*", line):
            k, v = line.split(":", 1)
            k = k.strip()
            v = v.strip()
            if (v.startswith('"') and v.endswith('"')) or (
                v.startswith("'") and v.endswith("'")
            ):
                v = v[1:-1]
            fm[k] = v
            current_key = k
        elif current_key and line.startswith("  "):
            pass
    return fm, body


def count_words(text: str) -> int:
    cleaned = re.sub(r"<!--.*?-->", " ", text, flags=re.S)
    cleaned = re.sub(r"[*_>#`|\-]", " ", cleaned)
    tokens = [w for w in re.split(r"\s+", cleaned) if re.search(r"[A-Za-z0-9]", w)]
    return len(tokens)


def load_source_titles(repo_root: str):
    t365 = os.path.join(repo_root, "TOPICS_365.md")
    if not os.path.exists(t365):
        return set()
    txt = open(t365, encoding="utf-8").read()
    if "Source-titles used for exclusion (never rewritten):" not in txt:
        return set()
    line = txt.split("Source-titles used for exclusion (never rewritten):")[1].splitlines()[0]
    titles = set()
    for item in line.split("·"):
        norm = re.sub(r"[^a-z0-9 ]+", "", item.lower()).strip()
        if norm:
            titles.add(norm)
    return titles


def fm_block_terms(raw: str) -> str:
    """Return only the glossaryTerms list block from the frontmatter."""
    if not raw.startswith("---\n"):
        return ""
    end = raw.find("\n---\n", 4)
    fm_block = raw[4:end] if end != -1 else ""
    m = re.search(r"^glossaryTerms:\s*\n((?:[ \t]+- .*\n)+)", fm_block, flags=re.M)
    return m.group(1) if m else ""


def load_categories(site_dir: str):
    path = os.path.join(site_dir, "src", "data", "categories.ts")
    if not os.path.exists(path):
        return set()
    txt = open(path, encoding="utf-8").read()
    return {m.strip() for m in re.findall(r"^\s*name: '([^']+)',", txt, flags=re.M)}


def load_glossary_terms(site_dir: str):
    path = os.path.join(site_dir, "glossary.md")
    if not os.path.exists(path):
        return set()
    txt = open(path, encoding="utf-8").read()
    terms = set()
    for t in re.findall(r"^### \d+\. (.+)$", txt, flags=re.M):
        t = re.sub(r"\s*\(\*.*?\)\s*", " ", t)
        terms.add(re.sub(r"\s+", " ", t).strip().lower())
    return terms


def load_published_slugs(articles_dir: str):
    slugs = set()
    for path in glob.glob(os.path.join(articles_dir, "*.md")):
        txt = open(path, encoding="utf-8").read()
        m = re.search(r'^slug:\s*"?([A-Za-z0-9\-]+)"?\s*$', txt, flags=re.M)
        if m:
            slugs.add(m.group(1))
    return slugs


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    site_dir = os.path.dirname(script_dir)
    repo_root = os.path.dirname(site_dir)
    articles_dir = os.path.join(site_dir, "articles")
    source_titles = load_source_titles(repo_root)
    glossary_terms = load_glossary_terms(site_dir)
    categories = load_categories(site_dir)
    published_slugs = load_published_slugs(articles_dir)

    files = sorted(glob.glob(os.path.join(articles_dir, "*.md")))
    if not files:
        print("ERROR: No article markdown files found in", articles_dir)
        sys.exit(1)

    failures = 0
    print(f"Auditing {len(files)} articles in {articles_dir}...\n")
    header = f"{'File':46s} | {'Words':>5s} | {'SEO':>3s} | {'Meta':>4s} | {'Decl':>4s} | {'Q?':>2s} | {'H2':>2s} | Status"
    print(header)
    print("-" * len(header))

    seen_slugs = set()
    seen_titles = set()

    for path in files:
        fname = os.path.basename(path)
        raw = open(path, encoding="utf-8").read()
        fm, rest = parse_frontmatter(raw)
        errors = []

        for req in [
            "day",
            "title",
            "seoTitle",
            "description",
            "slug",
            "category",
            "reaffirmation",
            "declaration",
            "centralTruth",
        ]:
            if not fm.get(req):
                errors.append(f"missing frontmatter '{req}'")

        reader_part = rest.split("<!-- AUDIT-BELOW -->")[0]
        prose_only = reader_part.split("<!-- END-PROSE -->")[0]

        body_words = count_words(reader_part)
        prose_words = count_words(prose_only)
        # The 900-word floor applies to TEACHING PROSE — the body before
        # <!-- END-PROSE -->. The closing reaffirmation/declaration/further-study
        # block is fixed furniture and must never be counted toward the floor.
        if prose_words < 900:
            errors.append(f"prose words {prose_words} < 900 floor")

        seo_len = len(fm.get("seoTitle", ""))
        if not (25 <= seo_len <= 60):
            errors.append(f"seoTitle length {seo_len} outside 25..60")

        meta_len = len(fm.get("description", ""))
        if not (140 <= meta_len <= 158):
            errors.append(f"meta description length {meta_len} outside 140..158")

        decl_words = count_words(fm.get("declaration", ""))
        if not (40 <= decl_words <= 80):
            errors.append(f"declaration words {decl_words} outside 40..80")

        q_count = prose_only.count("?")
        if q_count < 2:
            errors.append(f"rhetorical questions {q_count} < 2")

        h2s = re.findall(r"^##\s+(.+)$", prose_only, flags=re.M)
        if len(h2s) < 3:
            errors.append(f"H2 count {len(h2s)} < 3")
        if len(h2s) > 3:
            errors.append(f"H2 count {len(h2s)} > 3 (Standard allows 0-3; demote extras to H3)")

        if not re.search(r"^##\s+What This Means for You", prose_only, flags=re.M):
            errors.append("missing required '## What This Means for You' section")

        if "here is the contrast:" in prose_only.lower():
            errors.append("template tic 'Here is the contrast:' — rewrite the contrast")

        # "Bold anchors" (Section 8) are bolded STATEMENTS carrying the revelation,
        # not inline emphasis of a single word inside a quoted verse. Count only
        # bold spans of 5+ words, which is the length at which a phrase becomes an anchor.
        bold_anchors = sum(
            1
            for sp in re.findall(r"\*\*((?:[^*]|\*(?!\*))+)\*\*", prose_only)
            if len(sp.split()) >= 5
        )
        if not (4 <= bold_anchors <= 14):
            errors.append(f"bold anchors {bold_anchors} outside 4..14")

        low = prose_only.lower()
        for bp in BANNED_PHRASES:
            if bp in low:
                errors.append(f"banned phrase '{bp}'")

        norm_title = re.sub(r"[^a-z0-9 ]+", "", fm.get("title", "").lower()).strip()
        if norm_title in source_titles:
            errors.append("title matches excluded source title")
        if norm_title in seen_titles:
            errors.append("duplicate article title")
        seen_titles.add(norm_title)

        slug = fm.get("slug", "")
        if slug in seen_slugs:
            errors.append(f"duplicate slug '{slug}'")
        seen_slugs.add(slug)

        refs = set(
            re.findall(
                r"(?:[1-3]\s+)?[A-Z][a-z]+\s+\d+:\d+(?:[–-]\d+)?", prose_only
            )
        )
        if len(refs) < 3:
            errors.append(f"cross-references in prose {len(refs)} < 3")

        # Related-teaching handoffs must resolve to a published article (no 404s / fallbacks).
        related_slugs = re.findall(r'slug:\s*"([A-Za-z0-9\-]+)"', raw)
        related_slugs = [sl for sl in related_slugs if sl != slug]
        for sl in related_slugs:
            if sl not in published_slugs:
                errors.append(f"relatedTeaching slug '{sl}' is not published")

        # Category must match a real category page (or the article 404s from its category).
        if categories and fm.get("category") not in categories:
            errors.append(f"category '{fm.get('category')}' is not in categories.ts")

        # Every glossaryTerms value must be a canonised entry in glossary.md.
        if glossary_terms:
            for term in re.findall(r'^  - "(.+)"$', fm_block_terms(raw), flags=re.M):
                if term.strip().lower() not in glossary_terms:
                    errors.append(f"glossaryTerm '{term}' is not in glossary.md")

        # The self-audit table must tell the truth about the file it sits in.
        for row, actual in (("17", prose_words), ("16", seo_len), ("12", decl_words), ("6", q_count)):
            m_row = re.search(rf"^\| {row} \|[^\n]*?✔ ([\d,]+)", raw, flags=re.M)
            if m_row and int(m_row.group(1).replace(",", "")) != actual:
                errors.append(f"self-audit row {row} claims {m_row.group(1)}, actual {actual}")

        status = "PASS (20/20)" if not errors else "FAIL: " + "; ".join(errors)
        if errors:
            failures += 1
        print(
            f"{fname[:46]:46s} | {prose_words:5d} | {seo_len:3d} | {meta_len:4d} | {decl_words:4d} | {q_count:2d} | {len(h2s):2d} | {status}"
        )

    print("-" * len(header))
    if failures:
        print(f"\nFAILED: {failures} article(s) had audit errors.")
        sys.exit(1)
    print(f"\nSUCCESS: All {len(files)} article(s) passed every SEO, prose-length, structure, voice, self-audit-integrity, link-integrity, glossary, category, and compliance check.")


if __name__ == "__main__":
    main()
