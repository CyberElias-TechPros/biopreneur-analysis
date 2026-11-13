#!/usr/bin/env python3
"""
Post-build SEO & structural verifier for In Jesus Name.

Runs against `dist/` (the real rendered output, not the source) and checks every
signal a modern crawler or rich-result parser actually reads:

  A. Per-page head      — title length/uniqueness, meta description length,
                          canonical, robots, viewport, lang, charset
  B. Social/AI          — Open Graph (incl. og:image dimensions), Twitter card
  C. Structured data    — every JSON-LD block parses; required @types present;
                          BlogPosting carries headline/datePublished/author/image/
                          wordCount/mainEntityOfPage; Organization + WebSite exist
  D. Semantics          — exactly one <h1>, no heading-level skips, one <main>
  E. Indexability       — sitemap covers every canonical URL; robots.txt sane;
                          no noindex leaked onto a canonical page
  F. Internal linking   — no broken internal hrefs; every article reachable
  G. Feeds/metadata     — rss.xml well-formed, ads.txt, favicon/og image exist
  H. Images             — every <img> has alt + explicit dimensions

Exit code 1 on any FAIL, 0 otherwise. No external network calls.
"""

from __future__ import annotations

import glob
import html
import json
import os
import re
import sys
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from urllib.parse import urlparse

DIST = "dist"
SITE_FALLBACK = "https://lij.name.ng"

results: list[tuple[str, str, str]] = []  # (level, code, message)


def ok(code: str, msg: str = "") -> None:
    results.append(("PASS", code, msg))


def fail(code: str, msg: str) -> None:
    results.append(("FAIL", code, msg))


def warn(code: str, msg: str) -> None:
    results.append(("WARN", code, msg))


# ---------------------------------------------------------------- helpers
def read(path: str) -> str:
    with open(path, encoding="utf-8") as fh:
        return fh.read()


