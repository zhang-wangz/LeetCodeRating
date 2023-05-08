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
    v['TitleZH'] = d[1]
    v["Url"] = d[2]
    v["Ispaid"] = d[3]
    v["Type"] = d[4]
    v["Level"] = d[5]
    v["NextLevel"] = d[6]
    v["Difficulty"] = d[7]
    if str(d[8]) == "nan": d[8] = ""
    v["ContestInfo"] = str(d[8])
    arr.append(v)
with open("./stormlevel/data.json", 'w') as f:
    f.write(json.dumps(arr))
with open("./stormlevel/exist.txt", 'w', encoding = "utf-8") as file:
        time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        file.write(time)
