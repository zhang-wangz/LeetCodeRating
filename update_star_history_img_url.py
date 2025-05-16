import re
import time

# 输入输出文件路径
input_file = 'README.md'
output_file = 'README.md'

# 当前时间戳
timestamp = int(time.time())

# 目标基础 URL（不含参数）
base_url = "https://raw.gitmirror.com/zhang-wangz/startHistoryAction/main/star_history.png"

# 正则匹配目标图片链接，可能有参数或已有 timestamp
pattern = rf'(!\[.*?\])\(\s*({re.escape(base_url)}(?:\?[^)]*)?)\s*\)'

def replace_timestamp(match):
    alt_text = match.group(1)
    url = match.group(2)

    # 分割 URL 和参数部分
    if '?' in url:
        base, query = url.split('?', 1)
        # 替换或追加 timestamp
        if 'timestamp=' in query:
            query = re.sub(r'timestamp=\d+', f'timestamp={timestamp}', query)
        else:
            query += f'&timestamp={timestamp}'
        new_url = f"{base}?{query}"
    else:
        new_url = f"{url}?timestamp={timestamp}"

    return f'{alt_text}({new_url})'

# 读取内容
with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 替换符合条件的图片链接
updated_content = re.sub(pattern, replace_timestamp, content)

# 写入结果
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(updated_content)

print(f"✅ 链接已更新，写入 {output_file}")
