create table products (
	id uuid not null default uuid_generate_v4() primary key,
	title text not null,
	description text,
	price float
);

create table stocks (
	product_id uuid not null references products(id) ,
	count integer
);

begin transaction;
	insert into products (id, title, description, price) values 
		('b72c32e5-7832-4bf6-a1a0-a283dbde09f5', 'ProductOne', 'Short Product Description1', 2.4),
		('bd95ba4d-953b-452a-8b3b-29b489d225eb', 'ProductNew', 'Short Product Description3', 10),
		('c4d84cd7-a1f3-42df-a2bc-81f01b15aecf', 'ProductTop', 'Short Product Description2', 23),
		('a2f2965a-4ef0-409f-853b-a8f09ba8a35a', 'ProductTitle', 'Short Product Description7', 15),
		('d70bb587-025d-48f6-a2ab-ef45677425d3', 'Product', 'Short Product Description2', 23),
		('0624688f-9df7-40fe-90d4-dea334c24023', 'ProductTest', 'Short Product Description4', 15),
		('bea49611-59e6-45a1-8e06-df5bce47803e', 'Product2', 'Short Product Descriptio1', 23),
		('b07228a2-87ed-458a-b97a-d489f090e016', 'ProductName', 'Short Product Description7', 15);
		
	insert into stocks (product_id, count) values
		('b72c32e5-7832-4bf6-a1a0-a283dbde09f5', 4),
		('bd95ba4d-953b-452a-8b3b-29b489d225eb', 6),
		('c4d84cd7-a1f3-42df-a2bc-81f01b15aecf', 7),
		('a2f2965a-4ef0-409f-853b-a8f09ba8a35a', 12),
		('d70bb587-025d-48f6-a2ab-ef45677425d3', 7),
		('0624688f-9df7-40fe-90d4-dea334c24023', 8),
		('bea49611-59e6-45a1-8e06-df5bce47803e', 2),
		('b07228a2-87ed-458a-b97a-d489f090e016', 3);
commit;