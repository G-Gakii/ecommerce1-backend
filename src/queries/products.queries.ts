export const addProductQueries =
  "INSERT INTO products (name,description,price,quantity,user_id) VALUES($1,$2,$3,$4,$5) RETURNING id,name,description,price,quantity,user_id";

export const getProductsQuery = "SELECT * FROM products ";

export const getOneProductQuery = "SELECT * FROM products WHERE id=$1";

export const updateProductQuery =
  "UPDATE products SET name=$1,description=$2,price=$3,quantity=$4,user_id=$4 WHERE id=$5 ";

export const DeleteProductQuery = "DELETE FROM products WHERE id=$1";
