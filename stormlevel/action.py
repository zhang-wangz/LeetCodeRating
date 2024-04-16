import pandas as pd
import requests
import time
import json
from datetime import datetime

downloadUrl = "https://raw.gitmirror.com/stormsunshine/LeetCode-Levels/main/LeetCode%20Levels.xlsx?timeStamp=" + str(int(time.time()))
data = requests.get(downloadUrl)
with open('./stormlevel/data.xlsx', 'wb') as f:
    f.write(data.content)
df = pd.read_excel(open("./stormlevel/data.xlsx", 'rb'), sheet_name='主站')
data = df.values
arr = []
for d in data:
    v = {}
    v["ID"] = d[0]
    v["Title"] = d[1]
    v['TitleCn'] = d[2]
    v["Url"] = d[3]
    v["Ispaid"] = d[4]
    v["Type"] = d[5]
    v["Level"] = d[6]
    v["NextLevel"] = d[7]
    v["Difficulty"] = d[8]
    if str(d[9]) == "nan": d[9] = ""
    v["ContestInfo"] = str(d[9])
    arr.append(v)
with open("./stormlevel/data.json", 'w') as f:
    f.write(json.dumps(arr))
with open("./stormlevel/exist.txt", 'w', encoding = "utf-8") as file:
        time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        file.write(time)
