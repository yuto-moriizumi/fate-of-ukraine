import numpy
from skimage import io, color
from io import BytesIO
import json
filename = './public/assets/provinces.png'

# 画像ファイルパスから読み込み
img = io.imread(filename)


def from_rgb_to_colorcode(rgb):
    rgb = tuple(rgb)
    return "#%02x%02x%02x" % rgb


class Province:
    def __init__(self):
        self.x = 0
        self.y = 0
        self.count = 0
        self.neighbors: set[str] = set()

    def calcCenter(self):
        return int(self.x/self.count) if self.count != 0 else self.x, int(self.y/self.count) if self.count != 0 else self.y


# バイナリから読み込み(python3なのでbinaryモードで読み込み)
with open(filename, 'rb') as f:
    binary = f.read()
    img: numpy.ndarray = io.imread(BytesIO(binary))
    provinces: dict[str, Province] = dict()

    for y in range(len(img)):
        print(f"processing y:{y}")
        for x in range(len(img[y])):
            pixel = img[y][x]
            code = from_rgb_to_colorcode(pixel)
            province = provinces.get(
                code, Province())
            province.x += x
            province.y += y
            province.count += 1
            if 0 < x-1:
                code2 = from_rgb_to_colorcode(img[y][x-1])
                if code != code2:
                    province.neighbors.add(code2)
            if 0 < y-1:
                code2 = from_rgb_to_colorcode(img[y-1][x])
                if code != code2:
                    province.neighbors.add(code2)
            if x+1 < len(img[y]):
                code2 = from_rgb_to_colorcode(img[y][x+1])
                if code != code2:
                    province.neighbors.add(code2)
            if y+1 < len(img):
                code2 = from_rgb_to_colorcode(img[y+1][x])
                if code != code2:
                    province.neighbors.add(code2)
            provinces[code] = province

    for key in provinces:
        province = provinces[key]
        x, y = province.calcCenter()
        neighbors = list(province.neighbors)
        provinces[key] = {"x": x, "y": y, "neighbors": neighbors}

    fo = open("output.json", "w")
    json.dump(provinces, fo)
    fo.close()
