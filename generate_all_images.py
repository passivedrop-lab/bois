import os
import time
from google import genai
from google.genai import types

# =================================================================
# CONFIGURATION
# =================================================================
API_KEY = os.environ.get('GOOGLE_API_KEY', 'VOTRE_CLE_API')
OUTPUT_DIR = './public/images-product'
MODEL_NAME = 'imagen-4.0-generate-001'

# Liste des produits et leurs prompts de génération
PRODUCTS = {
    # 2. BOIS SCIÉ
    "planche-coffrage-bois-25x100x6000mm.jpg": "Stack of rough-cut spruce wood planks, 25x100mm, for concrete formwork. Natural wood color, slightly rough surface, uniform stacking in a timber yard. Warm sunlight.",
    "madrier-bois-charpente-50x150x6000mm.jpg": "Large structural timber beams (madriers), 50x150mm section, stacked. High quality spruce or pine, sharp edges, professional lumber yard setting.",
    "planche-bois-brut-live-edge-25mm.jpg": "Live edge unedged wood plank, beautiful natural oak or pine with bark still on the sides. Wide board, expressive wood grain, workshop lighting.",
    "tasseau-bois-carre-sec-40x40x3000mm.jpg": "Small squared wooden battens (tasseaux), 40x40mm, kiln dried, stacked vertically. Clean light wood texture.",
    "planche-terrasse-lisse-meleze-28x140x4000mm.jpg": "Smooth larch wood decking boards, golden brown color, high quality finish, stack of outdoor construction wood.",
    "lame-cloture-bois-rabotee-20x95x2000mm.jpg": "Planed wooden fence slats with rounded tops, clean pine wood, ready for installation. Professional photography.",
    "piquet-cloture-bois-45x1500mm.jpg": "Bundle of pointed wooden fence pickets, rustic style, stacked in a garden store background.",
    "plancher-bois-massif-sapin-28x135x6000mm.jpg": "Tongue and groove solid wood flooring boards (pine), smooth planed surface, indoor lighting highlighting the wood grain.",
    "plancher-bois-massif-epais-36x135x6000mm.jpg": "Thick solid wood floor planks, 36mm, robust interlocking profiles, high quality joinery wood.",
    "dosse-bois-brut-vrac.jpg": "Pile of rough wood slabs (dosses), natural bark edges, timber processing waste used for rustic fences.",
    "sciure-bois-sac-50l.jpg": "Large 50L transparent bag filled with clean wood shavings and sawdust. Workshop background.",
    "chutes-bois-allumage-feu.jpg": "Small dry wood cut-offs for fire starting, organized in a wooden crate, ready for fireplace.",

    # 3. BOIS EXTÉRIEUR
    "terrasse-bois-meleze-strie-antiderapant-28x140.jpg": "Grooved anti-slip larch decking boards, 'velvet' texture, close-up showing the ridges, outdoor deck context.",
    "bardage-bois-claire-voie-meleze-20x140.jpg": "Rhombus profile larch wood cladding (v-joint), installation on a modern house facade, wood siding.",
    "bardage-bois-droit-pin-20x120.jpg": "Vertical pine wood siding, simple straight boards, clean modern architectural look.",
    "lame-terrasse-composite-wenge-140x25.jpg": "WPC (Wood Plastic Composite) decking boards, dark wenge color, wood-like texture, modern waterproof terrace.",
    "garde-corps-bois-terrasse-section.jpg": "Section of a wooden terrace railing with cross pattern (st-andrews cross), larch wood, high-end carpentry.",
    "marche-escalier-bois-meleze-40x300.jpg": "Thick solid larch wood stair tread, rounded front edge, beautiful grain, indoor or outdoor stairs.",
    "dalle-terrasse-bois-cliquable-30x30.jpg": "30x30cm Interlocking wooden terrace tiles, acacia or teak, grid pattern, easy DIY flooring.",
    "poutre-pergola-bois-traite-100x100.jpg": "Large square timber beams for pergola, treated wood with dark oil finish, outdoor structure context.",
    "bardage-bois-frene-thermo-traite.jpg": "Thermally modified ash wood siding, rich dark chocolate color, high durability cladding.",
    "huile-protection-bois-terrasse-2-5l.jpg": "Professional metal can of wood oil/stain for terraces, 2.5L, wood background with partial oil application.",

    # 4. BOIS DÉCORATIF
    "lambris-bois-pin-profil-v-14x120.jpg": "V-joint pine wood paneling (lambris), smooth surface, wall installation, warm home interior.",
    "lambris-bois-cedre-aromatique-14x140.jpg": "Aromatic red cedar wood shingles or paneling, pinkish hues, beautiful knots, sauna or luxury interior.",
    "clins-bois-imitation-poutre-20x145.jpg": "Thick wood siding imitating solid logs (imitacia brusa), rustic cabin style, exterior house cladding.",
    "bardage-bois-demi-rond-log-lap-28x140.jpg": "Blockhouse wood profile, rounded face like a log, stacked or installed on a wall.",
    "moulure-bois-angle-arrondi-30x30.jpg": "Wooden concave cove molding (galtel), smooth joinery for ceiling corners.",
    "chambranle-bois-encadrement-porte-70mm.jpg": "Decorative wooden door casing/architrave, 70mm width, carved profile, classic interior finish.",
    "baguette-angle-bois-exterieur-40x40.jpg": "L-shaped wooden outside corner trim, 40x40mm, protecting wall corners.",
    "tablette-fenetre-bois-massif-40x300.jpg": "Solid wood window sill, 40mm thick, pine or oak, wide board with polished finish.",
    "cache-radiateur-bois-rotin.jpg": "Wooden radiator cover frame with decorative rattan web insert, elegant furniture.",
    "claustra-bois-hetre-decoration.jpg": "Decorative beech wood trellis or lattice panel, partition for interior design.",

    # 5. PANNEAUX ET VOILES
    "panneau-contreplaque-batiment-10mm.jpg": "Sheet of 10mm building grade plywood (contreplaque), visible wood layers on edge, construction site.",
    "panneau-contreplaque-bouleau-ponce-18mm.jpg": "High quality 18mm birch plywood, furniture grade, smooth sanded surface, light color.",
    "panneau-osb3-hydrofuge-9mm.jpg": "9mm OSB-3 moisture resistant board, compressed wood strands texture, golden brown sheets.",
    "panneau-osb3-structurel-12mm.jpg": "Structural 12mm OSB-3 sheet, robust building panel for flooring or roofing.",
    "panneau-bois-massif-pin-lamelle-18x600.jpg": "Finger-jointed solid pine wood board (mebelny shit), 18mm, multi-plank construction for tabletops.",
    "panneau-bois-massif-chene-prestige-40x600.jpg": "Luxury solid oak wood panel, 40mm thick, wide stave construction, premium furniture wood.",
    "panneau-isorel-dur-dvp-3-2mm.jpg": "Thin 3.2mm hardboard sheet (DVP/Isorel), smooth one side, brown fiberboard for furniture backing.",
    "panneau-particules-ciment-csp-10mm.jpg": "Cement bonded particle board (CSP), grey stone-like texture, fireproof construction panel.",

    # 6. BOIS POUR SAUNA
    "lambris-bois-tilleul-sauna-extra.jpg": "Premium linden wood paneling (lipa), knot-free, very light color, sauna interior background.",
    "banc-sauna-bois-tilleul-confort-27x90.jpg": "Solid linden wood bench slats for sauna, rounded edges, smooth safe surface.",
    "lambris-bois-aulne-premium-sauna.jpg": "Alder wood sauna paneling, reddish brown tint, water resistant wood for wellness area.",
    "banc-sauna-bois-abachi-afrique.jpg": "Abachi wood (Obeche) bench boards, porous cool-to-touch wood, high-end sauna equipment.",
    "porte-sauna-verre-trempe-cadre-bois.jpg": "Satin bronze glass sauna door with solid wooden frame and handle. Modern design.",
    "abat-jour-angle-sauna-bois-tilleul.jpg": "Handmade wooden corner lampshade for sauna, linden wood slats, soft lighting effect.",
    "appui-tete-sauna-anatomique-cedre.jpg": "Anatomical wooden headrest for sauna, curved cedar wood slats, spa accessory.",
    "pierres-sauna-volcaniques-10kg.jpg": "10kg box of dark volcanic sauna stones (Jadeite), round and smooth rocks for heat retention.",

    # 7. DROVA ET BIOTOPLIVО
    "buches-bois-bouleau-sec-filet-40l.jpg": "Net bag (40L) of dry split birch firewood logs, white bark visible, ready for fireplace.",
    "buches-bois-chene-haute-densite-palette.jpg": "Large palette of high density oak firewood, stacked logs, intensive winter heating.",
    "briquettes-chauffage-bois-compresse-10kg.jpg": "Pack of 10kg RUF wood briquettes, compressed sawdust bricks, eco-friendly heating.",
    "granules-bois-pellets-din-plus-15kg.jpg": "15kg bag of wood pellets (6mm), high quality wood granules for automatic stoves.",
    "buches-bois-tremble-nettoyage-conduit.jpg": "Aspen wood logs for cleaning chimneys, light wood color, stacked nicely.",
    "charbon-de-bois-barbecue-3kg.jpg": "3kg bag of premium birch lump charcoal, outdoor grill context, black coal pieces.",

    # 8. BOIS BRUT/INDUSTRIEL
    "poutre-bois-brut-coffrage-100x100.jpg": "Rough sawn timber beam 100x100mm, second grade with some bark (waney edges), for construction site usage.",
    "planche-bois-brut-second-choix-25x150.jpg": "Low grade unplaned pine boards with wane, used for temporary construction fencing.",
    "palette-bois-occasion-reconditionnee.jpg": "Standard wooden europallet (1200x800), recycled look, sturdy construction.",
    "piquets-bois-balisage-chantier.jpg": "Bundle of pointed wooden survey stakes, bright painted tips, for construction site marking.",
    "chutes-contreplaque-decoupe.jpg": "Various plywood scraps and strips, industrial waste for DIY and small repairs.",
    "planchers-echafaudage-bois.jpg": "Solid wood planks for scaffolding, 40mm thick, heavy duty industrial usage."
}

