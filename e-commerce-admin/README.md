# Mahalat

----------------------------------------------------------
# push notification api

URL => /api/send-notification
Method => POST 
Body =>{
  "deviceToken": "USER_DEVICE_TOKEN",
  "title": "Hello Bhai!",
  "body": "Teri notification aa gayi 🔥"
}
----------------------------------------------------------
# add zones api

URL =>  /api/shipping/admin/add-zone | Add city and price 
Method => POST | 
Body =>{ 
    "city": "Baghdad",
     "price": 5000
}

URL =>  /api/shipping/admin/update-zone/:id | Update city/price 
Method =>  PUT |
Body => { 
    "city": "Basra",
     "price": 7000
}

URL =>  /api/shipping/admin/delete-zone/:id  Delete zone 
Method => DELETE | 

URL =>  /api/shipping/get-shipping-charge | Get charge by city (Public) 

Method => POST | 

Body => { 
    "city": "Baghdad" 
}

get all zones
URL | /api/shipping/zones
Method | GET
---------------------------------------------------------------------------
1. Add New Category (Main or Subcategory)
API Path: POST /api/categories
Request Body:{
  "name": "Men",
  "parentId": null,
  "level": 1
}
name: The name of the category (e.g., "Men").

2. Add a Subcategory (Men's T-shirt) under Men
API Path: POST /api/categories
Request Body:{
  "name": "Men's T-shirt",
  "parentId": "60b3c2f4a4f5f73d3f7b2b8d", // Parent category ID of "Men"
  "level": 2
}

3. Update a Category
API Path: PUT /api/categories/60b3c2f4a4f5f73d3f7b2b8d
Request Body:{
  "name": "Men's Shirt",
  "parentId": "60b3c2f4a4f5f73d3f7b2b8d",
  "level": 2
}

4. Delete a Category (Men)
API Path: DELETE /api/categories/60b3c2f4a4f5f73d3f7b2b8d

Request Body: None required. Just use the ID in the path.

5. Get All Categories
API Path: GET /api/categories

Request Body: None required.

6. Get Category by ID
API Path: GET /api/categories/60b3c2f4a4f5f73d3f7b2b8d

Request Body: None required.

--------------------------------------------------------------------