def strip_tags(s: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", "", s)).strip()


def page_paths() -> list[str]:
    pages = sorted(glob.glob(os.path.join(DIST, "**", "index.html"), recursive=True))
    return pages


def _types_of(node: dict) -> list[str]:
    """A schema @type may be a string or a list (e.g. ['Organization','OnlineBusiness'])."""
    raw = node.get("@type")
    if isinstance(raw, str):
        return [raw]
    if isinstance(raw, list):
        return [x for x in raw if isinstance(x, str)]
    return []


def url_for(path: str, origin: str) -> str:
    rel = os.path.relpath(os.path.dirname(path), DIST).replace(os.sep, "/")
    if rel == ".":
        return origin + "/"
    return f"{origin}/{rel}/"


# ---------------------------------------------------------------- A. head
def check_head(pages: list[str]) -> None:
    titles: dict[str, list[str]] = defaultdict(list)
    descs: dict[str, list[str]] = defaultdict(list)
    bad: list[str] = []

    for p in pages:
        t = read(p)
        name = os.path.relpath(p, DIST)

        m = re.search(r"<title>(.*?)</title>", t, re.S)
        if not m:
            bad.append(f"{name}: no <title>")
            continue
        title = html.unescape(m.group(1)).strip()
        titles[title].append(name)
        if not (10 <= len(title) <= 60):
            bad.append(f"{name}: title {len(title)}c")

        d = re.search(r'<meta\s+name="description"\s+content="(.*?)"', t, re.S)
        if not d:
            bad.append(f"{name}: no meta description")
        else:
            desc = html.unescape(d.group(1)).strip()
            descs[desc].append(name)
            if not (120 <= len(desc) <= 160):
                bad.append(f"{name}: description {len(desc)}c")

        if not re.search(r'<link\s+rel="canonical"\s+href="https?://', t):
            bad.append(f"{name}: missing absolute canonical")

        if not re.search(r'<meta\s+name="viewport"\s+content="[^"]*width=device-width', t):
            bad.append(f"{name}: missing responsive viewport")

        if not re.search(r"<html[^>]*\slang=\"[a-z]{2}", t):
            bad.append(f"{name}: missing <html lang>")

        if 'charset="utf-8"' not in t.lower() and "charset=utf-8" not in t.lower():
            bad.append(f"{name}: missing charset")

    dups = {k: v for k, v in titles.items() if len(v) > 1}
    dupd = {k: v for k, v in descs.items() if len(v) > 1}
    if dups:
        fail("A1", f"duplicate <title> across {len(dups)} page(s): {list(dups)[:3]}")
    else:
        ok("A1", f"{len(titles)} unique titles")
    if dupd:
        fail("A2", f"duplicate meta description on {len(dupd)} page(s)")
    else:
        ok("A2", f"{len(descs)} unique meta descriptions")
    if bad:
        fail("A3", "head defects: " + "; ".join(bad[:8]))
    else:
        ok("A3", "titles/descriptions/canonical/viewport/lang/charset valid on every page")

    # A4 — crawl directives, hreflang, and mobile/PWA-adjacent head signals
    a4: list[str] = []
    overlong: list[str] = []
    for p in pages:
        t = read(p)
        name = os.path.relpath(p, DIST)
        robots = re.search(r'<meta\s+name="robots"\s+content="([^"]+)"', t)
        if not robots:
            a4.append(f"{name}: no robots meta")
        elif "noindex" in robots.group(1):
            a4.append(f"{name}: noindex on indexable page")
        elif "max-image-preview:large" not in robots.group(1):
            a4.append(f"{name}: robots lacks max-image-preview:large")
        if not re.search(r'<link\s+rel="alternate"\s+hreflang="en"', t):
            a4.append(f"{name}: no hreflang=en alternate")
        if not re.search(r'<link\s+rel="alternate"\s+hreflang="x-default"', t):
            a4.append(f"{name}: no hreflang=x-default")
        if 'name="theme-color"' not in t:
            a4.append(f"{name}: no theme-color")
        m = re.search(r"<title>(.*?)</title>", t, re.S)
        if m and len(html.unescape(m.group(1)).strip()) > 60:
            overlong.append(f"{name}: {len(html.unescape(m.group(1)).strip())}c")
    if a4:
        fail("A4", "crawl/directive defects: " + "; ".join(a4[:8]))
    else:
        ok("A4", "robots directives, hreflang en + x-default, theme-color on every page")
    if overlong:
        warn("A5", f"title >60c (truncated in SERP) on {len(overlong)} page(s): {overlong[:4]}")
    else:
        ok("A5", "every title fits the 60-character SERP window")


# ---------------------------------------------------------------- B. social
def check_social(pages: list[str]) -> None:
    bad: list[str] = []
    for p in pages:
        t = read(p)
        name = os.path.relpath(p, DIST)
        for prop in ("og:title", "og:description", "og:url", "og:image", "og:type", "og:site_name"):
            if f'property="{prop}"' not in t:
                bad.append(f"{name}: missing {prop}")
        if 'property="og:image:width"' not in t:
            bad.append(f"{name}: og:image width/height missing")
        for name_ in ("twitter:card", "twitter:title", "twitter:description", "twitter:image"):
            if f'name="{name_}"' not in t:
                bad.append(f"{name}: missing {name_}")
        if 'name="twitter:card" content="summary_large_image"' not in t:
            bad.append(f"{name}: twitter:card not large image")
    if bad:
        fail("B1", "social meta defects: " + "; ".join(bad[:8]))
    else:
        ok("B1", "Open Graph + Twitter card complete on every page")

    b3: list[str] = []
    for p in pages:
        t = read(p)
        name = os.path.relpath(p, DIST)
        if 'property="og:image:alt"' not in t:
            b3.append(f"{name}: no og:image:alt")
        if 'name="twitter:image:alt"' not in t:
            b3.append(f"{name}: no twitter:image:alt")
        if 'property="og:image:type"' not in t:
            b3.append(f"{name}: no og:image:type")
        if 'property="og:locale"' not in t:
            b3.append(f"{name}: no og:locale")
    if b3:
        fail("B3", "social image-text defects: " + "; ".join(b3[:6]))
    else:
        ok("B3", "og/twitter image alt text, MIME type, and locale present everywhere")

    og = os.path.join(DIST, "images", "og-default.png")
    if not os.path.exists(og):
        fail("B2", "og-default.png missing from dist/images")
    else:
        ok("B2", f"og image present ({os.path.getsize(og)//1024} KB)")


# ---------------------------------------------------------------- C. jsonld
REQUIRED_TOP = {
    ("WebSite", "any"),
    ("Organization", "any"),
    ("BlogPosting", "article"),
}


def check_jsonld(pages: list[str]) -> None:
    problems: list[str] = []
    typed: Counter[str] = Counter()
    article_missing: list[str] = []

    for p in pages:
        t = read(p)
        name = os.path.relpath(p, DIST)
        blocks = re.findall(
            r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', t, re.S
        )
        if not blocks:
            problems.append(f"{name}: no JSON-LD")
            continue
        for b in blocks:
            try:
                data = json.loads(b)
            except Exception as exc:  # noqa: BLE001
                problems.append(f"{name}: unparseable JSON-LD ({exc})")
                continue

            def walk(node):
                if isinstance(node, dict):
                    if "@type" in node:
                        yield node
                    for v in node.values():
                        yield from walk(v)
                elif isinstance(node, list):
                    for v in node:
                        yield from walk(v)

            for node in walk(data):
                for t_ in _types_of(node):
                    typed[t_] += 1
                if "BlogPosting" in _types_of(node):
                    for field in (
                        "headline",
                        "description",
                        "datePublished",
                        "dateModified",
                        "author",
                        "publisher",
                        "image",
                        "mainEntityOfPage",
                        "wordCount",
                        "articleSection",
                        "keywords",
                        "inLanguage",
                    ):
                        if field not in node:
                            article_missing.append(f"{name}: BlogPosting missing {field}")

    if problems:
        fail("C1", "; ".join(problems[:6]))
    else:
        ok("C1", "all JSON-LD blocks parse")

    for want in ("WebSite", "Organization", "BlogPosting", "BreadcrumbList"):
        if typed.get(want, 0) == 0:
            fail("C2", f"schema type {want} never emitted")
    if not any(r[1] == "C2" for r in results):
        ok("C2", "WebSite + Organization + BlogPosting + BreadcrumbList all emitted")

    if article_missing:
        fail("C3", "; ".join(sorted(set(article_missing))[:8]))
    else:
        ok("C3", "every BlogPosting carries all 12 recommended Article fields")

    # C4 — page-type schema must match the page it describes
    def types_on(rel: str) -> set[str]:
        path = os.path.join(DIST, rel)
        if not os.path.exists(path):
            return set()
        found: set[str] = set()

        def walk(node):
            if isinstance(node, dict):
                if "@type" in node:
                    found.update(_types_of(node))
                for v in node.values():
                    walk(v)
            elif isinstance(node, list):
                for v in node:
                    walk(v)

        for b in re.findall(
            r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', read(path), re.S
        ):
            try:
                walk(json.loads(b))
            except Exception:  # noqa: BLE001
                pass
        return found

    expectations = {
        "index.html": {"Blog", "ItemList"},
        "teachings/index.html": {"CollectionPage", "ItemList", "BreadcrumbList"},
        "glossary/index.html": {"DefinedTermSet", "DefinedTerm", "BreadcrumbList"},
        "about/index.html": {"AboutPage", "Person", "BreadcrumbList"},
        "contact/index.html": {"ContactPage", "BreadcrumbList"},
        "listen/index.html": {"WebPage", "BreadcrumbList"},
        "accessibility/index.html": {"WebPage", "BreadcrumbList"},
        "community/index.html": {"WebPage", "BreadcrumbList"},
        "doctrinal-basis/index.html": {"WebPage", "BreadcrumbList"},
        "privacy/index.html": {"WebPage", "BreadcrumbList"},
        "slate/index.html": {"CollectionPage", "ItemList", "BreadcrumbList"},
    }
    c4: list[str] = []
    for rel, want in expectations.items():
        have = types_on(rel)
        missing = want - have
        if missing:
            c4.append(f"{rel}: missing {sorted(missing)}")
    cat_hub = "category/divine-health/index.html"
    if cat_hub in [
        os.path.relpath(p, DIST) for p in pages
    ] and not {"CollectionPage", "ItemList"} <= types_on(cat_hub):
        c4.append(f"{cat_hub}: missing CollectionPage/ItemList")
    if c4:
        fail("C4", "page-type schema gaps: " + "; ".join(c4[:6]))
    else:
        ok("C4", "Blog/CollectionPage/AboutPage/ContactPage/DefinedTermSet typing matches each page")

    # C5 — glossary terms are individually addressable and defined
    gpath = os.path.join(DIST, "glossary", "index.html")
    if os.path.exists(gpath):
        gt = read(gpath)
        terms = re.findall(r'"@type":\s*"DefinedTerm"', gt)
        anchors = re.findall(r'id="[a-z0-9-]+"[^>]*>\s*<div', gt) + re.findall(
            r'<article\s+id="[a-z0-9-]+"', gt
        )
        if len(terms) < 30:
            fail("C5", f"glossary emits only {len(terms)} DefinedTerm nodes")
        elif len(set(anchors)) < 30:
            fail("C5", f"glossary has only {len(set(anchors))} term anchors")
        else:
            ok("C5", f"glossary: {len(terms)} DefinedTerm nodes, {len(set(anchors))} anchors")


# ---------------------------------------------------------------- D. semantics
def check_semantics(pages: list[str]) -> None:
    bad: list[str] = []
    for p in pages:
        t = read(p)
        name = os.path.relpath(p, DIST)
        body = t.split("<body", 1)[-1]
        body = re.sub(r"<script.*?</script>", "", body, flags=re.S)
        h1s = re.findall(r"<h1[^>]*>", body)
        if len(h1s) != 1:
            bad.append(f"{name}: {len(h1s)} <h1>")
        if body.count("<main") != 1:
            bad.append(f"{name}: {body.count('<main')} <main>")
        levels = [int(m) for m in re.findall(r"<h([1-6])[^>]*>", body)]
        prev = 0
        for lv in levels:
            if prev and lv > prev + 1:
                bad.append(f"{name}: heading skip h{prev}->h{lv}")
                break
            prev = lv
    if bad:
        fail("D1", "; ".join(bad[:8]))
    else:
        ok("D1", "single h1, no heading skips, one <main> per page")


# ---------------------------------------------------------------- E. indexability
def check_indexability(pages: list[str], origin: str) -> None:
    sm = os.path.join(DIST, "sitemap-0.xml")
    if not os.path.exists(sm):
        fail("E1", "sitemap-0.xml missing")
        return
    try:
        root = ET.parse(sm).getroot()
    except ET.ParseError as exc:
        fail("E1", f"sitemap unparseable: {exc}")
        return
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    locs = {el.text for el in root.findall(".//s:loc", ns) if el.text}
    ok("E1", f"sitemap lists {len(locs)} URLs")

    canon = set()
    for p in pages:
        m = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', read(p))
        if m:
            canon.add(m.group(1).strip())
    missing = canon - locs
    extra = locs - canon
    if missing:
        fail("E2", f"{len(missing)} canonical URL(s) absent from sitemap: {sorted(missing)[:3]}")
    else:
        ok("E2", "every canonical URL is in the sitemap")
    if extra:
        warn("E3", f"{len(extra)} sitemap URL(s) have no page: {sorted(extra)[:3]}")
    else:
        ok("E3", "no orphan sitemap entries")

    rb = os.path.join(DIST, "robots.txt")
    if not os.path.exists(rb):
        fail("E4", "robots.txt missing")
    else:
        r = read(rb)
        if "Sitemap:" not in r:
            fail("E4", "robots.txt does not reference the sitemap")
        elif any(
            line.strip() in ("Disallow: /", "Disallow:/")
            for line in r.splitlines()
        ):
            fail("E4", "robots.txt blocks the site")
        else:
            ok("E4", "robots.txt allows crawling and points to sitemap")

    # E6 — every sitemap entry must carry lastmod + priority (freshness signals)
    e6: list[str] = []
    nolast = 0
    for url in root.findall(".//s:url", ns):
        loc = url.findtext("s:loc", default="", namespaces=ns)
        last = url.findtext("s:lastmod", default="", namespaces=ns)
        prio = url.findtext("s:priority", default="", namespaces=ns)
        if not last or not re.match(r"^\d{4}-\d{2}-\d{2}", last):
            nolast += 1
        if not prio:
            e6.append(f"{loc}: no priority")
        if not loc.startswith(origin + "/"):
            e6.append(f"{loc}: wrong origin ({origin})")
        if not loc.endswith("/"):
            e6.append(f"{loc}: missing trailing slash")
    if nolast:
        e6.append(f"{nolast} URL(s) without a valid <lastmod>")
    if e6:
        fail("E6", "sitemap metadata defects: " + "; ".join(e6[:6]))
    else:
        ok("E6", "every sitemap URL has lastmod, priority, canonical origin, trailing slash")

    # E7 — the 404 document must exist and must not be indexable
    err = os.path.join(DIST, "404.html")
    if not os.path.exists(err):
        fail("E7", "404.html missing")
    else:
        et = read(err)
        if not re.search(r'name="robots"[^>]*content="[^"]*noindex', et):
            fail("E7", "404.html is indexable (no robots noindex)")
        elif re.search(r'<link\s+rel="canonical"', et):
            warn("E7", "404.html emits a canonical; serve it with a real 404 status")
        else:
            ok("E7", "404.html present and marked noindex")

    noindex = [
        os.path.relpath(p, DIST)
        for p in pages
        if re.search(r'name="robots"[^>]*content="[^"]*noindex', read(p))
    ]
    leak = [n for n in noindex if not n.startswith("404")]
    if leak:
        warn("E8", f"noindex on indexable page(s): {leak[:5]}")
    else:
        ok("E8", "no accidental noindex")


# ---------------------------------------------------------------- F. links
def check_flat_sitemap(pages: list[str], origin: str) -> None:
    """E5 — /sitemap.xml must exist, parse, and cover every canonical URL.

    The @astrojs/sitemap integration emits sitemap-index.xml + sitemap-0.xml;
    /sitemap.xml is the human/console entry point. It is a separate document, so
    it needs its own guard against drifting out of sync with the site.
    """
    flat = os.path.join(DIST, "sitemap.xml")
    if not os.path.exists(flat):
        fail("E5", "/sitemap.xml missing")
        return
    try:
        root = ET.parse(flat).getroot()
    except ET.ParseError as exc:
        fail("E5", f"/sitemap.xml unparseable: {exc}")
        return

    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = root.findall(".//s:url", ns)
    locs = {el.text for el in root.findall(".//s:loc", ns) if el.text}

    defects: list[str] = []
    for url in urls:
        loc = url.findtext("s:loc", default="", namespaces=ns)
        last = url.findtext("s:lastmod", default="", namespaces=ns)
        prio = url.findtext("s:priority", default="", namespaces=ns)
        if not loc.startswith(origin + "/"):
            defects.append(f"{loc}: wrong origin")
        if not loc.endswith("/"):
            defects.append(f"{loc}: missing trailing slash")
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", last or ""):
            defects.append(f"{loc}: bad lastmod")
        if not re.match(r"^[01]\.\d$", prio or ""):
            defects.append(f"{loc}: bad priority")

    canon = set()
    for p in pages:
        m = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', read(p))
        if m:
            canon.add(m.group(1).strip())
    missing = canon - locs

    if defects:
        fail("E5", "/sitemap.xml defects: " + "; ".join(defects[:5]))
    elif missing:
        fail("E5", f"{len(missing)} canonical URL(s) absent from /sitemap.xml: {sorted(missing)[:3]}")
    else:
        ok("E5", f"/sitemap.xml lists {len(locs)} URLs, all canonical, all with lastmod + priority")


def check_links(pages: list[str], origin: str) -> None:
    host = urlparse(origin).netloc
    broken: dict[str, set[str]] = defaultdict(set)
    internal = 0

    for p in pages:
        t = read(p)
        src = url_for(p, origin)
        for href in re.findall(r'href="([^"]+)"', t):
            if href.startswith(("mailto:", "tel:", "#", "javascript:")):
                continue
            if href.startswith("http"):
                u = urlparse(href)
                if u.netloc != host:
                    continue
                path = u.path
            else:
                path = href
            path = path.split("#")[0].split("?")[0]
            if not path.startswith("/"):
                continue
            internal += 1
            target = os.path.join(DIST, path.strip("/"))
            if path.endswith("/"):
                target = os.path.join(target, "index.html")
            elif not os.path.splitext(path)[1]:
                target = target + "/index.html"
            if not os.path.exists(target):
                broken[src].add(href)

    if broken:
        flat = [f"{k} -> {sorted(v)[:2]}" for k, v in list(broken.items())[:5]]
        fail("F1", f"{len(broken)} page(s) with broken internal links: {flat}")
    else:
        ok("F1", f"0 broken internal links across {internal} hrefs")

    # every article must be reachable from the teachings index
    idx = read(os.path.join(DIST, "teachings", "index.html"))
    linked = set(re.findall(r'href="/([a-z0-9-]+)/"', idx))
    articles = {
        os.path.basename(os.path.dirname(p))
        for p in pages
        if "/articles/" not in p
        and not os.path.relpath(p, DIST).split("/")[0] in {
            "category",
            "teachings",
            "about",
            "contact",
            "privacy",
            "glossary",
            "slate",
            "doctrinal-basis",
            "community",
            "listen",
            "accessibility",
        }
    }
    unreachable = {a for a in articles if a not in linked and os.path.exists(os.path.join(DIST, a, "index.html"))}
    if unreachable:
        fail("F2", f"{len(unreachable)} article(s) not linked from /teachings/: {sorted(unreachable)[:4]}")
    else:
        ok("F2", f"all {len(articles)} articles linked from the teachings index")


# ---------------------------------------------------------------- G. feeds
# ---------------------------------------------------------------- G2. AI readiness
def check_ai_readiness(pages: list[str], origin: str) -> None:
    """
    AI/answer-engine readiness, checked as facts in dist/ rather than as intent.

    Four things decide whether a model can use a site well:
      H4 — a documented machine entry point (llms.txt) that names the corpus
      H5 — a stable structured-data endpoint for the whole corpus
      H6 — an explicit crawler policy for named AI agents
      H7 — every page carries the cite-able identity graph (author + publisher ids)
    """

    # H4 — llms.txt exists, is text, names the site, and points at real pages
    llms = os.path.join(DIST, "llms.txt")
    if not os.path.exists(llms):
        fail("H4", "llms.txt missing — answer engines have no curated index")
    else:
        body = read(llms)
        missing = []
        if not body.startswith("#"):
            missing.append("no H1")
        if ">" not in body:
            missing.append("no summary block")
        for path in ("/teachings/", "/slate/", "/glossary/", "/doctrinal-basis/", "/api/articles.json"):
            if path not in body:
                missing.append(f"does not point at {path}")
        if missing:
            fail("H4", "llms.txt incomplete: " + ", ".join(missing[:4]))
        else:
            ok("H4", f"llms.txt present ({len(body.splitlines())} lines) and links the corpus")

    # H5 — machine corpus endpoint is real, parses, matches the article count
    api = os.path.join(DIST, "api", "articles.json")
    if not os.path.exists(api):
        fail("H5", "api/articles.json missing")
    else:
        try:
            data = json.loads(read(api))
            n = data.get("count", 0)
            arts = data.get("articles", [])
            bad = [
                a for a in arts[:50]
                if not all(k in a for k in ("title", "slug", "url", "themeScripture", "datePublished"))
            ]
            if n < 300 or len(arts) != n or bad:
                fail("H5", f"articles.json inconsistent ({n} declared, {len(arts)} found)")
            else:
                ok("H5", f"api/articles.json valid — {n} articles, {len(data.get('categories', []))} categories")
        except Exception as exc:  # noqa: BLE001
            fail("H5", f"articles.json unparseable: {exc}")

    # H6 — robots.txt speaks to named AI agents and does not block them
    rb = os.path.join(DIST, "robots.txt")
    if os.path.exists(rb):
        r = read(rb)
        wanted = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot"]
        absent = [a for a in wanted if f"User-agent: {a}" not in r]
        blocked = [
            a for a in wanted
            if re.search(rf"User-agent:\s*{a}\s*\n(?:.*\n){{0,3}}?Disallow:\s*/\s*$", r, re.M)
        ]
        if absent:
            fail("H6", f"robots.txt silent on AI agents: {absent}")
        elif blocked:
            fail("H6", f"robots.txt blocks named AI agents: {blocked}")
        else:
            ok("H6", f"robots.txt names {len(wanted)} AI crawlers and allows each")
    else:
        fail("H6", "robots.txt missing")

    # H7 — the identity graph is on every page and resolvable by @id
    h7: list[str] = []
    for p in pages:
        try:
            rel = os.path.relpath(p, DIST)
        except ValueError:
            continue
        if rel.startswith(("404", "offline")):
            continue
        t = read(p)
        blocks = re.findall(
            r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', t, re.S
        )
        if not blocks:
            h7.append(f"{rel}: no JSON-LD")
            continue
        try:
            data = json.loads(blocks[0])
        except Exception:  # noqa: BLE001
            h7.append(f"{rel}: bad JSON-LD")
            continue
        if "@graph" not in data:
            h7.append(f"{rel}: not an @graph")
            continue
        ids = {n.get("@id") for n in data["@graph"] if isinstance(n, dict)}
        want = {f"{origin}/#organization", f"{origin}/about/#ellis-graham"}
        if not want <= ids:
            h7.append(f"{rel}: graph missing publisher/author @id")
    if h7:
        fail("H7", "identity graph gaps: " + "; ".join(h7[:4]))
    else:
        ok("H7", f"every page carries a resolvable @graph (publisher + author by @id)")


def check_feeds(pages: list[str]) -> None:
    rss = os.path.join(DIST, "rss.xml")
    if not os.path.exists(rss):
        fail("G1", "rss.xml missing")
    else:
        try:
            root = ET.parse(rss).getroot()
            items = root.findall(".//item")
            if len(items) < 100:
                warn("G1", f"rss.xml has only {len(items)} items")
            else:
                ok("G1", f"rss.xml well-formed, {len(items)} items")
        except ET.ParseError as exc:
            fail("G1", f"rss.xml unparseable: {exc}")

    if os.path.exists(rss):
        raw = read(rss)
        if "content:encoded" not in raw:
            warn("G3", "rss.xml carries no content:encoded — subscribers must click out")
        elif 'xmlns:dc=' not in raw:
            warn("G3", "rss.xml has content but no Dublin Core creator namespace")
        else:
            ok("G3", "rss.xml carries content:encoded + dc:creator")

    for f in ("ads.txt", "favicon.svg"):
        if not os.path.exists(os.path.join(DIST, f)):
            fail("G2", f"{f} missing")
    if not any(r[1] == "G2" for r in results):
        ok("G2", "ads.txt + favicon.svg present")


# ---------------------------------------------------------------- H. images
def check_images(pages: list[str]) -> None:
    bad: list[str] = []
    count = 0
    for p in pages:
        t = read(p)
        name = os.path.relpath(p, DIST)
        for tag in re.findall(r"<img\b[^>]*>", t):
            count += 1
            if not re.search(r'\salt="[^"]+"', tag):
                bad.append(f"{name}: img without alt")
            if not (re.search(r'\swidth="', tag) and re.search(r'\sheight="', tag)):
                bad.append(f"{name}: img without width/height")
    if bad:
        warn("H1", "; ".join(bad[:6]))
    else:
        ok("H1", f"{count} <img> elements, all with alt and dimensions")

    # H2 — the declared og:image must be a real 1200x630 PNG
    import struct

    og = os.path.join(DIST, "images", "og-default.png")
    if os.path.exists(og):
        head = open(og, "rb").read(33)
        if head[:8] != b"\x89PNG\r\n\x1a\n":
            fail("H2", "og-default.png is not a PNG")
        else:
            w, h = struct.unpack(">II", head[16:24])
            if (w, h) != (1200, 630):
                fail("H2", f"og-default.png is {w}x{h}, not 1200x630")
            else:
                ok("H2", "og-default.png is a true 1200x630 PNG")

    # H3 — the LCP image must be eager, below-the-fold images lazy
    h3: list[str] = []
    for p in pages:
        t = read(p)
        name = os.path.relpath(p, DIST)
        for tag in re.findall(r"<img\b[^>]*>", t):
            src = re.search(r'src="([^"]+)"', tag)
            if not src:
                continue
            is_hero = "hero-dawn" in src.group(1) or "open-scripture.jpg" in src.group(1)
            if is_hero and 'fetchpriority="high"' not in tag and "loading=\"eager\"" not in tag:
                h3.append(f"{name}: hero image not prioritised")
            if not is_hero and 'loading="lazy"' not in tag:
                h3.append(f"{name}: non-hero image not lazy")
    if h3:
        warn("H3", "; ".join(sorted(set(h3))[:6]))
    else:
        ok("H3", "hero images eager/high-priority, all others lazy")


LIGHTHOUSE_MAP = [
    ("A1", "document-title / unique titles"),
    ("A2", "meta-description / unique descriptions"),
    ("A3", "is-crawlable, viewport, hreflang, charset"),
    ("A4", "robots directives, hreflang, theme-color"),
    ("A5", "SERP title truncation"),
    ("B1", "crawlable-anchors + social previews"),
    ("B3", "social image alt text + MIME type"),
    ("C1", "structured-data validity (no parse errors)"),
    ("C2", "structured-data completeness (required types)"),
    ("C3", "Article rich-result required/recommended properties"),
    ("C4", "page-type schema matches the page"),
    ("C5", "glossary DefinedTermSet with anchored terms"),
    ("D1", "heading-order, single-h1, landmarks"),
    ("E1", "sitemap validity"),
    ("E2", "sitemap covers canonicals"),
    ("E5", "/sitemap.xml flat sitemap"),
    ("E8", "no accidental noindex"),
    ("E6", "sitemap lastmod/priority metadata"),
    ("E7", "404 document is noindex"),
    ("F1", "crawlable-anchors / internal link integrity"),
    ("F2", "orphan-page check"),
    ("H4", "llms.txt machine index"),
    ("H5", "structured corpus endpoint"),
    ("H6", "AI crawler policy"),
    ("H7", "cite-able identity graph"),
    ("G1", "RSS validity"),
    ("G3", "RSS full-content delivery"),
    ("H1", "image-alt, unsized-images"),
    ("H2", "og:image real dimensions"),
    ("H3", "LCP image priority + lazy loading"),
]


def main() -> None:
    if not os.path.isdir(DIST):
        print("ERROR: dist/ not found — run `npm run build` first.")
        sys.exit(1)

    # Origin resolution mirrors astro.config.mjs: an explicit env override wins,
    # otherwise the fallback domain the site is actually served from.
    origin = SITE_FALLBACK
    env = os.environ.get("PUBLIC_SITE_URL")
    if env:
        origin = env.rstrip("/")
    else:
        m = re.search(r"'site:\s*'([^']+)'", open("astro.config.mjs", encoding="utf-8").read())
        if m:
            origin = m.group(1).rstrip("/")

    pages = page_paths()
    print(f"SEO audit — {len(pages)} pages in dist/ (origin {origin})\n")

    check_head(pages)
    check_social(pages)
    check_jsonld(pages)
    check_semantics(pages)
    check_indexability(pages, origin)
    check_flat_sitemap(pages, origin)
    check_links(pages, origin)
    check_ai_readiness(pages, origin)
    check_feeds(pages)
    check_images(pages)

    width = max(len(c) for _, c, _ in results) + 2
    for level, code, msg in results:
        mark = {"PASS": "PASS", "FAIL": "FAIL", "WARN": "WARN"}[level]
        print(f"{mark:5s} {code:{width}s} {msg}")

    fails = [r for r in results if r[0] == "FAIL"]
    warns = [r for r in results if r[0] == "WARN"]
    print()
    if fails:
        print(f"FAILED: {len(fails)} check(s) need fixing; {len(warns)} warning(s).")
        sys.exit(1)
    print(f"SUCCESS: {len(results)} SEO checks passed ({len(warns)} warning(s)).")


if __name__ == "__main__":
    main()
