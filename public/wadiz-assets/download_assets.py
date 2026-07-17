import urllib.request
import os

urls = [
    "https://cdn3.wadiz.kr/studio/images/2025/08/13/0b64a7a8-7560-45be-9f7d-e1d5331b60d6.PNG/wadiz/resize/800/format/jpg/quality/85/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/22/1a3ba198-64d5-48ed-8543-0ada0835ef1b.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/76226bec-6b0f-4f53-8fe0-ec4f373763d6.mp4/wadiz/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/27/18c45d22-2033-4ed0-91fd-ef9cc4b0323e.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/eb86602f-6de4-4b11-8280-c742e976d81a.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/eb86602f-6de4-4b11-8280-c742e976d81a.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/94f54702-23d7-4e8a-b6f0-276dcd5a7d35.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/94f54702-23d7-4e8a-b6f0-276dcd5a7d35.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/2c141b7c-2c64-4b3b-a456-f882af3c4eca.mp4/wadiz/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/fac590b2-fe32-4115-bf70-5960269c54e9.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/fac590b2-fe32-4115-bf70-5960269c54e9.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/fac590b2-fe32-4115-bf70-5960269c54e9.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/d9e6a619-fdbe-466c-b3b8-895539b7d197.gif",
    "https://cdn3.wadiz.kr/studio/images/2025/09/11/9899c6d3-1065-495d-9aa6-44e089813194.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/09/11/9899c6d3-1065-495d-9aa6-44e089813194.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/09/11/902bb733-45ea-4ce3-9509-80d681fcc791.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/09/11/02f80113-cf28-46ff-83e7-c9105e7aa461.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/45da58e6-78b4-47b9-b9c4-83720d2e6efd.gif",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/4e3e67bd-ae40-4b05-91bb-8b9aac53820c.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/3349e1c9-f408-493a-b51b-635b1c99f621.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/78295f43-9c55-4618-ad57-7bbfc7b07c6f.mp4/wadiz/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/aa012b9d-d47a-4616-b17f-d6653c4d52b3.gif",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/e57708db-4347-450a-a758-915478ea8529.mp4/wadiz/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/5aae307a-2109-4bfb-a347-8e7733cadf24.mp4/wadiz/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/8f8c2c3a-aa99-41a1-818f-e9d235e191b5.mp4/wadiz/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/22/ad8dfb00-d932-4ab5-9384-f6db4460c3e3.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/81764f16-b26d-4cc8-99cb-f8c8e565c9aa.mp4/wadiz/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/22/93bc0e8c-1c38-48bd-a7ff-ae619ec4ed2b.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/22/cc7737f6-691f-493c-95c4-69a867e968f3.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/ba667e97-c2b3-4069-8997-c3e86872cdcc.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/5ba35269-56ec-45d3-8278-7c79a59dd589.mp4/wadiz/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/16cb1f6f-12e9-44d7-84d8-fafb52aee15d.gif",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/ddf0485a-ec93-4282-a52e-f7b330033b19.mp4/wadiz/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/462aebf9-ce2e-4ebc-b373-ceaa18a225f5.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/462aebf9-ce2e-4ebc-b373-ceaa18a225f5.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/c538ae4c-c5f2-496a-a95e-5cdae7a33e59.mp4/wadiz/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/1b627325-4e1a-4114-bbb3-6503d540e325.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/c461be90-c5fa-4f6b-ad65-3c9fee9e62ae.gif",
    "https://cdn3.wadiz.kr/studio/images/2025/08/16/20c92109-694e-43c5-a9cf-1f0b18c0e876.mp4/wadiz/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/22/52f500bd-e217-4c6c-b0d3-400752e3e5e8.gif",
    "https://cdn3.wadiz.kr/studio/images/2025/08/27/fefe0dfe-e518-49f8-adad-83e5d4ad89f3.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/27/1b83fba4-c7f0-49ea-8480-f72d18c0a07f.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/27/d0e05bae-34e2-4027-8ce7-8ec49887f480.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/27/d0fef0ee-4419-4c1c-b159-7a0cbb7b6563.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/27/99fab566-cca6-49b3-aec4-6bd7d222a56b.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/27/4efcd0c7-6d33-4858-bea0-7486b270d89a.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/27/4ebd0440-441d-410e-aa65-0d1bc198e00f.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/27/af0133b6-1993-4568-97e9-51d5a85c8b43.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/27/0bfbf04f-39fd-4d28-96c3-d5dadffef006.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/29/0f1a70b3-1801-480f-8d3a-88eba274768c.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/29/8cd23614-31d0-4ae7-a133-f3df475be566.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/29/68d61741-f10c-42df-847b-837bf46045be.png/wadiz/resize/800/format/jpg/quality/80/",
    "https://cdn3.wadiz.kr/studio/images/2025/08/22/20f4214d-9ef6-4a9f-b094-11d5d3bc5ccb.gif"
]

output_dir = "d:/Project/20260717_maloa/public/wadiz-assets"
os.makedirs(output_dir, exist_ok=True)

# Remove duplicates while keeping order
unique_urls = []
for u in urls:
    if u not in unique_urls:
        unique_urls.append(u)

print(f"Starting download of {len(unique_urls)} unique assets...")

for idx, url in enumerate(unique_urls):
    ext = ".jpg"
    # Deduce extension
    if ".gif" in url:
        ext = ".gif"
    elif ".mp4" in url:
        ext = ".mp4"
    elif ".png" in url or ".PNG" in url:
        ext = ".png"

    filename = f"wadiz_{idx}{ext}"
    filepath = os.path.join(output_dir, filename)

    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.wadiz.kr/'
        }
    )

    try:
        with urllib.request.urlopen(req) as response:
            data = response.read()
            with open(filepath, 'wb') as f:
                f.write(data)
        print(f"[{idx+1}/{len(unique_urls)}] Downloaded {filename} ({len(data)} bytes)")
    except Exception as e:
        print(f"[{idx+1}/{len(unique_urls)}] Failed to download {url}: {e}")

print("All downloads completed!")
