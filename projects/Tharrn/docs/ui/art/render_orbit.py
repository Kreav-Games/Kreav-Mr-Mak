"""Draws Tharrn from orbit for the title and main menu mock-ups (1920 x 1080 JPEGs in docs/ui/backdrops/): the ocean
world's night limb with the great island, the Lattice glowing through its rock (the signal, story.md), the two
planets in its sky, stars and a faint nebula. A stand-in for the game's live scene (Unreal's SkyAtmosphere seen from
orbit), so the mock-ups show the idea, not final art.

    python projects/Tharrn/docs/ui/art/render_orbit.py
"""
import os

import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "backdrops")
W, H = 1920, 1080


def value_noise(shape, cells, rng):
    """Smooth noise in 0..1: a random grid of cells x cells, interpolated with smoothstep."""
    gy, gx = cells
    grid = rng.random((gy + 2, gx + 2))
    ys = np.linspace(0, gy, shape[0], endpoint=False)
    xs = np.linspace(0, gx, shape[1], endpoint=False)
    y0, x0 = ys.astype(int), xs.astype(int)
    fy, fx = ys - y0, xs - x0
    fy, fx = fy * fy * (3 - 2 * fy), fx * fx * (3 - 2 * fx)
    a = grid[y0][:, x0]
    b = grid[y0][:, x0 + 1]
    c = grid[y0 + 1][:, x0]
    d = grid[y0 + 1][:, x0 + 1]
    top = a + (b - a) * fx[None, :]
    bottom = c + (d - c) * fx[None, :]
    return top + (bottom - top) * fy[:, None]


def fbm(shape, base, octaves, rng):
    total, amp, norm = np.zeros(shape), 1.0, 0.0
    for i in range(octaves):
        cells = (base[0] * 2 ** i, base[1] * 2 ** i)
        total += amp * value_noise(shape, cells, rng)
        norm += amp
        amp *= 0.5
    return total / norm


def sample(tex, u, v):
    """Looks up a texture (h, w) at u, v in 0..1 (wrapping), nearest."""
    h, w = tex.shape[:2]
    return tex[(np.clip(v, 0, 0.9999) * h).astype(int), (np.mod(u, 1.0) * w).astype(int)]


def sphere(cx, cy, r, light):
    """Per pixel inside a sphere seen face-on: mask, normal (x right, y down, z to the viewer) and lambert lighting."""
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    nx, ny = (xx - cx) / r, (yy - cy) / r
    d2 = nx * nx + ny * ny
    inside = d2 < 1.0
    nz = np.sqrt(np.clip(1.0 - d2, 0, 1))
    l = np.array(light, dtype=np.float32)
    l /= np.linalg.norm(l)
    lam = np.clip(nx * l[0] + ny * l[1] + nz * l[2], 0, 1)
    return inside, nx, ny, nz, lam, np.sqrt(d2)


PLANET = os.environ.get("THARRN_PLANET", "D:/Tharrn/Saved/UI/Planet")


def planet_maps():
    """The planet the game paints from the main map (the game repo's Tools/UI/make_planet_textures.py), or None."""
    try:
        bc = np.asarray(Image.open(os.path.join(PLANET, "T_TharrnPlanet_BC.png")).convert("RGB"), np.float32) / 255.0
        m = np.asarray(Image.open(os.path.join(PLANET, "T_TharrnPlanet_M.png")).convert("RGBA"), np.float32) / 255.0
        return bc ** 2.2, m                                                   # colour to linear light
    except OSError:
        return None


