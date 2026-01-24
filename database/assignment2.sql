INSERT INTO public.account (account_firstname,account_lastname, account_email, account_password) VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

UPDATE public.account SET account_type = 'Admin'::account_type WHERE account_firstname = 'Tony';

DELETE FROM public.account WHERE account_email = 'tony@starkent.com';

UPDATE public.inventory SET inv_description = REPLACE(inv_inventory, 'the small interiors','a huge interior') WHERE inv_model = 'Hummer';

SELECT inv_make, inv_model, classification_name FROM public.inventory JOIN public.classification ON public.inventory.classification_id = public.classification.classification_id WHERE classification_name = 'Sport';

UPDATE public.inventory  SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'), inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');