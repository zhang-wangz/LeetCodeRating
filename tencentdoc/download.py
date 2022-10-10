import string
import requests
import re
import json,datetime
import load_cookies

# cookie_string = "e698afe6b581e5b9b4e59180f09f9988" #可以手动写死cookies内容
class user_data():
    def __init__(self):
        self.cookies = None

    def set_cookies(self, cookiesfile):
        self.cookies = load_cookies.load_cookies(cookiesfile)

    def get_cookies(self):
        cookie_strings = []
        if self.cookies != None:
            for cookie in list(self.cookies):
                cookie_strings.append(cookie.name + '=' + cookie.value)
        cookie_headers = {'cookie': '; '.join(cookie_strings)}
        # cookie_headers = {'cookie': cookie_string} # 手动写死cookies内容
        return cookie_headers


def initial_fetch(url:string, cookie_data:user_data):
    # init_url = re.search(r"((.+))\?|(.+)",url).group(1) # 无url参数的形式的url

    t = datetime.datetime.timestamp( datetime.datetime.now() )
    t = int(t*1000) # 取当前毫秒时间戳，不需要从页面获取
    # id = re.search(r"/sheet/(.+)\??", init_url).group(1)

    opendoc_url = "https://docs.qq.com/dop-api/opendoc"
    opendoc_params = {
        "id" : "DWGFoRGVZRmxNaXFz",
        "normal" : "1",
        "outformat" : "1",
        "startrow" : "0",
        "endrow" : "60",
        "wb" : "1",
        "nowb" : "0",
        "callback" : "clientVarsCallback",
        "xsrf" : "",
        "t" : t
    }
    header={
        "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
        "Referer": "https://docs.qq.com/",
        # "cookie": cookie_string
    }
    header.update(cookie_data.get_cookies())

    opendoc_text = requests.get(opendoc_url, headers=header, params=opendoc_params).text
    opendoc_json = read_callback(opendoc_text)

    title = opendoc_json["clientVars"]["title"]
    tabs = opendoc_json["clientVars"]["collab_client_vars"]["header"][0]["d"]
    padId = opendoc_json["clientVars"]["collab_client_vars"]["globalPadId"]


    return title, tabs, opendoc_params

def read_sheet(url:string, sheet, opendoc_params, cookie_data:user_data):
    init_url = url
    opendoc_url = "https://docs.qq.com/dop-api/opendoc"
    opendoc_params["tab"] = sheet

    header={
        "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
        "Referer": "https://docs.qq.com/",
        # "cookie": cookie_string
    }
    header.update(cookie_data.get_cookies())

    opendoc_text = requests.get(opendoc_url, headers=header, params=opendoc_params).text
    opendoc_json = read_callback(opendoc_text)
    max_row = opendoc_json["clientVars"]["collab_client_vars"]["maxRow"]
    max_col = opendoc_json["clientVars"]["collab_client_vars"]["maxCol"]
    padId = opendoc_json["clientVars"]["collab_client_vars"]["globalPadId"]
    rev = opendoc_json["clientVars"]["collab_client_vars"]["rev"]

    sheet_url = "https://docs.qq.com/dop-api/get/sheet"
    sheet_params={
        "tab" : sheet,
        "padId" : padId,
        "subId" : sheet,
        "outformat" : "1",
        "startrow" : "0",
        "endrow" : max_row,
        "normal" : "1",
        "preview_token" : "",
        "nowb" : "1",
        "rev" : rev
    }
    sheet_text = requests.get(sheet_url, headers=header, params=sheet_params).text
    sheet_json = json.loads(sheet_text)
    # sheet_content = sheet_json["data"]["initialAttributedText"]["text"][0][-1][0]["c"][1]
    sheet_content = {}
    for temp_class in sheet_json["data"]["initialAttributedText"]["text"][0]:
        if type(temp_class[0]) == dict and "c" in temp_class[0].keys():
            if len(temp_class[0]["c"]) > 1 and type(temp_class[0]["c"][1]) == dict:
                temp = temp_class[0]["c"][1] # type: dict
                for k, v in temp.items():
                    if k.isdigit() and type(v) == dict:
                        sheet_content[k] = v
    return sheet_content, max_col

def read_callback(text):
    content = re.search(r"clientVarsCallback\(\"(.+)\"\)", text).group(1)
    content = content.replace("&#34;", "\"")
    content = content.replace(r'\\"', r"\\'")
    return json.loads(content)