def generate_images():
    client = genai.Client(api_key=API_KEY)
    
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"Dossier créé : {OUTPUT_DIR}")

    print(f"Début de la génération de {len(PRODUCTS)} images avec {MODEL_NAME}...")

    for filename, prompt in PRODUCTS.items():
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        if os.path.exists(filepath):
            print(f"Passage : {filename} (déjà présente)")
            continue

        try:
            print(f"Génération de {filename}...")
            
            # Utilisation de Imagen via models.generate_images
            response = client.models.generate_images(
                model=MODEL_NAME,
                prompt=prompt,
                config=types.GenerateImagesConfig(
                    output_mime_type='image/jpeg'
                )
            )
            
            # Sauvegarde de l'image
            if response.generated_images:
                with open(filepath, 'wb') as f:
                    f.write(response.generated_images[0].image.data)
                print(f"✅ Sauvegardé : {filename}")
            else:
                print(f"⚠️ Aucune image générée pour {filename}")
            
            # Respecter les limites de débit
            time.sleep(5) 

        except Exception as e:
            print(f"❌ Erreur pour {filename} : {str(e)}")
            if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                print("Quota épuisé. Arrêt du script.")
                break
            if "404" in str(e):
                print("Modèle non trouvé. Vérifiez MODEL_NAME.")
                break

if __name__ == "__main__":
    generate_images()
