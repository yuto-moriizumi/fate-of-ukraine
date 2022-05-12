import glob
from io import TextIOWrapper
import re
import os
import csv
import json
province = dict()

colorPattern = re.compile("(\d+)")
tagPattern = re.compile("([A-Z]{3})")
countryDict = dict()

for filename in glob.glob("./countries/*.txt"):
    name = filename.split("\\")[1].split(".txt")[0]
    f = open(filename, "r", encoding="utf8")
    try:
        colorStr = f.readline()
    except UnicodeDecodeError:
        f = open(filename, "r", encoding="windows 1252")
        colorStr = f.readline()
    try:
        r, g, b = map(int, colorPattern.findall(colorStr))
        colorCode = '#%02x%02x%02x' % (int(r), int(g), int(b))
        tag = tagPattern.findall("\n".join(f.readlines()))[0]
        countryDict[tag] = {"name": name, "color": colorCode}
    except:
        pass

open("countries.json", "w").write(json.dumps({"countries": countryDict}))
