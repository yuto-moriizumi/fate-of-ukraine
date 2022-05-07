import csv
import json
province = dict()

f = open("1_positions.json", "r")
obj = json.loads("".join(f.readlines()))

for id in obj:
    try:
        unit = obj[id]["unit"]
        x = unit["x"]
        y = unit["y"]
        province[id] = {"x": x, "y": y}
    except:
        pass


with open('definition.csv') as f2:
    reader = csv.reader(f2, delimiter=';')
    for row in reader:
        id = row[0]
        r = row[1]
        g = row[2]
        b = row[3]
        name = row[4]
        d: dict = province.get(id, dict())
        d.update({"r": r, "g": g, "b": b, "name": name})
        province[id] = d

out = open("out.json", "w")
outD = dict()
for key in province:
    obj: dict = province[key]
    id = '#%02x%02x%02x' % (
        int(obj["r"].split(".")[0]),
        int(obj["g"].split(".")[0]),
        int(obj["b"].split(".")[0]))
    outD[id] = {"name": obj["name"], "x": obj.get(
        "x", 100), "y": obj.get("y", 100)}
out.write(json.dumps(outD))
