import re

def check_cross_category_duplicates(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the PRODUCTS array content
    array_match = re.search(r'export const PRODUCTS: Product\[\] = \[(.*?)\]', content, re.DOTALL)
    if not array_match:
        return

    products_str = array_match.group(1)
    
    # Split into blocks
    product_blocks = re.findall(r'\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}', products_str, re.DOTALL)
    
    name_to_cats = {}
    for block in product_blocks:
        name_match = re.search(r"name:\s+'([^']+)'", block)
        cat_match = re.search(r"category:\s+'([^']+)'", block)
        id_match = re.search(r"id:\s+'([^']+)'", block)
        
        if name_match and cat_match and id_match:
            name = name_match.group(1)
            cat = cat_match.group(1)
            pid = id_match.group(1)
            
            if name in name_to_cats:
                if cat != name_to_cats[name][0]['cat']:
                    print(f"Name '{name}' found in multiple categories:")
                    print(f"  {name_to_cats[name][0]['pid']} in {name_to_cats[name][0]['cat']}")
                    print(f"  {pid} in {cat}")
                else:
                    print(f"Duplicate Name '{name}' in SAME category '{cat}':")
                    print(f"  IDs: {name_to_cats[name][0]['pid']} and {pid}")
            else:
                name_to_cats[name] = [{'cat': cat, 'pid': pid}]

if __name__ == "__main__":
    check_cross_category_duplicates('/home/deo/Desktop/bois/lib/data/products.ts')
