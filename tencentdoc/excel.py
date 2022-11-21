from datetime import datetime, timedelta
import json
from openpyxl import Workbook
import sys
import download 

def todate(day): 
    theDay = datetime.strptime("1899-12-31", "%Y-%m-%d").date()
    real = theDay + timedelta(days=int(day))
    return real.strftime("%Y-%m-%d")

class pb(object):
    def __init__(self, s="", url=""):
        self.s = s
        self.url = url

class MyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, bytes):
            return str(obj, encoding='utf-8')
        if isinstance(obj, int):
            return int(obj)
        elif isinstance(obj, float):
            return float(obj)
        elif isinstance(obj, pb):
            return {"url": obj.url, "str":obj.s }
        else:
            return super(MyEncoder, self).default(obj)
    
if __name__ == '__main__':
    cookie_data=download.user_data()

    if len(sys.argv) > 2:
        url = sys.argv[1]
        cookie_data.set_cookies(sys.argv[2])
    elif len(sys.argv) > 1:
        url = sys.argv[1]
    else:
        # url = input("url: ")
        url = "https://docs.qq.com/sheet/DWGFoRGVZRmxNaXFz"
    title, tabs, opendoc_params = download.initial_fetch(url,cookie_data=cookie_data)
    print("文档名称: %s" % title)
    wb = Workbook()
    obj = {}
    fidx = 0
    for tab in tabs:
        tab_id = tab["id"]
        name = tab["name"]
        obj[name] = []  # 存放json数据
        print("正在下载: %s" % name)
        sheet_content, max_col = download.read_sheet(url, tab_id, opendoc_params,cookie_data)
        row = []
        row1 = [] # 存放json数据
        ws = wb.create_sheet(name)
        for k, v in sheet_content.items():
            if (int(k) % max_col == 0 and k != '0'):
                ws.append(row)
                row=[]
                if fidx < 2:
                    obj[name].append(row1)
                    row1 = []
                    fidx += 1
            if '2' in v:
                tmp = pb()
                if str(v['2'][1]).isdigit() and len(str(v['2'][1]))>4:
                    row.append(todate(int(v['2'][1])))
                    if fidx < 2: tmp.s = str(todate(int(v['2'][1])))
                else:
                    row.append(v['2'][1])
                    if fidx < 2: tmp.s = str(v['2'][1])
                if '16' in v:
                    # row.append(v['16'][1]) # 表格不再保存链接数据 6,16
                    if fidx < 2: 
                        tmp.url = str(v['16'][0][1])
                if fidx < 2: row1.append(tmp)
            else:
                row.append("")
    empty_ws = wb["Sheet"]
    wb.remove(empty_ws)
    wb.save('./tencentdoc/%s.xlsx' % "tea")
    with open("./tencentdoc/tea.json", 'w') as file:
        json.dump(obj, file, cls=MyEncoder)
        print("save tea.json...")
    print("下载完成，已保存与根目录")
