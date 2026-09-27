import cv2
import numpy as np

def create_tshirt_mask():
    img = cv2.imread('public/models/tshirt_model_front.png')
    h, w = img.shape[:2]
    
    # Polygon outlining the t-shirt accurately
    # Points follow: collar curve -> right shoulder -> right sleeve -> right torso -> waist -> left torso -> left sleeve -> left shoulder
    pts = np.array([
        # Collar curve (leaving neck skin untouched)
        [468, 195], [490, 218], [512, 222], [535, 218], [556, 195],
        # Right shoulder (viewer's right)
        [580, 205], [605, 220], [630, 238], [638, 255],
        # Right sleeve outer edge & cuff
        [640, 280], [638, 318], [630, 324], [608, 326], [596, 335],
        # Right torso down to waist
        [598, 370], [595, 420], [595, 474],
        # Waistline / bottom hem (above belt)
        [550, 474], [512, 475], [470, 474], [415, 474],
        # Left torso up to armpit
        [416, 420], [418, 370], [418, 335],
        # Left sleeve cuff & outer edge
        [405, 326], [382, 324], [374, 318], [372, 280],
        # Left shoulder
        [374, 255], [382, 238], [408, 220], [435, 205]
    ], np.int32)
    
    mask = np.zeros((h, w), dtype=np.uint8)
    cv2.fillPoly(mask, [pts], 255)
    
    # Remove any skin that might overlap with neck collar or arm cuffs
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    skin = (hsv[:,:,0] < 25) & (hsv[:,:,1] > 35) & (hsv[:,:,2] > 70)
    mask[skin] = 0
    
    # Remove belt / pants
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    dark_bottom = (gray < 75) & (np.arange(h)[:, None] > 468)
    mask[dark_bottom] = 0
    
    # Smooth edges with 3x3 Gaussian blur for anti-aliased transitions
    smoothed = cv2.GaussianBlur(mask, (3, 3), 0)
    cv2.imwrite('public/models/tshirt_mask.png', smoothed)
    print("tshirt_mask.png generated")

def create_polo_mask():
    img = cv2.imread('public/models/polo_model_front.png')
    h, w = img.shape[:2]
    
    # Polo outline
    pts = np.array([
        # Collar and placket (y around 180-230)
        [458, 185], [490, 225], [512, 235], [534, 225], [565, 185],
        # Right shoulder & sleeve
        [590, 200], [620, 218], [642, 235], [648, 280], [646, 318], [630, 326], [605, 328], [593, 338],
        # Right torso
        [602, 380], [608, 430], [612, 470], [596, 514],
        # Bottom hem
        [550, 514], [512, 514], [460, 514], [404, 514],
        # Left torso
        [394, 470], [392, 430], [394, 380], [405, 338],
        # Left sleeve
        [392, 328], [370, 326], [356, 318], [356, 280], [362, 235], [385, 218], [415, 200]
    ], np.int32)
    
    mask = np.zeros((h, w), dtype=np.uint8)
    cv2.fillPoly(mask, [pts], 255)
    
    # Filter skin & dark pants
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    skin = (hsv[:,:,0] < 25) & (hsv[:,:,1] > 35) & (hsv[:,:,2] > 70)
    mask[skin] = 0
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    dark_bottom = (gray < 75) & (np.arange(h)[:, None] > 508)
    mask[dark_bottom] = 0
    
    smoothed = cv2.GaussianBlur(mask, (3, 3), 0)
    cv2.imwrite('public/models/polo_mask.png', smoothed)
    print("polo_mask.png generated")

def create_hoodie_mask():
    img = cv2.imread('public/models/hoodie_model_front.png')
    h, w = img.shape[:2]
    
    # Hoodie outline (with full right arm and hood collar)
    pts = np.array([
        # Hood collar below chin (chin at y=175)
        [440, 185], [475, 205], [512, 212], [548, 205], [580, 185],
        # Hood fold top sides
        [600, 195], [625, 215],
        # Right arm / sleeve (all the way to elbow and wrist in pocket)
        [650, 245], [668, 285], [674, 335], [665, 385], [635, 420], [602, 438], [588, 410],
        # Right torso
        [588, 440], [586, 502],
        # Bottom waist ribbed hem
        [550, 502], [512, 502], [460, 502], [410, 502],
        # Left torso
        [410, 440],
        # Left sleeve / hand in pocket
        [410, 410], [396, 438], [365, 420], [352, 380], [352, 330], [356, 285], [375, 245],
        # Left hood fold
        [395, 215], [420, 195]
    ], np.int32)
    
    mask = np.zeros((h, w), dtype=np.uint8)
    cv2.fillPoly(mask, [pts], 255)
    
    # Filter skin & pants
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    skin = (hsv[:,:,0] < 25) & (hsv[:,:,1] > 35) & (hsv[:,:,2] > 70)
    mask[skin] = 0
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    dark_bottom = (gray < 75) & (np.arange(h)[:, None] > 498)
    mask[dark_bottom] = 0
    
    smoothed = cv2.GaussianBlur(mask, (3, 3), 0)
    cv2.imwrite('public/models/hoodie_mask.png', smoothed)
    print("hoodie_mask.png generated")

def create_cap_mask():
    img = cv2.imread('public/models/cap_model_front.png')
    h, w = img.shape[:2]
    
    # Cap outline: crown + visor
    pts = np.array([
        # Crown apex
        [512, 58], [470, 68], [425, 95], [385, 135], [360, 185], [346, 235], [342, 268],
        # Left visor curve
        [355, 275], [380, 272], [420, 255], [470, 238], [512, 232], [554, 238], [604, 255], [644, 272], [669, 275],
        # Right crown curve
        [682, 268], [678, 235], [664, 185], [639, 135], [599, 95], [554, 68]
    ], np.int32)
    
    mask = np.zeros((h, w), dtype=np.uint8)
    cv2.fillPoly(mask, [pts], 255)
    
    # Strict barrier: Cap is strictly y <= 278, never touch face, teeth, or shirt
    mask[278:, :] = 0
    
    # Smooth edges
    smoothed = cv2.GaussianBlur(mask, (3, 3), 0)
    cv2.imwrite('public/models/cap_mask.png', smoothed)
    print("cap_mask.png generated")

if __name__ == '__main__':
    create_tshirt_mask()
    create_polo_mask()
    create_hoodie_mask()
    create_cap_mask()
