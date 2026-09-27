import cv2
import numpy as np

colors = {
    'black': [18, 18, 18],     # BGR
    'crimson': [27, 27, 153],  # BGR
    'navy': [47, 25, 10],      # BGR
}

models = ['tshirt_model_front', 'polo_model_front', 'hoodie_model_front', 'cap_model_front']
mask_names = ['tshirt_mask', 'polo_mask', 'hoodie_mask', 'cap_mask']

for m, mk in zip(models, mask_names):
    img = cv2.imread(f'public/models/{m}.png')
    mask = cv2.imread(f'public/models/{mk}.png', 0)
    alpha = (mask.astype(float) / 255.0)[:, :, None]
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(float) / 240.0
    gray = np.clip(gray, 0.15, 1.2)[:, :, None]
    
    for cname, bgr in colors.items():
        target = np.array(bgr, dtype=float)
        if cname == 'black':
            # Preserve contrast on dark garments
            tint = target * (0.2 + 0.8 * gray)
        else:
            tint = np.clip(target * gray, 0, 255)
            
        composite = np.clip(img * (1 - alpha) + tint * alpha, 0, 255).astype(np.uint8)
        cv2.imwrite(f'public/models/preview_{m}_{cname}.png', composite)

print("Generated all test previews!")
