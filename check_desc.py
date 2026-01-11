import re

def check_desc_similarity(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the PRODUCTS array content
    array_match = re.search(r'export const PRODUCTS: Product\[\] = \[(.*?)\]', content, re.DOTALL)
    if not array_match:
        return

    products_str = array_match.group(1)
    
    # Split into blocks
    product_blocks = re.findall(r'\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}', products_str, re.DOTALL)
    
    desc_to_id = {}
    for block in product_blocks:
        desc_match = re.search(r"description:\s+'([^']+)'", block)
        id_match = re.search(r"id:\s+'([^']+)'", block)
        name_match = re.search(r"name:\s+'([^']+)'", block)
        
        if desc_match and id_match:
            # Normalize description (ignore newlines, dots, etc)
            desc = re.sub(r'[\s\n\.\•\:\-]', '', desc_match.group(1)).lower()
            pid = id_match.group(1)
            name = name_match.group(1) if name_match else pid
            
            if desc in desc_to_id:
                print(f"Very similar description for:")
                print(f"  {desc_to_id[desc]['name']} ({desc_to_id[desc]['id']})")
                print(f"  {name} ({pid})")
            else:
                desc_to_id[desc] = {'id': pid, 'name': name}

if __name__ == "__main__":
    check_desc_similarity('/home/deo/Desktop/bois/lib/data/products.ts')
