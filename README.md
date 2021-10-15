# AuthSystem


# ---------- AuthSystem Project ----------
* This project help in designing an authentication system for any web application:
* Here are few specification about the project
    - It has 3 end points
        - /api/sign_up  this take three values as input { name, email, password}
        - /api/sign_in this take two values as inputs {email, password}
        - /api/clean  this take nothing as input the only use is it deletes all the data stored in the DB so far.

* It also have important restrictions on the password
  *  Must contain an upper case alphabet
  *  Must contain a lower case alphabet
  *  Must contain a numeric value
  *  Must contain a special symbol
  *  Password must not contain user id as a substring. 


