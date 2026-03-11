CREATE FUNCTION public.handle_product_reviews_count_up()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY definer
SET search_path = ''
AS $$
BEGIN
UPDATE public.products SET stats = stats || jsonb_build_object('reviews', (stats->>'reviews')::int + 1) WHERE product_id = NEW.product_id;
RETURN NEW;
END;
$$;

CREATE TRIGGER product_reviews_count_up_trigger
AFTER INSERT ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.handle_product_reviews_count_up();

CREATE FUNCTION public.handle_product_reviews_count_down()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY definer
SET search_path = ''
AS $$
BEGIN
UPDATE public.products SET stats = stats || jsonb_build_object('reviews', (stats->>'reviews')::int - 1) WHERE product_id = OLD.product_id;
RETURN OLD;
END;
$$;

CREATE TRIGGER product_reviews_count_down_trigger
AFTER DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.handle_product_reviews_count_down();