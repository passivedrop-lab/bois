import re

def find_duplicates(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the PRODUCTS array content
    array_match = re.search(r'export const PRODUCTS: Product\[\] = \[(.*?)\]', content, re.DOTALL)
    if not array_match:
        return

    products_str = array_match.group(1)
    
    # Split into blocks
    product_blocks = re.findall(r'\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}', products_str, re.DOTALL)
    
    seen = {}
    for block in product_blocks:
        name_match = re.search(r"name:\s+'([^']+)'", block)
        cat_match = re.search(r"category:\s+'([^']+)'", block)
        price_match = re.search(r"price:\s+(\d+)", block)
        id_match = re.search(r"id:\s+'([^']+)'", block)
        
        if name_match and cat_match and price_match and id_match:
            name = name_match.group(1)
            cat = cat_match.group(1)
            price = price_match.group(1)
            pid = id_match.group(1)
            
            key = (name, cat, price)
            if key in seen:
                print(f"Duplicate found: {name} in {cat} at price {price}")
                print(f"  IDs: {seen[key]} and {pid}")
            else:
                seen[key] = pid

if __name__ == "__main__":
    find_duplicates('/home/deo/Desktop/bois/lib/data/products.ts')
