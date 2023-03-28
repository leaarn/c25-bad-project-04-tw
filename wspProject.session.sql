-- inserting data into 'orders'
INSERT INTO orders (
    pick_up_date,
    pick_up_time,
    pick_up_district,
    pick_up_address,
    pick_up_coordinates,
    deliver_district,
    deliver_address,
    deliver_coordinates,
    users_id,
    drivers_id,
    distance_km,
    distance_price,
    reference_code,
    orders_status,
    token,
    remarks,
    created_at
  )
VALUES (
    '2023-03-29',
    '12:00',
    'Tsuen_Wan',
    'Nil',
    '(1, 1)',
    'Kowloon_Tong',
    'Nil',
    '(2, 2)',
    1,
    1,
    100,
    1000,
    gen_random_uuid(),
    '1 pending',
    'ehrugh83409tgj4wigo',
    'Nil',
    NOW()
  );

--


INSERT INTO order_animals (
    orders_id,
    animals_id,
    animals_amount,
    animals_unit_price
  )
VALUES (
    1,
    1,
    2,
    1000
  );


INSERT INTO orders (
    pick_up_date,
    pick_up_time,
    pick_up_district,
    pick_up_address,
    pick_up_coordinates,
    deliver_district,
    deliver_address,
    deliver_coordinates,
    users_id,
    drivers_id,
    distance_km,
    distance_price,
    orders_status,
    remarks,
    created_at
  )
VALUES (
    '2023-03-30',
    '13:00',
    'Tsuen_Wan',
    '20B, TML Tower',
    '(1, 2)',
    'Tuen_Mun',
    '15A, Tower 1, Sun Tuen Mun Center',
    '(2, 3)',
    1,
    1,
    25,
    10,
    '1 pending',
    'DLLM',
    NOW()
  );




-- query

SELECT pick_up_district, deliver_district, pick_up_date, pick_up_time, animals.animals_name, order_animals.animals_amount
FROM orders 
JOIN order_animals ON order_animals.orders_id = orders.id
JOIN animals ON animals.id = order_animals.animals_id
;