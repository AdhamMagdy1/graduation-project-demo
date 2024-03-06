# API Documentation

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

- **Status Code:**  500 INTERNAL SERVER ERROR
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
  "  password": "password123"
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

- **Status Code:**  500 INTERNAL SERVER ERROR
- **Response Body:**

  ```json
  {
    
  "error": "Internal server error"
  } 
  ```

# Replace `{{host}}` with the actual URL of your backend server, in this case, `http://localhost:5000`
