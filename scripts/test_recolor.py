import cv2
import numpy as np

img = cv2.imread('public/models/tshirt_model_front.png')
h, w = img.shape[:2]

mask = np.zeros(img.shape[:2], np.uint8)
bgdModel = np.zeros((1, 65), np.float64)
fgdModel = np.zeros((1, 65), np.float64)

# Rect around t-shirt
rect = (360, 190, 305, 290)
cv2.grabCut(img, mask, rect, bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_RECT)

# Filter out skin and pants
# In HSV/BGR, skin has distinctive hue and saturation
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
# Skin mask (neck & arms)
# Hue roughly 0-25, Saturation 30-180
lower_skin = np.array([0, 25, 60], dtype=np.uint8)
upper_skin = np.array([25, 200, 255], dtype=np.uint8)
skin_mask = cv2.inRange(hsv, lower_skin, upper_skin)

# Pants / belt mask (dark pixels y > 460)
dark_mask = np.zeros((h, w), dtype=np.uint8)
dark_mask[460:, :] = (cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)[460:, :] < 80).astype(np.uint8) * 255

fg_mask = np.where((mask == 1) | (mask == 3), 255, 0).astype(np.uint8)
# Remove skin and dark pants
fg_mask[skin_mask > 0] = 0
fg_mask[dark_mask > 0] = 0
# Remove anything above neck y < 195 and below waist y > 480
fg_mask[:195, :] = 0
fg_mask[480:, :] = 0
# Remove far left/right
fg_mask[:, :360] = 0
fg_mask[:, 665:] = 0

# Smooth the mask
fg_mask = cv2.GaussianBlur(fg_mask, (5, 5), 0)

# Save mask
cv2.imwrite('public/models/tshirt_mask.png', fg_mask)

# Test recolor with crimson: B=27, G=27, R=153
alpha = (fg_mask.astype(float) / 255.0)[:, :, None]
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(float) / 240.0
gray = np.clip(gray, 0.2, 1.2)[:, :, None]

# Crimson target
target_bgr = np.array([27, 27, 153], dtype=float)
colored_garment = np.clip(target_bgr * gray, 0, 255)

composite = (img * (1 - alpha) + colored_garment * alpha).astype(np.uint8)
cv2.imwrite('public/models/tshirt_crimson_test.png', composite)
print("Saved tshirt_mask.png and tshirt_crimson_test.png successfully")
