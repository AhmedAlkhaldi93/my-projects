# Design Document - "Ahmed cafe"

By Ahmed Alkhaldi

## Scope

In this section you should answer the following questions:

* What is the purpose of your database?

  Managing orders and sales in a cafe.
* Which people, places, things, etc. are you including in the scope of your database?

  Employees, menu, orders, payment methods.
* Which people, places, things, etc. are *outside* the scope of your database?

  Supplier information, customer reviews, or purchase online.

## Functional Requirements

In this section you should answer the following questions:

* What should a user be able to do with your database?
    - View the product menu.
    - Create a new order.
    - Choose a payment method.


* What's beyond the scope of what a user should be able to do with your database?
    - Modify or delete products.
    - Manage employee data.
    - Edit payment methods.


### Entities and Relationships

# Entities
**1. Employees**
 - Employee_ID (Primary Key)
 - Name
 - Salary

**2. Menu**
 - Item_ID (Primary Key)
 - Name
 - Price

**3. Orders**
 - Order_number (Primary Key)
 - Employee_ID (Foreign Key → Employees)
 - Order_time

**4. Order_item**
 - Order_number (Foreign Key → Orders)
 - Item_ID (Foreign Key → Menu)
 - Price (Foreign Key → Menu)
 - Quantity

**5. Bills**
 - Bill_ID (Primary Key)
 - Order_number (Foreign Key → Orders)
 - Payment_method
 - Total_amount

![image](https://i.postimg.cc/3rFwzFMf/TABELS.png)


# Relationships
- Employees - orders    (one to many)
- Menu - order_item (one to many)
- Orders - Order_item  (one to many)
- Bills - Orders    (one to one)
  
![image](https://i.postimg.cc/2jMCsLqB/1.jpg)
![image](https://i.postimg.cc/g0H5GjYp/2.jpg)
![image](https://i.postimg.cc/TwHtPWFz/3.jpg)
![image](https://i.postimg.cc/kM2mvNJt/4.jpg)

## Representation

### Entities

In this section you should answer the following questions:

* Which entities will you choose to represent in your database?

  Employees, Menu, Orders, Order_item and Bills.
* Why did you choose the types you did?

  - **INTEGER:** Employee_ID, Item_ID, Order_number, Quantity and Bill_ID.
  - **TEXT:** Name and Payment_method.
  - **DECIMAL:** Salary, Price and Total_amount.
  - **DATETIME:** Order_time.
* Why did you choose the constraints you did?

  - **PRIMARY KEY:** Employee_ID, Item_ID, Order_number, Bill_ID and (Order_number,Item_ID)
  - **FOREIGN KEY:**  Employee_ID (FK → Employees), Order_number (FK→ Orders), Item_ID (FK → Menu), Price(FK → Menu) and Order_number (FK → Orders)
  - **NOT NULL:** Employee_ID, Item_ID, Order_number, Bill_ID, Name, Salary, Price, Quantity and Total_amount



## Optimizations

In this section you should answer the following questions:

* Which optimizations (e.g., indexes, views) did you create? Why?
      
  - I created a view called **Order_Bills** to simplify the process of retrieving complete order billing information in one query.
  This view joins data from the **Bills, Order_item, and Orders** tables, making it easier to analyze orders, payment methods, item details, and employee information without repeatedly writing complex JOIN queries.

  - This index helps speed up queries that filter or join based on **Order_number** in the **Order_item** table.  


## Limitations

In this section you should answer the following questions:

* What are the limitations of your design?
  - The database does not include a table for suppliers.
  - There is no tracking for customer reviews or comments.
* What might your database not be able to represent very well?

  It is not possible to track the order modification history.


## Files required
- [schema.sql](https://gist.github.com/AhmedAlkhaldi93/90a9761b00784d14f37148a091dcd1a4)
- [queries.sql](https://gist.github.com/AhmedAlkhaldi93/1a18a74ecd8ca803b54edf2b9d9789b1)
