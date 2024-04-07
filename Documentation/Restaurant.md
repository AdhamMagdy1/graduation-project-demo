# API Documentation

# Replace `{{host}}` with the actual URL of your backend server, in this case, `http://localhost:5000`

## Create Restaurant Owner

Creates a new restaurant owner.

- **URL:** `{{host}}/resturant/create`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Request Body:**

  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```

### Success Response

- **Status Code:** 200 OK
- **Response Body:**

  ```json
  {
    "message": "Owner created successfully"
  }
  ```

### Error Responses

- **Status Code:** 400 BAD REQUEST
- **Response Body:**

  ```json
  {
    "error": "Email is already in use"
  }
  ```

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Restaurant Owner Login

Logs in a restaurant owner.

- **URL:** `{{host}}/resturant/login`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Request Body:**

  ```json
  {
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```

### Success Response

- **Status Code:** 200 OK
- **Response Body:**

  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEyMzQ1Njc4OSwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  }
  ```

### Error Responses

- **Status Code:** 400 BAD REQUEST
- **Response Body:**

  ```json
  {
    "error": "Invalid email or password"
  }
  ```

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Get Restaurant Owner Info

Retrieves information about a restaurant owner.

- **URL:** `{{host}}/resturant/owner`
- **Method:** `GET`
- **Authorization:** `token`

### Success Response

- **Status Code:** 200 OK
- **Response Body:** (Example Response)

  ```json
  {
    "id": 1123456789,
    "name": "John Doe",
    "email": "johndoe@example.com"
  }
  ```

### Error Responses

- **Status Code:** 400 BAD REQUEST
- **Response Body:**

  ```json
  {
    "error": "Invalid token"
  }
  ```

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Create Restaurant

Creates a new restaurant.

- **URL:** `{{host}}/resturant/setup`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Authorization:** `token`
- **Request Body:**

  ```json
  {
    "name": "Restaurant Name",
    "description": "Restaurant Description",
    "Subscription": "YYYY-MM-DD"
  }
  ```

### Success Response

- **Status Code:** 201 CREATED
- **Response Body:** (Example Response)

  ```json
  {
    "id": 1234567890,
    "name": "Restaurant Name",
    "description": "Restaurant Description",
    "Subscription": "YYYY-MM-DD",
    "ownerId": 1123456789
  }
  ```

### Error Responses

- **Status Code:** 401 UNAUTHORIZED
- **Response Body:**

  ```json
  {
    "error": "Unauthorized access"
  }
  ```

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Get Restaurant by ID

Retrieves information about a restaurant by its ID.

- **URL:** `{{host}}/resturant/{restaurantId}`
- **Method:** `GET`
- **Authorization:** `token`

### Success Response

- **Status Code:** 200 OK
- **Response Body:** (Example Response)

  ```json
  {
    "id": 1234567890,
    "name": "Restaurant Name",
    "description": "Restaurant Description",
    "Subscription": "YYYY-MM-DD",
    "ownerId": 1123456789
  }
  ```

### Error Responses

- **Status Code:** 404 NOT FOUND
- **Response Body:**

  ```json
  {
    "error": "Restaurant not found"
  }
  ```

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Edit Restaurant by ID

Edits information about a restaurant by its ID.

- **URL:** `{{host}}/resturant/{restaurantId}`
- **Method:** `PUT`
- **Content-Type:** `application/json`
- **Authorization:** `token`
- **Request Body:** (Fields are optional)

  ```json
  {
    "name": "New Restaurant Name",
    "description": "New Restaurant Description",
    "Subscription": "YYYY-MM-DD"
  }
  ```

### Success Response

- **Status Code:** 200 OK
- **Response Body:** (Example Response)

  ```json
  {
    "id": 1234567890,
    "name": "New Restaurant Name",
    "description": "New Restaurant Description",
    "Subscription": "YYYY-MM-DD",
    "ownerId": 1123456789
  }
  ```

### Error Responses

- **Status Code:** 404 NOT FOUND
- **Response Body:**

  ```json
  {
    "error": "Restaurant not found"
  }
  ```

- **Status Code:** 401 UNAUTHORIZED
- **Response Body:**

  ```json
  {
    "error": "Unauthorized access"
  }
  ```

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Create Products

Creates multiple products for a restaurant.

- **URL:** `{{host}}/resturant/products`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Authorization:** `token`
- **Request Body:**

  ```json
  {
    "products": [
      {
        "name": "Product 1",
        "description": "Description for Product 1",
        "price": 10.99,
        "quantity": 100
      },
      {
        "name": "Product 2",
        "description": "Description for Product 2",
        "price": 20.99,
        "quantity": 50
      }
    ]
  }
  ```

### Success Response

- **Status Code:** 201 CREATED
- **Response Body:** (Example Response)

  ```json
  {
    "message": "Products created successfully",
    "products": [
      {
        "id": 1234567890,
        "name": "Product 1",
        "description": "Description for Product 1",
        "price": 10.99,
        "quantity": 100,
        "restaurantId": 987654321
      },
      {
        "id": 2345678901,
        "name": "Product 2",
        "description": "Description for Product 2",
        "price": 20.99,
        "quantity": 50,
        "restaurantId": 987654321
      }
    ]
  }
  ```

### Error Responses

- **Status Code:** 404 NOT FOUND
- **Response Body:**

  ```json
  {
    "error": "Restaurant not found for the owner"
  }
  ```

- **Status Code:** 401 UNAUTHORIZED
- **Response Body:**

  ```json
  {
    "error": "Unauthorized access"
  }
  ```

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Get All Products

Retrieves information about all products for a restaurant.

- **URL:** `{{host}}/resturant/products/all`
- **Method:** `GET`
- **Authorization:** `token`

### Success Response

- **Status Code:** 200 OK
- **Response Body:** (Example Response)

  ```json
  [
    {
      "id": 1234567890,
      "name": "Product 1",
      "description": "Description for Product 1",
      "price": 10.99,
      "quantity": 100,
      "restaurantId": 987654321
    },
    {
      "id": 2345678901,
      "name": "Product 2",
      "description": "Description for Product 2",
      "price": 20.99,
      "quantity": 50,
      "restaurantId": 987654321
    }
  ]
  ```

### Error Responses

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Get Product by ID

Retrieves information about a product by its ID.

- **URL:** `{{host}}/resturant/products/{productId}`
- **Method:** `GET`
- **Authorization:** `token`

### Success Response

- **Status Code:** 200 OK
- **Response Body:** (Example Response)

  ```json
  {
    "id": 1234567890,
    "name": "Product 1",
    "description": "Description for Product 1",
    "price": 10.99,
    "quantity": 100,
    "restaurantId": 987654321
  }
  ```

### Error Responses

- **Status Code:** 404 NOT FOUND
- **Response Body:**

  ```json
  {
    "error": "Product not found"
  }
  ```

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Edit Product by ID

Edits information about a product by its ID.

- **URL:** `{{host}}/resturant/products/{productId}`
- **Method:** `PUT`
- **Content-Type:** `application/json`
- **Authorization:** `token`
- **Request Body:** (Fields are optional)

  ```json
  {
    "name": "New Product Name",
    "description": "New Description",
    "price": 9.99,
    "quantity": 200
  }
  ```

### Success Response

- **Status Code:** 200 OK
- **Response Body:** (Example Response)

  ```json
  {
    "id": 1234567890,
    "name": "New Product Name",
    "description": "New Description",
    "price": 9.99,
    "quantity": 200,
    "restaurantId": 987654321
  }
  ```

### Error Responses

- **Status Code:** 404 NOT FOUND
- **Response Body:**

  ```json
  {
    "error": "Product not found"
  }
  ```

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Delete Product by ID

Deletes a product by its ID.

- **URL:** `{{host}}/resturant/products/{productId}`
- **Method:** `DELETE`
- **Authorization:** `token`

### Success Response

- **Status Code:** 200 OK
- **Response Body:**

  ```json
  {
    "message": "Product deleted successfully"
  }
  ```

### Error Responses

- **Status Code:** 404 NOT FOUND
- **Response Body:**

  ```json
  {
    "error": "Product not found"
  }
  ```

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Create New Extra

Creates a new extra item.

- **URL:** `{{host}}/extras`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Authorization:** `token`
- **Request Body:**

  ```json
  {
    "name": "Extra Name",
    "price": 9.99
  }
  ```

### Success Response

- **Status Code:** 201 CREATED
- **Response Body:**

  ```json
  {
    "message": "Extra created successfully",
    "extra": {
      "id": 1,
      "name": "Extra Name",
      "price": 9.99
    }
  }
  ```

### Error Responses

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Get All Extras

Retrieves information about all extra items.

- **URL:** `{{host}}/extras`
- **Method:** `GET`
- **Authorization:** `token`

### Success Response

- **Status Code:** 200 OK
- **Response Body:** (Example Response)

  ```json
  [
    {
      "id": 1,
      "name": "Extra Name 1",
      "price": 9.99
    },
    {
      "id": 2,
      "name": "Extra Name 2",
      "price": 12.99
    }
  ]
  ```

### Error Responses

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Get Extra by ID

Retrieves information about an extra item by its ID.

- **URL:** `{{host}}/extras/{extraId}`
- **Method:** `GET`
- **Authorization:** `token`

### Success Response

- **Status Code:** 200 OK
- **Response Body:** (Example Response)

  ```json
  {
    "id": 1,
    "name": "Extra Name",
    "price": 9.99
  }
  ```

### Error Responses

- **Status Code:** 404 NOT FOUND
- **Response Body:**

  ```json
  {
    "error": "Extra not found"
  }
  ```

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Edit Extra by ID

Edits information about an extra item by its ID.

- **URL:** `{{host}}/extras/{extraId}`
- **Method:** `PUT`
- **Content-Type:** `application/json`
- **Authorization:** `token`
- **Request Body:** (Fields are optional)

  ```json
  {
    "name": "New Extra Name",
    "price": 12.99
  }
  ```

### Success Response

- **Status Code:** 200 OK
- **Response Body:** (Example Response)

  ```json
  {
    "id": 1,
    "name": "New Extra Name",
    "price": 12.99
  }
  ```

### Error Responses

- **Status Code:** 404 NOT FOUND
- **Response Body:**

  ```json
  {
    "error": "Extra not found"
  }
  ```

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Delete Extra by ID

Deletes an extra item by its ID.

- **URL:** `{{host}}/extras/{extraId}`
- **Method:** `DELETE`
- **Authorization:** `token`

### Success Response

- **Status Code:** 200 OK
- **Response Body:**

  ```json
  {
    "message": "Extra deleted successfully"
  }
  ```

### Error Responses

- **Status Code:** 404 NOT FOUND
- **Response Body:**

  ```json
  {
    "error": "Extra not found"
  }
  ```

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Associate Extras with Product

Associates extra items with a product.

- **URL:** `{{host}}/products/{ProductProductId}/extras`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Authorization:** `token`
- **Request Body:**

  ```json
  {
    "extras": [1, 2, 3]
  }
  ```

### Success Response

- **Status Code:** 200 OK
- **Response Body:** (Example Response)

  ```json
  {
    "message": "Extras associated with product successfully",
    "data": {
      "id": 1,
      "ProductProductId": 123,
      "ExtraExtraId": 1
    }
  }
  ```

### Error Responses

- **Status Code:** 404 NOT FOUND
- **Response Body:**

  ```json
  {
    "error": "Product not found"
  }
  ```

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Get Associated Extras for Product

Retrieves all extras associated with a product.

- **URL:** `{{host}}/products/{ProductProductId}/extras`
- **Method:** `GET`
- **Authorization:** `token`

### Success Response

- **Status Code:** 200 OK
- **Response Body:** (Example Response)

  ```json
  [
    {
      "id": 1,
      "ProductProductId": 123,
      "ExtraExtraId": 1
    },
    {
      "id": 2,
      "ProductProductId": 123,
      "ExtraExtraId": 2
    }
  ]
  ```

### Error Responses

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Get All Product Extras

Retrieves all product extras.

- **URL:** `{{host}}/productExtras`
- **Method:** `GET`
- **Authorization:** `token`

### Success Response

- **Status Code:** 200 OK
- **Response Body:** (Example Response)

  ```json
  [
    {
      "id": 1,
      "ProductProductId": 123,
      "ExtraExtraId": 1
    },
    {
      "id": 2,
      "ProductProductId": 123,
      "ExtraExtraId": 2
    }
  ]
  ```

### Error Responses

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Edit Product Extra

Edits a specific extra item associated with a product.

- **URL:** `{{host}}/products/{ProductProductId}/extras/{ExtraExtraId}`
- **Method:** `PUT`
- **Content-Type:** `application/json`
- **Authorization:** `token`
- **Request Body:** (Fields are optional)

  ```json
  {
    "ExtraExtraId": 3
  }
  ```

### Success Response

- **Status Code:** 200 OK
- **Response Body:** (Example Response)

  ```json
  {
    "id": 1,
    "ProductProductId": 123,
    "ExtraExtraId": 3
  }
  ```

### Error Responses

- **Status Code:** 404 NOT FOUND
- **Response Body:**

  ```json
  {
    "error": "Error editing product extras"
  }
  ```

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Delete All Extras for a Product

Deletes all extra items associated with a product.

- **URL:** `{{host}}/products/{ProductProductId}/extras`
- **Method:** `DELETE`
- **Authorization:** `token`

### Success Response

- **Status Code:** 200 OK
- **Response Body:**

  ```json
  {
    "message": "Product extras deleted successfully"
  }
  ```

### Error Responses

- **Status Code:** 404 NOT FOUND
- **Response Body:**

  ```json
  {
    "error": "Product extras not found"
  }
  ```

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Upload Menu

Uploads a menu for a restaurant.

- **URL:** `{{host}}/restaurants/{restaurantId}/menu`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Authorization:** `token`
- **Request Body:**

  ```form-data
  {
    "description": "Menu Description",
    "menuImage": (binary)
  }
  ```

### Success Response

- **Status Code:** 201 CREATED
- **Response Body:**

  ```json
  {
    "success": true,
    "menu": {
      "id": 1,
      "description": "Menu Description",
      "menuImage": "Base64 Encoded Image Data"
    }
  }
  ```

### Error Responses

- **Status Code:** 404 NOT FOUND
- **Response Body:**

  ```json
  {
    "error": "Restaurant not found for the owner"
  }
  ```

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Get Menu

Retrieves the menu for a restaurant.

- **URL:** `{{host}}/restaurants/{restaurantId}/menu/{menuId}`
- **Method:** `GET`
- **Authorization:** `token`

### Success Response

- **Status Code:** 200 OK
- **Response Body:** (Example Response)

  ```json
  {
    "description": "Menu Description",
    "menuImage": (binary)
  }
  ```

### Error Responses

- **Status Code:** 404 NOT FOUND
- **Response Body:**

  ```json
  {
    "error": "Menu not found"
  }
  ```

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Edit Menu

Edits the menu for a restaurant.

- **URL:** `{{host}}/restaurants/{restaurantId}/menu/{menuId}`
- **Method:** `PUT`
- **Content-Type:** `multipart/form-data`
- **Authorization:** `token`
- **Request Body:** (Fields are optional)

  ```form-data
  {
    "description": "New Menu Description",
    "menuImage": (binary)
  }
  ```

### Success Response

- **Status Code:** 200 OK

### Error Responses

- **Status Code:** 404 NOT FOUND
- **Response Body:**

  ```json
  {
    "error": "Menu not found"
  }
  ```

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

## Delete Menu

Deletes the menu for a restaurant.

- **URL:** `{{host}}/restaurants/{restaurantId}/menu/{menuId}`
- **Method:** `DELETE`
- **Authorization:** `token`

### Success Response

- **Status Code:** 200 OK

### Error Responses

- **Status Code:** 404 NOT FOUND
- **Response Body:**

  ```json
  {
    "error": "Menu not found"
  }
  ```

- **Status Code:** 500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    "error": "Internal server error"
  }
  ```