def planet_lookup(nx, ny, nz, n0, lat0, lon0):
    """Turns view-space sphere normals into the planet's latitude and longitude, so that the normal n0 (where the
    island should appear) looks at (lat0, lon0) with the planet's north towards the top of the screen."""
    n0 = np.array(n0, np.float64) / np.linalg.norm(n0)
    up = np.array([0.0, -1.0, 0.0]) - n0 * (-n0[1])
    up /= np.linalg.norm(up)
    right = np.cross(up, n0)
    right = -right if right[0] < 0 else right
    la, lo = np.radians(lat0), np.radians(lon0)
    p0 = np.array([np.cos(la) * np.cos(lo), np.cos(la) * np.sin(lo), np.sin(la)])
    north = np.array([-np.sin(la) * np.cos(lo), -np.sin(la) * np.sin(lo), np.cos(la)])
    east = np.array([-np.sin(lo), np.cos(lo), 0.0])
    a = nx * n0[0] + ny * n0[1] + nz * n0[2]
    b = nx * up[0] + ny * up[1] + nz * up[2]
    c = nx * right[0] + ny * right[1] + nz * right[2]
    px, py, pz = a * p0[0] + b * north[0] + c * east[0], a * p0[1] + b * north[1] + c * east[1], a * p0[2] + b * north[2] + c * east[2]
    lat = np.arcsin(np.clip(pz, -1, 1))
    lon = np.arctan2(py, px)
    return np.mod(lon / (2 * np.pi) + 0.5, 1.0), np.clip(0.5 - lat / np.pi, 0, 0.9999)


def sample_rgb(tex, u, v):
    h, w = tex.shape[:2]
    x, y = u * w - 0.5, v * h - 0.5
    x0, y0 = np.floor(x).astype(int), np.floor(y).astype(int)
    fx, fy = (x - x0)[..., None], (y - y0)[..., None]
    x0, x1 = np.mod(x0, w), np.mod(x0 + 1, w)
    y0, y1 = np.clip(y0, 0, h - 1), np.clip(y0 + 1, 0, h - 1)
    return (tex[y0, x0] * (1 - fx) + tex[y0, x1] * fx) * (1 - fy) + (tex[y1, x0] * (1 - fx) + tex[y1, x1] * fx) * fy


def stereo(nx, ny, nz):
    """Face-on hemisphere to a flat map (stereographic): little stretching, natural squeeze towards the limb."""
    return nx / (1 + nz) * 0.5 + 0.5, ny / (1 + nz) * 0.5 + 0.5


def body(img, cx, cy, r, light, col, tex, inside_only=True):
    inside, nx, ny, nz, lam, dist = sphere(cx, cy, r, light)
    u, v = stereo(nx, ny, nz)
    surf = sample(tex, u, v)
    base = np.array(col)[None, None, :] * (0.55 + 0.9 * surf[..., None])
    rim = np.clip(1 - nz, 0, 1) ** 3 * lam
    lit = base * lam[..., None] ** 0.9 + rim[..., None] * np.array(col) * 0.5 + np.array(col) * 0.02
    img = np.where(inside[..., None], lit, img)
    halo = np.exp(-np.clip(dist - 1, 0, None) * r / 5.0) * (dist >= 1) * 0.10
    lit_side = np.clip(nx * light[0] + ny * light[1], 0, 1)
    return img + (halo * (0.3 + lit_side))[..., None] * np.array(col) * 1.5


