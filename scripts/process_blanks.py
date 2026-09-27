import cv2
import numpy as np
import os

os.makedirs('public/blanks', exist_ok=True)

raw_files = {
    'tshirt': r'C:\Users\Rajarajan\.gemini\antigravity-ide\brain\1cd575d5-b35f-47ed-be65-f31434c75e53\tshirt_chroma_green_1790477142726.jpg',
    'polo': r'C:\Users\Rajarajan\.gemini\antigravity-ide\brain\1cd575d5-b35f-47ed-be65-f31434c75e53\polo_chroma_green_1790476865138.jpg',
    'hoodie': r'C:\Users\Rajarajan\.gemini\antigravity-ide\brain\1cd575d5-b35f-47ed-be65-f31434c75e53\hoodie_chroma_green_1790477253164.jpg',
    'cap': r'C:\Users\Rajarajan\.gemini\antigravity-ide\brain\1cd575d5-b35f-47ed-be65-f31434c75e53\cap_chroma_green_1790477359066.jpg',
}

# 8 Color palette matching products.ts
PALETTE = {
    'white': {'hex': '#FFFFFF', 'bgr': [255, 255, 255]},
    'black': {'hex': '#121212', 'bgr': [18, 18, 18]},
    'navy': {'hex': '#0A192F', 'bgr': [47, 25, 10]},
    'heather-grey': {'hex': '#9CA3AF', 'bgr': [175, 163, 156]},
    'emerald': {'hex': '#065F46', 'bgr': [70, 95, 6]},
    'crimson': {'hex': '#991B1B', 'bgr': [27, 27, 153]},
    'amber': {'hex': '#D97706', 'bgr': [6, 119, 217]},
    'sand': {'hex': '#D7C4B7', 'bgr': [183, 196, 215]},
}

def cutout_chroma(img_path):
    img = cv2.imread(img_path)
    h, w = img.shape[:2]
    
    b, g, r = img[:, :, 0], img[:, :, 1], img[:, :, 2]
    # Green chroma key condition
    is_green = (g > 130) & (g > b * 1.35) & (g > r * 1.35)
    
    # Cap shadow under visor is also on green, clean it
    is_dark_green = (g > 50) & (g > b * 1.2) & (g > r * 1.2)
    is_bg = is_green | is_dark_green

    alpha = np.where(is_bg, 0, 255).astype(np.uint8)

    # Defringe green spill on border
    kernel = np.ones((3, 3), np.uint8)
    edge = cv2.dilate(is_bg.astype(np.uint8), kernel) - is_bg.astype(np.uint8)
    edge_pixels = edge > 0
    neutral_edge = (r[edge_pixels].astype(int) + b[edge_pixels].astype(int)) // 2
    img[edge_pixels, 1] = np.minimum(img[edge_pixels, 1], neutral_edge)

    # Smooth alpha slightly for crisp anti-aliasing
    alpha = cv2.GaussianBlur(alpha, (3, 3), 0)

    rgba = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    rgba[:, :, 3] = alpha
    return rgba

for gname, path in raw_files.items():
    master_rgba = cutout_chroma(path)
    h, w = master_rgba.shape[:2]
    cv2.imwrite(f'public/blanks/{gname}_white.png', master_rgba)
    
    alpha = (master_rgba[:, :, 3].astype(float) / 255.0)
    # Texture / shading luminance from the white master
    gray = cv2.cvtColor(master_rgba[:, :, :3], cv2.COLOR_BGR2GRAY).astype(float) / 248.0
    
    for cid, cinfo in PALETTE.items():
        if cid == 'white':
            continue
            
        tbgr = np.array(cinfo['bgr'], dtype=float)
        
        if cid == 'black':
            tint = tbgr * (0.22 + 0.78 * np.clip(gray, 0.05, 1.2))[:, :, None]
        elif cid == 'navy':
            tint = tbgr * (0.30 + 0.70 * np.clip(gray, 0.05, 1.2))[:, :, None]
        elif cid in ['heather-grey', 'sand']:
            tint = tbgr * (0.15 + 0.85 * np.clip(gray, 0.1, 1.15))[:, :, None]
        else:
            tint = tbgr * np.clip(gray, 0.05, 1.25)[:, :, None]
            
        out = np.zeros((h, w, 4), dtype=np.uint8)
        out[:, :, :3] = np.clip(tint, 0, 255).astype(np.uint8)
        out[:, :, 3] = (alpha * 255).astype(np.uint8)
        
        cv2.imwrite(f'public/blanks/{gname}_{cid}.png', out)

print("All 32 commercial grade isolated blanks generated successfully in public/blanks/!")
