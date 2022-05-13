import glob
from io import TextIOWrapper
import re
import os
import csv
import json
ownerDict = dict()

ownerPattern = re.compile("owner = ([A-Z]{3})")
corePattern = re.compile("add_core = ([A-Z]{3})")
countryDict = dict()

for filename in glob.glob("./provinces/*/*.txt"):
    name = filename.split("\\")[-1].split(".txt")[0].split(" - ")[-1]
    f = open(filename, "r", encoding="utf8")
    try:
        ownerStr = f.readline()
    except UnicodeDecodeError:
        f = open(filename, "r", encoding="windows 1252")
        ownerStr = f.readline()
    tag = ownerPattern.findall(ownerStr)
    if len(tag) > 0:
        ownerDict[name] = tag[0]
        continue
    tag = corePattern.findall(ownerStr)
    if len(tag) > 0:
        ownerDict[name] = tag[0]
# print(ownerDict)

provinces = json.loads(
    "\n".join(open("./public/assets/provinces.json", "r").readlines()))
for id in provinces["provinces"]:
    province = provinces["provinces"][id]
    if province["name"] in ownerDict:
        province["owner"] = ownerDict[province["name"]]

open("owners.json", "w").write(json.dumps(provinces))
