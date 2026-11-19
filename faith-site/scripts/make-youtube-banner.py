#!/usr/bin/env python3
"""
YouTube channel art for Live In Jesus Name.

Generates the three assets the channel actually needs, from the site's own brand tokens
(--bg, --gold, --ink in src/styles/global.css) and the horizon-cross emblem in
public/favicon.svg. A palette change is a re-run, not a redesign.

    youtube-banner.png           2560 x 1440   channel banner
    youtube-banner-light.png     2560 x 1440   same, Dawn/ivory theme
    youtube-avatar.png            800 x  800   profile picture
    youtube-watermark.png         150 x  150   branding watermark

The banner layout obeys YouTube's crop rule, which is the reason most banners fail: a
2560x1440 upload is cropped differently on TV, desktop and mobile, and only the central
1546x423 band survives every crop. Nothing legible is drawn outside that band — see
scripts/verify-youtube-art.py, which re-checks this against real crops.

Usage:
    python3 scripts/make-youtube-banner.py
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).resolve().parent
SITE = HERE.parent
FONTS = SITE / "public" / "fonts"
IMAGES = SITE / "public" / "images"

W, H = 2560, 1440

# The band every device crop preserves. Everything legible lives inside it.
SAFE_X0, SAFE_Y0, SAFE_X1, SAFE_Y1 = 507, 509, 2053, 931
SAFE_CX = (SAFE_X0 + SAFE_X1) // 2
SAFE_CY = (SAFE_Y0 + SAFE_Y1) // 2

# Dark theme (--bg / --gold / --ink) and light theme, both from global.css.
THEMES = {
    "dark": {
        "bg_top": (0x0D, 0x11, 0x17),
        "bg_bottom": (0x10, 0x18, 0x23),
        "gold": (0xD4, 0xAF, 0x6A),
        "ink": (0xED, 0xE8, 0xDF),
        "muted": (0x9A, 0xA3, 0xAE),
        "cool": (0x3A, 0x4A, 0x63),
        "glow": 0.42,
        "vignette_rgb": (0x07, 0x09, 0x0D),
        "vignette": 0.35,
    },
    "light": {
        # --bg #FAF7F0 → #F7F2E7, gold-text #7A5C1B (AA on ivory), ink #1A1714
        "bg_top": (0xFA, 0xF7, 0xF0),
        "bg_bottom": (0xF7, 0xF2, 0xE7),
        "gold": (0xB0, 0x8D, 0x3E),
        "ink": (0x1A, 0x17, 0x14),
        "muted": (0x5C, 0x54, 0x50),
        "cool": (0xE8, 0xDF, 0xCC),
        "glow": 0.55,
        "vignette_rgb": (0xE4, 0xDA, 0xC4),
        "vignette": 0.55,
    },
}

FRAUNCES = FONTS / "fraunces-latin-opsz-normal.woff2"
INTER = FONTS / "inter-latin-wght-normal.woff2"

HORIZON_Y = SAFE_CY + 6


def build_background(t: dict[str, object], scale: int = 4) -> Image.Image:
    """Vertical grade plus soft light sources, computed analytically.

    Stacking blurred ellipses left visible blotches, so each Gaussian is evaluated per
    pixel at quarter resolution and upscaled — the upscale interpolates smoothly and
    costs less than a large blur.
    """
    emblem_x = SAFE_X0 + 210
    w, h = W // scale, H // scale

    glows = [
        (emblem_x + 30, HORIZON_Y - 20, 880, t["gold"], t["glow"]),
        (SAFE_CX + 780, SAFE_CY - 430, 700, t["cool"], 0.18),
    ]

    img = Image.new("RGB", (w, h))
    px = img.load()
    top, bottom = t["bg_top"], t["bg_bottom"]

    for y in range(h):
        fy = y * scale
        g = fy / (H - 1)
        base = [top[i] + (bottom[i] - top[i]) * g for i in range(3)]

        for x in range(w):
            fx = x * scale
            r, gg, b = base
            for gx, gy, radius, colour, strength in glows:
                d = math.hypot(fx - gx, fy - gy)
                a = strength * math.exp(-((d / radius) ** 2) * 2.0)
                if a > 0.002:
                    r += colour[0] * a
                    gg += colour[1] * a
                    b += colour[2] * a
            px[x, y] = (min(255, int(r)), min(255, int(gg)), min(255, int(b)))

    return img.resize((W, H), Image.Resampling.BICUBIC)


def draw_horizon(img: Image.Image, t: dict[str, object]) -> None:
    """The emblem's horizon rule, extended and faded so it never touches the frame edge.

    It stops short of the wordmark, because a hairline crossing type reads as a
    strikethrough rather than a horizon.
    """
    text_x = SAFE_X0 + 210 + 132 + 112
    x_start, x_end = 44, text_x - 96
    peak = SAFE_X0 + 210
    thickness = 2

    strip = Image.new("L", (W, 1), 0)
    spx = strip.load()
    for x in range(x_start, x_end):
        if x <= peak:
            a = ((x - x_start) / max(peak - x_start, 1)) ** 2.0
        else:
            a = ((x_end - x) / max(x_end - peak, 1)) ** 1.5
        spx[x, 0] = int(255 * max(0.0, min(1.0, a)))

    band = strip.resize((W, thickness), Image.Resampling.BILINEAR)
    mask = Image.new("L", (W, H), 0)
    mask.paste(band, (0, HORIZON_Y - thickness // 2))
    img.paste(Image.new("RGB", (W, H), t["gold"]), (0, 0), mask)


def draw_emblem(draw: ImageDraw.ImageDraw, cx: int, cy: int, r: int, t: dict[str, object]) -> None:
    """Horizon-cross emblem, redrawn from public/favicon.svg at arbitrary scale."""
    draw.arc([cx - r, cy - r, cx + r, cy + r], start=180, end=360, fill=t["gold"], width=max(2, r // 19))

    axis_top = cy - int(r * 1.62)
    draw.line(
        [(cx, axis_top), (cx, cy + int(r * 0.60))],
        fill=t["ink"],
        width=max(2, r // 22),
    )

    bar_y = cy - int(r * 1.16)
    bar_half = int(r * 0.40)
    draw.line(
        [(cx - bar_half, bar_y), (cx + bar_half, bar_y)],
        fill=t["gold"],
        width=max(2, r // 22),
    )


def load_font(path: Path, size: int, axes: list[float] | None = None) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(path), size)
    if axes is not None:
        try:
            font.set_variation_by_axes(axes)
        except Exception:
            pass
    return font


def draw_tracked_text(
    draw: ImageDraw.ImageDraw,
    xy: tuple[float, float],
    text: str,
    font: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
    tracking: float = 0.0,
) -> float:
    """Draw text with optional letter-spacing (PIL has none built in). Returns width."""
    if not tracking:
        draw.text(xy, text, font=font, fill=fill)
        return font.getlength(text)

    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += font.getlength(ch) + tracking
    return x - xy[0] - tracking


def build_banner(theme: str) -> Image.Image:
    t = THEMES[theme]
    img = build_background(t)
    draw_horizon(img, t)

    draw = ImageDraw.Draw(img)
    emblem_x, r = SAFE_X0 + 210, 132
    draw_emblem(draw, emblem_x, HORIZON_Y, r, t)

    text_x = emblem_x + r + 112

    # --- Wordmark --------------------------------------------------------
    mark = "Live In Jesus Name"
    mark_font = load_font(FRAUNCES, 120, [144, 900])
    ascent, descent = mark_font.getmetrics()

    # Optically centre the lockup on the safe band, not the canvas.
    mark_y = SAFE_CY - (ascent + descent) // 2 - 40
    draw_tracked_text(draw, (text_x, mark_y), mark, mark_font, t["ink"], tracking=0.5)

    mark_w = mark_font.getlength(mark) + 0.5 * (len(mark) - 1)
    rule_y = mark_y + ascent + 40
    draw.line([(text_x, rule_y), (text_x + mark_w * 0.26, rule_y)], fill=t["gold"], width=3)

    # --- Tagline ---------------------------------------------------------
    tag_font = load_font(INTER, 40, [400])
    draw_tracked_text(
        draw, (text_x, rule_y + 32), "The entrance of His Word gives light.", tag_font, t["gold"], tracking=0.4
    )

    # --- Address ---------------------------------------------------------
    url_font = load_font(INTER, 30, [500])
    draw_tracked_text(draw, (text_x, rule_y + 100), "lij.name.ng", url_font, t["muted"], tracking=1.8)

    # --- Vignette --------------------------------------------------------
    vignette = Image.new("L", (W, H), 0)
    strength = int(255 * (1 - t["vignette"]))
    ImageDraw.Draw(vignette).ellipse([-W * 0.26, -H * 0.34, W * 1.26, H * 1.34], fill=255)
    vignette = vignette.filter(ImageFilter.GaussianBlur(200))
    vignette = vignette.point(lambda v: strength + (255 - strength) * v / 255)
    return Image.composite(img, Image.new("RGB", (W, H), t["vignette_rgb"]), vignette)


def build_avatar(theme: str, size: int = 800) -> Image.Image:
    """Emblem only. YouTube renders this as a circle at every size, so the emblem is
    kept inside a centred disc with generous margin — a wordmark would be unreadable
    at 48px in a comment thread."""
    t = THEMES[theme]

    # Analytic radial warmth. The earlier concentric-ellipse loop left visible bands,
    # so this evaluates a Gaussian per pixel — the same fix as the banner background.
    cx, cy = size / 2, size * 0.54
    radius = size * 0.52
    img = Image.new("RGB", (size, size))
    px = img.load()
    for y in range(size):
        for x in range(size):
            d = math.hypot(x - cx, y - cy)
            a = 0.55 * math.exp(-((d / radius) ** 2) * 2.2)
            px[x, y] = tuple(
                min(255, int(t["bg_top"][k] + (t["gold"][k] - t["bg_top"][k]) * a)) for k in range(3)
            )

    # YouTube crops the avatar to a circle. At 0.30 the arc ends and the axis tip landed
    # within a few pixels of the circle edge, so the emblem is drawn smaller and nudged
    # down: the whole mark then sits inside ~86% of the radius.
    draw = ImageDraw.Draw(img)
    draw_emblem(draw, size // 2, int(size * 0.62), int(size * 0.235), t)
    return img


def build_watermark(size: int = 150) -> Image.Image:
    """Bottom-right mark shown over every video. Transparent PNG: the video shows
    through, so it must not carry a filled background."""
    t = THEMES["dark"]
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw_emblem(draw, size // 2, int(size * 0.62), int(size * 0.33), t)
    # Lighten to read on both bright and dark footage.
    return img


def main() -> None:
    IMAGES.mkdir(parents=True, exist_ok=True)

    outputs = [
        ("youtube-banner.png", build_banner("dark")),
        ("youtube-banner-light.png", build_banner("light")),
        ("youtube-avatar.png", build_avatar("dark")),
        ("youtube-avatar-light.png", build_avatar("light")),
        ("youtube-watermark.png", build_watermark()),
    ]

    for name, image in outputs:
        path = IMAGES / name
        image.save(path, "PNG", optimize=True)
        kb = path.stat().st_size / 1024
        print(f"  {name:30} {image.width}x{image.height:<6} {kb:7.0f} KB")


if __name__ == "__main__":
    main()
