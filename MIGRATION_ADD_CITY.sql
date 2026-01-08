-- Ajouter les colonnes manquantes à la table profiles pour supporter l'inscription complète
-- Exécutez ce script dans Supabase SQL Editor

-- Ajouter la colonne city (ville)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS city TEXT;

-- Ajouter un index sur la ville pour les performances
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);

-- Vérifier que les colonnes existent
-- SELECT id, email, full_name, phone, city FROM profiles LIMIT 1;
