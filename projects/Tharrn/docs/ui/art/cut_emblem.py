"""Cuts the T emblem out of the owner's title concept (docs/ui/Title_MainMenu_Concept.png, 1024 x 1024) along a traced
outline, feathered by a pixel. Writes the emblem with alpha, a preview over grey and the outline drawn on the concept.

    python projects/Tharrn/docs/ui/art/cut_emblem.py projects/Tharrn/docs/ui/Title_MainMenu_Concept.png
        projects/Tharrn/docs/ui/art/tharrn-emblem.png preview.jpg check.png   (one line)
"""
import sys

from PIL import Image, ImageDraw, ImageFilter

# Clockwise from the top-left corner of the bar.
OUTLINE = [
    (169, 124), (190, 103), (834, 103), (856, 124),
    (856, 212), (838, 232), (822, 262), (720, 262), (714, 250), (612, 250),
    (610, 640), (512, 748),
    (414, 642), (412, 246),
    (300, 246), (296, 262), (200, 262), (188, 250), (169, 232),
]

src, out, preview, check = sys.argv[1:5]
scale = 4  # draw the mask large and shrink it, for smooth diagonal edges
im = Image.open(src).convert("RGB")
mask = Image.new("L", (im.width * scale, im.height * scale), 0)
ImageDraw.Draw(mask).polygon([(x * scale, y * scale) for x, y in OUTLINE], fill=255)
mask = mask.resize(im.size, Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.6))
rgba = im.copy()
rgba.putalpha(mask)
xs, ys = [p[0] for p in OUTLINE], [p[1] for p in OUTLINE]
box = (min(xs) - 4, min(ys) - 4, max(xs) + 5, max(ys) + 5)
rgba = rgba.crop(box)
rgba.save(out)
bg = Image.new("RGBA", rgba.size, (90, 96, 104, 255))
bg.alpha_composite(rgba)
bg.convert("RGB").save(preview)
c = im.copy()
ImageDraw.Draw(c).line(OUTLINE + [OUTLINE[0]], fill=(0, 255, 255), width=1)
c.crop((140, 80, 880, 770)).resize((1480, 1380), Image.NEAREST).save(check)
print("box", box, rgba.size)
