import cv2
import numpy as np
import os

print("Starting alignment...")

# Base image (Center face)
base_img = cv2.imread('5.png', cv2.IMREAD_UNCHANGED)
if base_img is None:
    print("Failed to load 5.png")
    exit(1)

# We want to use a stable region to align. The nose or forehead is good.
# Let's use the center region of the image, slightly above the eyes, to align the heads.
# Assuming the face is relatively centered in the 3919x3919 image.
h, w = base_img.shape[:2]

# Define a template region (e.g. the nose/bridge of nose).
# We'll just take a center crop of 5.png to use as the template for alignment.
cy, cx = h // 2, w // 2
# Let's crop a box 1000x1000 around the center (hopefully catching the stable parts of the face like nose/cheeks)
# But avoiding the eyes which change! The eyes are probably slightly above center or at center.
# We'll use a region around the nose (below eyes).
template_box = (cx - 400, cy + 100, cx + 400, cy + 600) # x1, y1, x2, y2
template = base_img[template_box[1]:template_box[3], template_box[0]:template_box[2]]
template_gray = cv2.cvtColor(template, cv2.COLOR_BGRA2GRAY)

for i in range(1, 10):
    if i == 5:
        # Save base as aligned for consistency
        cv2.imwrite(f'aligned_{i}.png', base_img)
        continue
        
    img = cv2.imread(f'{i}.png', cv2.IMREAD_UNCHANGED)
    if img is None:
        continue
        
    img_gray = cv2.cvtColor(img, cv2.COLOR_BGRA2GRAY)
    
    # To make matchTemplate fast on 4K images, we crop a search area in the target image!
    # We only expect the face to shift by maybe +/- 200 pixels at most.
    search_margin = 300
    search_y1 = max(0, template_box[1] - search_margin)
    search_y2 = min(h, template_box[3] + search_margin)
    search_x1 = max(0, template_box[0] - search_margin)
    search_x2 = min(w, template_box[2] + search_margin)
    
    search_area = img_gray[search_y1:search_y2, search_x1:search_x2]
    
    res = cv2.matchTemplate(search_area, template_gray, cv2.TM_CCOEFF_NORMED)
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)
    
    # max_loc is relative to search_area. Add search_x1/y1 back to get absolute coordinates.
    matched_x = max_loc[0] + search_x1
    matched_y = max_loc[1] + search_y1
    target_x, target_y = template_box[0], template_box[1]
    
    # Calculate offset
    dx = target_x - matched_x
    dy = target_y - matched_y
    
    print(f"Image {i}.png offset: dx={dx}, dy={dy}")
    
    # Translate image
    M = np.float32([[1, 0, dx], [0, 1, dy]])
    aligned = cv2.warpAffine(img, M, (w, h), borderMode=cv2.BORDER_TRANSPARENT)
    
    cv2.imwrite(f'aligned_{i}.png', aligned)
    print(f"Generated aligned_{i}.png")

print("Done!")
