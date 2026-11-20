#!/usr/bin/env python3
"""
Package the generated video scripts as downloadable zips.

The scripts themselves are gitignored (5.7 MB of build output, rebuilt by
`npm run video:scripts`), which is right for the repository but unhelpful for anyone who
wants the files without installing Node and Python. This turns them into four archives:

    lij-video-scripts-all.zip        everything — scripts, specs, index, README
    lij-video-scripts-markdown.zip   the readable scripts only, for reading or printing
    lij-vidlyrics-specs.zip          the .json specs only, for feeding to VidLyrics
    lij-video-scripts-FIRST-7.zip    the first seven to publish, from the channel kit

Usage:
    npm run video:scripts      # generate first
    python3 scripts/make-video-pack.py

Output: ../download/ (repo root, outside the ignored folder so it is easy to find)
"""

from __future__ import annotations

import csv
import glob
import json
import os
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
SITE = HERE.parent
ROOT = SITE.parent
SCRIPTS = SITE / "video-scripts"
OUT = ROOT / "download"

# The publishing order from youtube-channel-kit.md: the teachings that already have
# proven search demand, beginning with the one that ranked position 1.
FIRST_SEVEN = [
    "what-is-a-sin-cycle-and-where-does-it-break",
    "the-prayer-of-agreement-two-are-better",
    "the-gift-of-the-spirit-is-given-to-every-man-to-profit",
    "when-you-pray-believe-the-order-inside-mark-11-24",
    "clothed-in-righteousness-the-garment-you-did-not-weave",
    "where-two-or-three-are-gathered-the-promise-of-his-presence",
    "the-consciousness-of-sin-produces-the-cycle-of-sin",
]


def write_index() -> int:
    """An index so 371 files are navigable offline without opening each one."""
    rows = []
    for path in sorted(SCRIPTS.glob("*.json")):
        spec = json.loads(path.read_text(encoding="utf-8"))
        words = sum(
            len((s.get("narration") or s.get("text", "")).split()) for s in spec["scenes"]
        )
        rows.append({
            "slug": path.stem,
            "title": spec["title"],
            "theme": spec["theme"],
            "scenes": len(spec["scenes"]),
            "approx_minutes": round(words / spec["voice"]["wpm"], 1),
        })

    rows.sort(key=lambda r: r["title"].lower())
    with (SCRIPTS / "_index.csv").open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(
            fh, fieldnames=["slug", "title", "theme", "scenes", "approx_minutes"]
        )
        writer.writeheader()
        writer.writerows(rows)
    return len(rows)


def archive(name: str, entries: list[tuple[Path, str]]) -> int:
    path = OUT / name
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for source, arcname in entries:
            if source.exists():
                zf.write(source, arcname)

    # Verify what was written rather than trusting the writer.
    with zipfile.ZipFile(path) as zf:
        corrupt = zf.testzip()
        assert corrupt is None, f"{name} is corrupt at {corrupt}"
    return path.stat().st_size


def main() -> None:
    if not any(SCRIPTS.glob("*.json")):
        raise SystemExit("no scripts found — run `npm run video:scripts` first")

    count = write_index()
    OUT.mkdir(parents=True, exist_ok=True)

    docs = SITE / "VIDEO_SCRIPTS.md"
    readme_arc = "video-scripts/README.md"

    all_files = sorted(SCRIPTS.glob("*"))
    md_files = [p for p in all_files if p.suffix == ".md" and p.name != "README.md"]
    json_files = [p for p in all_files if p.suffix == ".json"]

    packs = [
        (
            "lij-video-scripts-all.zip",
            [(docs, readme_arc), (SCRIPTS / "_index.csv", "video-scripts/_index.csv")]
            + [(p, f"video-scripts/{p.name}") for p in md_files + json_files],
        ),
        (
            "lij-video-scripts-markdown.zip",
            [(docs, readme_arc), (SCRIPTS / "_index.csv", "video-scripts/_index.csv")]
            + [(p, f"video-scripts/{p.name}") for p in md_files],
        ),
        (
            "lij-vidlyrics-specs.zip",
            [(p, f"video-scripts/{p.name}") for p in json_files],
        ),
        (
            "lij-video-scripts-FIRST-7.zip",
            [(docs, readme_arc)]
            + [
                (SCRIPTS / f"{slug}{ext}", f"video-scripts/{slug}{ext}")
                for slug in FIRST_SEVEN
                for ext in (".md", ".json")
            ],
        ),
    ]

    print(f"indexed {count} teachings")
    for name, entries in packs:
        size = archive(name, entries)
        print(f"  {name:34} {size / 1024:8.0f} KB")

    print(f"\nwritten to {OUT}")


if __name__ == "__main__":
    main()
