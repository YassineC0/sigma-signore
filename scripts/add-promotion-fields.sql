-- Add promotion fields to products table
ALTER TABLE public.products 
ADD COLUMN promotion_price NUMERIC NULL,
ADD COLUMN is_on_promotion BOOLEAN DEFAULT FALSE;
