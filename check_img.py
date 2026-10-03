import os
from PIL import Image
import glob

for f in glob.glob('apps/web/public/images/hospital/*.jpg'):
    img = Image.open(f)
    print(f"{os.path.basename(f)}: {img.size}")
