import urllib.request
import re
import os

url = "https://www.wadiz.kr/web/campaign/detail/368691"
output_dir = "d:/Project/20260717_maloa/public/wadiz-assets"
os.makedirs(output_dir, exist_ok=True)

req = urllib.request.Request(
    url,
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://www.google.com/'
    }
)

try:
    print("Sending request to Wadiz...")
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        with open(os.path.join(output_dir, 'campaign.html'), 'w', encoding='utf-8') as f:
            f.write(html)
        print("Successfully saved campaign.html")
        
        # Regex to find cdn.wadiz.kr URLs
        urls = re.findall(r'https://cdn\d?\.wadiz\.kr/[a-zA-Z0-9\-_./%]+', html)
        urls = list(set(urls))
        
        print(f"Found {len(urls)} CDN URLs.")
        with open(os.path.join(output_dir, 'urls.txt'), 'w', encoding='utf-8') as f:
            for u in urls:
                f.write(u + '\n')
except Exception as e:
    print("Error occurred:", e)
