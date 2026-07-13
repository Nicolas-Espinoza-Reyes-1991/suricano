"""Generate branded El Suricano QR pointing to the carta."""
from pathlib import Path

import qrcode
from PIL import Image, ImageDraw, ImageFont
from qrcode.constants import ERROR_CORRECT_H
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.colormasks import SolidFillColorMask
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer

ROOT = Path(__file__).resolve().parents[1]
LOGO_PATH = ROOT / "assets" / "logo-circle.png"
OUT_DIR = ROOT / "assets"
URL = "https://suricano.pages.dev/#carta"

INK = (26, 15, 22)
GOLD = (240, 180, 41)
CREAM = (255, 246, 232)
MAGENTA = (139, 42, 98)
RED = (206, 17, 38)
GREEN = (0, 104, 71)


def load_font(size: int, bold: bool = False):
    candidates = (
        ["C:/Windows/Fonts/arialbd.ttf"] if bold else ["C:/Windows/Fonts/arial.ttf"]
    )
    candidates += [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def make_qr() -> Image.Image:
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,
        box_size=28,
        border=2,
    )
    qr.add_data(URL)
    qr.make(fit=True)

    qr_img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer(),
        color_mask=SolidFillColorMask(back_color=CREAM, front_color=INK),
    ).convert("RGBA")

    logo = Image.open(LOGO_PATH).convert("RGBA")
    qr_w, _ = qr_img.size
    logo_size = int(qr_w * 0.28)
    logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)

    mask = Image.new("L", (logo_size, logo_size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, logo_size - 1, logo_size - 1), fill=255)
    logo_circ = Image.new("RGBA", (logo_size, logo_size), (0, 0, 0, 0))
    logo_circ.paste(logo, (0, 0), mask=mask)

    pad = int(logo_size * 0.12)
    plate = logo_size + pad * 2
    plate_img = Image.new("RGBA", (plate, plate), (0, 0, 0, 0))
    pd = ImageDraw.Draw(plate_img)
    pd.ellipse((0, 0, plate - 1, plate - 1), fill=GOLD + (255,))
    inner = 6
    pd.ellipse(
        (inner, inner, plate - 1 - inner, plate - 1 - inner),
        fill=CREAM + (255,),
    )
    ox = (plate - logo_size) // 2
    plate_img.paste(logo_circ, (ox, ox), logo_circ)

    pos = ((qr_w - plate) // 2, (qr_img.size[1] - plate) // 2)
    qr_img.paste(plate_img, pos, plate_img)
    return qr_img


def center_text(draw, text, y, font, fill, canvas_w):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((canvas_w - tw) // 2, y), text, font=font, fill=fill)


def make_mesa_card(qr_img: Image.Image) -> Image.Image:
    card_size = 2000
    card = Image.new("RGB", (card_size, card_size), MAGENTA)
    draw = ImageDraw.Draw(card)

    margin = 70
    draw.rounded_rectangle(
        (margin, margin, card_size - margin, card_size - margin),
        radius=80,
        fill=CREAM,
        outline=GOLD,
        width=18,
    )
    draw.rounded_rectangle(
        (margin + 36, margin + 36, card_size - margin - 36, card_size - margin - 36),
        radius=60,
        outline=MAGENTA,
        width=4,
    )

    stripe_h = 28
    draw.rectangle((margin, margin, card_size - margin, margin + stripe_h), fill=GREEN)
    draw.rectangle(
        (margin, margin + stripe_h, card_size - margin, margin + stripe_h * 2),
        fill=CREAM,
    )
    draw.rectangle(
        (margin, margin + stripe_h * 2, card_size - margin, margin + stripe_h * 3),
        fill=RED,
    )

    font_title = load_font(72, bold=True)
    font_sub = load_font(40)
    font_url = load_font(28)

    center_text(draw, "EL SURICANO", 160, font_title, MAGENTA, card_size)
    center_text(draw, "Escanea y arma tu pedido", 250, font_sub, INK, card_size)

    qr_side = 1180
    qr_fitted = qr_img.resize((qr_side, qr_side), Image.Resampling.LANCZOS)
    qx = (card_size - qr_side) // 2
    qy = 340
    draw.rounded_rectangle(
        (qx - 24, qy - 24, qx + qr_side + 24, qy + qr_side + 24),
        radius=40,
        fill=(255, 255, 255),
        outline=GOLD,
        width=8,
    )
    card.paste(qr_fitted, (qx, qy), qr_fitted)

    center_text(draw, "suricano.pages.dev/#carta", 1600, font_url, (90, 60, 75), card_size)
    center_text(draw, "Fast & Mexican", 1665, font_sub, GOLD, card_size)
    return card


def main():
    qr_img = make_qr()
    clean = OUT_DIR / "qr-carta.png"
    qr_img.save(clean, "PNG", optimize=True)
    print(f"Wrote {clean} {qr_img.size}")

    mesa = make_mesa_card(qr_img)
    mesa_path = OUT_DIR / "qr-carta-mesa.png"
    mesa.save(mesa_path, "PNG", optimize=True)
    print(f"Wrote {mesa_path} {mesa.size}")

    small = qr_img.resize((800, 800), Image.Resampling.LANCZOS)
    small_path = OUT_DIR / "qr-carta-sm.png"
    small.save(small_path, "PNG", optimize=True)
    print(f"Wrote {small_path}")


if __name__ == "__main__":
    main()