def render(name, cx, cy, r, sun_x, moons, island_uv, nebula_at, seed=7, light=(0.12, -0.55, -0.83), island_n0=None):
    rng = np.random.default_rng(seed)
    img = np.zeros((H, W, 3), np.float32)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

    # Space: a nebula (Exodus orange in one band, cold blue elsewhere), then stars.
    neb = fbm((H, W), (3, 5), 7, rng)
    neb = np.clip((neb - 0.45) * 2.2, 0, 1) ** 1.4
    bx, by = nebula_at
    band = np.exp(-(((xx - bx) * 0.6 - (yy - by) * 0.8) / 260.0) ** 2) * np.exp(-((yy - by) / 520.0) ** 2)
    img += neb[..., None] * band[..., None] * np.array([0.55, 0.19, 0.045])
    img += neb[..., None] * (1 - band[..., None]) * np.array([0.018, 0.03, 0.055])
    stars = np.zeros((H, W), np.float32)
    n = 3000
    sx, sy = rng.integers(0, W, n), rng.integers(0, H, n)
    stars[sy, sx] = rng.power(0.2, n) * 1.5
    big = Image.fromarray((np.clip(stars, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    stars = np.maximum(stars * 0.75, np.asarray(big, np.float32) / 255.0 * 2.4)
    tint = np.where(rng.random((H, W, 1)) < 0.3, np.array([1.0, 0.72, 0.5]), np.array([0.85, 0.92, 1.0]))
    img += stars[..., None] * tint

    # The two planets in Tharrn's sky (story.md): one large and grey, one small and rust-coloured.
    for (mx, my, mr, col) in moons:
        tex = fbm((512, 512), (6, 6), 6, rng)
        tex = tex + np.clip(0.62 - fbm((512, 512), (14, 14), 3, rng), 0, 1) * 0.6  # dark maria and craters
        img = body(img, mx, my, mr, (0.78, -0.38, -0.2), col, tex)

    # Tharrn: its night side towards us, the sun just behind the limb at sun_x.
    inside, nx, ny, nz, lam, dist = sphere(cx, cy, r, light)
    u, v = stereo(nx, ny, nz)
    clouds = np.clip((sample(fbm((1024, 1024), (10, 10), 7, rng), u, v) - 0.52) * 3.2, 0, 1)
    land_n = sample(fbm((1024, 1024), (8, 8), 7, rng), u, v)
    iu, iv, iru, irv = island_uv
    du, dv = (u - iu) / iru, (v - iv) / irv
    island = np.clip(((1.0 - np.sqrt(du * du + dv * dv)) + (land_n - 0.5) * 1.1) * 5.0, 0, 1)
    # The Lattice: thin bright veins (ridged noise) through the island's rock.
    # Ridges of noise at three scales, so the lines branch like cracks (the T's crack, in the island's rock).
    vein = np.zeros_like(u)
    for cells, weight, width in ((10, 0.85, 0.016), (22, 0.7, 0.014), (46, 0.5, 0.012)):
        ridge = 1.0 - np.abs(sample(fbm((2048, 2048), (cells, cells), 3, rng), u, v) - 0.5) * 2.0
        vein = np.maximum(vein, np.clip((ridge - (1.0 - width)) / width, 0, 1) ** 1.5 * weight)
    vein *= np.clip(island * 1.4 - 0.4, 0, 1)
    day = np.clip(lam * 1.7, 0, 1)
    maps = planet_maps() if island_n0 else None
    if maps:
        # The main map's island, painted by the game (its regions, heights, rivers, lakes), lit by the sun; the
        # Lattice (the mask's red) glows Neural on the night side (story.md).
        bc, m = maps
        pu, pv = planet_lookup(nx, ny, nz, island_n0, 12.0, 0.0)
        albedo = sample_rgb(bc, pu, pv)
        mask = sample_rgb(m, pu, pv)
        water = mask[..., 2:3]
        lit = np.clip(lam * 1.25, 0, 1)[..., None]
        surf = albedo * (0.02 + lit * 1.6) + water * lit * np.array([0.0, 0.02, 0.05])
        surf = surf * (1 - clouds[..., None] * 0.35 * lit) + clouds[..., None] * lit * 0.35
        night = np.clip(1 - lam * 5, 0, 1)
        lattice = mask[..., 0] * night * (1 - clouds * 0.6)
        glow = lattice[..., None] * np.array([0.47, 0.22, 1.0]) * 2.4
        fres = np.clip(1 - nz, 0, 1) ** 5
        term = np.exp(-((lam - 0.04) / 0.06) ** 2)
        atm_in = fres[..., None] * (lam[..., None] * np.array([0.25, 0.6, 1.0]) * 1.6 + term[..., None] * np.array([1.0, 0.42, 0.12]) * 0.5)
        img = np.where(inside[..., None], surf + glow + atm_in, img)
        gl = Image.fromarray((np.clip(glow / 2.4, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(4))
        img += np.asarray(gl, np.float32) / 255.0 * np.array([0.47, 0.22, 1.0]) * 0.9
        return finish(img, name, cx, cy, r, sun_x, inside, nz, dist, xx, yy, rng)
    ocean = np.array([0.004, 0.012, 0.022]) + day[..., None] * np.array([0.05, 0.17, 0.28])
    landc = np.array([0.020, 0.024, 0.026]) + day[..., None] * np.array([0.11, 0.10, 0.06])  # moonlit rock, a little paler than the sea
    surf = ocean * (1 - island[..., None]) + landc * island[..., None]
    surf = surf * (1 - clouds[..., None] * 0.5) + clouds[..., None] * (0.008 + day[..., None] * 0.6)
    night = (1.0 - day) * (1 - clouds * 0.7)
    glow = (vein * night)[..., None] * np.array([1.0, 0.36, 0.05]) * 1.9
    fres = np.clip(1 - nz, 0, 1) ** 5
    term = np.exp(-((lam - 0.04) / 0.06) ** 2)
    atm_in = fres[..., None] * (lam[..., None] * np.array([0.25, 0.6, 1.0]) * 1.6 + term[..., None] * np.array([1.0, 0.42, 0.12]) * 0.5)
    planet = surf + glow + atm_in
    img = np.where(inside[..., None], planet, img)
    # Bloom on the glowing veins, so the island reads from orbit.
    gl = Image.fromarray((np.clip(glow / 1.9, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(5))
    img += np.asarray(gl, np.float32) / 255.0 * np.array([1.0, 0.45, 0.12]) * 1.1
    return finish(img, name, cx, cy, r, sun_x, inside, nz, dist, xx, yy, rng)


def finish(img, name, cx, cy, r, sun_x, inside, nz, dist, xx, yy, rng):
    # The atmosphere's glow outside the limb, strongest near the sun.
    outside = dist >= 1
    near_sun = np.exp(-((xx - sun_x) / 520.0) ** 2)
    halo = np.exp(-(dist - 1) * r / 16.0) * outside
    img += halo[..., None] * ((0.35 + 1.4 * near_sun[..., None]) * np.array([0.32, 0.68, 1.0]) + near_sun[..., None] * np.array([0.6, 0.25, 0.05]))
    limb_y = cy - np.sqrt(max(r * r - (sun_x - cx) ** 2, 0))
    sd = np.sqrt((xx - sun_x) ** 2 + ((yy - limb_y) * 2.2) ** 2)
    beyond = np.where(inside, np.clip(1 - nz * 40.0, 0, 1), 1.0)  # the sun's bloom stays off the planet's face
    img += ((np.exp(-sd / 40.0) * 1.6 + np.exp(-sd / 260.0) * 0.18) * beyond)[..., None] * np.array([1.0, 0.85, 0.65])

    # Grade: filmic curve, a vignette, a little grain.
    vig = 1.0 - 0.42 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) ** 1.2
    img *= np.clip(vig, 0.3, 1)[..., None]
    img = img / (1 + img) * 1.12
    img = np.clip(img ** (1 / 1.12), 0, 1)
    img += (rng.random((H, W, 1)) - 0.5) * 0.012
    Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)).save(os.path.join(OUT, name), quality=92)
    print("wrote", name)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    grey, rust = (0.32, 0.31, 0.30), (0.62, 0.30, 0.14)
    # Title: the limb low behind the wordmark, the island below it in the morning, its east (the desert) still in the
    # night with the Lattice glowing; the planets high on either side.
    render("orbit_title.jpg", W * 0.5, 760 + 1300, 1300, 420, [(250, 250, 165, grey), (1660, 300, 44, rust)],
           (0.44, 0.175, 0.075, 0.032), (1250, 330), light=(-0.75, -0.35, 0.15), island_n0=(0.0, -0.869, 0.494))
    # Main menu: the planet lower right with the island on it, the list's side dark.
    render("orbit_menu.jpg", W * 0.78, 520 + 1100, 1100, 1000, [(1180, 170, 110, grey), (560, 120, 34, rust)],
           (0.47, 0.25, 0.10, 0.05), (1500, 260), seed=11, light=(-0.75, -0.35, 0.15), island_n0=(-0.044, -0.782, 0.622))
