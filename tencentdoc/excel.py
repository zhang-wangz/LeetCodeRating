from datetime import datetime, timedelta
import json
from openpyxl import Workbook
import sys
import download 

def todate(day): 
    theDay = datetime.strptime("1899-12-31", "%Y-%m-%d").date()
    real = theDay + timedelta(days=int(day))
    return real.strftime("%Y-%m-%d")

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
    idx = 1
    for tab in tabs:
        tab_id = tab["id"]
        name = tab["name"]
        obj[name] = []
        print("正在下载: %s" % name)
        sheet_content, max_col = download.read_sheet(url, tab_id, opendoc_params,cookie_data)
        # print(sheet_content)
        row = []
        row1 = []
        ws = wb.create_sheet(name)
        for k, v in sheet_content.items():
            if (int(k) % max_col == 0 and k != '0'):
                ws.append(row)
                obj[name].append(row1)
                row=[]
                row1=[]
            if '2' in v:
                if str(v['2'][1]).isdigit() and len(str(v['2'][1]))>4:
                    row.append(todate(int(v['2'][1])))
                    row1.append(todate(int(v['2'][1])))
                else:
                    row.append(v['2'][1])
                    row1.append(v['2'][1])
                if '6' in v:
                    row.append(v['6'])
                    row1.append(v['6'])
            else:
                row.append("")
    empty_ws = wb["Sheet"]
    wb.remove(empty_ws)
    wb.save('%s.xlsx' % "tea")
    with open("tea.json", 'w') as file:
        json.dump(obj, file)
    print("下载完成，已保存与根目录")
