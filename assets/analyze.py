from PIL import Image

def analyze_gif(path):
    print(f"File: {path}")
    with Image.open(path) as img:
        print(f"  Format: {img.format}")
        print(f"  Dimensions: {img.width}x{img.height}")
        print(f"  Frames: {img.n_frames}")
        
        transparency = img.info.get('transparency', None)
        if transparency is not None:
            print(f"  Transparency Index: {transparency}")
            img.seek(0)
            
            width, height = img.size
            pixels = img.load()
            
            min_x, max_x = width, -1
            min_y, max_y = height, -1
            
            for y in range(height):
                for x in range(width):
                    if pixels[x, y] == transparency:
                        if x < min_x: min_x = x
                        if x > max_x: max_x = x
                        if y < min_y: min_y = y
                        if y > max_y: max_y = y
            
            if max_x >= min_x and max_y >= min_y:
                print(f"  Transparent Bounding Box: ({min_x}, {min_y}, {max_x}, {max_y})")
                print(f"  Transparent Hole Size: {max_x-min_x}x{max_y-min_y}")
                print(f"  Hole Center: {(min_x+max_x)/2}, {(min_y+max_y)/2}")
            else:
                print("  No pixels matched the transparency index.")
        else:
            print("  No transparency info found.")
            
analyze_gif("frame.gif")
