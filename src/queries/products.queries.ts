export const addProductQueries =
  "INSERT INTO products (product_id,name,description,price,quantity,category,owner_id,created_at,updated_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING product_id,name,description,price,quantity,category,owner_id,created_at,updated_at";

export const getProductsQuery = "SELECT * FROM products ";

export const getOneProductQuery = "SELECT * FROM products WHERE product_id=$1";
export const getOneProductByNameQuery = "SELECT * FROM products WHERE name=$1";
export const getProductsBySellerQuery =
  "SELECT * FROM products WHERE owner_id=$1";

export const updateProductQuery =
  "UPDATE products SET name=$1,description=$2,price=$3,quantity=$4,owner_id=$5,category=$6, created_at=$7,updated_at=$8 WHERE product_id=$9 RETURNING product_id,name,description,price,quantity,owner_id,category,created_at,updated_at ";

export const DeleteProductQuery = "DELETE FROM products WHERE product_id=$1";
