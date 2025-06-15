EN - https://www.abstract-apartments.com/en<br>
BG - https://www.abstract-apartments.com/

# Background
This repository comprises the entire code base of the 'Abstract Apartment' website. 
This repository was started from [gentry-auto-detailing](https://github.com/loftongentry/gentry-auto-detailing) but with features and color theme mathcing the customer's needs.

The website is build with NodeJS.
The website contains the following API connections
 - Google API -> get reviews from google.
 - Supabase -> external database where bookins and customer information is stored
 - Stripe -> takes payments for deposit

The website is hosted on [Vercel](https://vercel.com/)<br>
The website domain is from [GoDaddy](https://www.godaddy.com/en-uk)

# The Header 
![image](https://github.com/user-attachments/assets/1dc3cfb8-b196-4038-9162-1f82364ae42f)

- The logo (which redirects to the homepage)
- The contact information - interactive, when clicked will forward to calling or emailing
- The menu buttons which lead to different pages
- Language Selector (BG|EN) - i18Next

# The Footer
![image](https://github.com/user-attachments/assets/55499321-28d0-4610-87ae-e6a14b3c56df)

 - The logo (which redirects to the homepage)
 - The menu buttons which lead to different pages
 - Social media links.
   - Intentionally put at the bottom to avoid redirecting away from the website on initial user interaction.
 - Direct link in google maps
 - AMA number to comply with Greek regulations  

# Button for scrolling up
![image](https://github.com/user-attachments/assets/d7c3edcd-844a-47ec-978e-0e79717f7e45)
- positioned at the bottom right of the screen if scrolled past the first 150px 

# Website Pages

1. Homepage
   - Contains a large hero image where we have a slogan and booking bar
     - The booking bar contains an API call to the database to get all available bookings
       ![image](https://github.com/user-attachments/assets/d79285f4-2f21-4bc4-849a-5356b0240c32)
     - The guests are automatically restricted to total of 6 to comply with regulations
   - Information about the apartment and the owners
     1. Reservation Page
        - On Clicking Book, it goes to a reservation page with the summary of details (including price breakdown)
        - Quick form to add Names and Phone number which are later stored on the database for contact purposes
        - Pay Button which leads to Stripe
          - Disabled when contact information is not provided
            ![image](https://github.com/user-attachments/assets/1aff6985-08d6-42ad-9c8d-b243103366c6)
        - On clicking Pay, it redirects to Stripe to pay the deposit
        - ![image](https://github.com/user-attachments/assets/8b50d316-a8cf-4109-954a-2b931456c95d)
        - On successful payment:
          - Adds the reservation on the database
          - Sends an email to the owners to contact the customer
2. Details
   - Detailed view of all extras and amenities
     ![image](https://github.com/user-attachments/assets/6db0256d-a5b1-4a03-8ac9-9e65eed99565)
   - <u>ToDo: this area can con configurable (Text + emoji) from the database </u>
3. Gallery
  ![image](https://github.com/user-attachments/assets/5e168923-699a-46e2-ae22-8d3195372768)
   - Expandable images of all rooms
   - Set to scroll every 3 seconds
5. Available Dates
   ![image](https://github.com/user-attachments/assets/815b437f-7ac8-4ed7-9a8f-5a0d5d89df54)
   - Shows the available dates in bigger format than the booking bar
   - Contains an API call to the database to get all available bookings
   - Clicking an available date redirects to the homepage and the check-in is pre-filled with the selected.
7. Price List
   ![image](https://github.com/user-attachments/assets/f719aa89-580f-463d-9dd1-07aeaf7f1873)
   - The prices of the tourist season and benefits of each month
   - Clicking on Available Dates [month] redirects to the Available Dates page and opens the selected month
   - The page also has currency converter in the following currencies<br>
     ![image](https://github.com/user-attachments/assets/3669ea8e-c6ef-4722-aa62-d303b661b372)<br>
      - EUR (Default)
      - BGN
      - GBP
      - CHF
      - NOK
      - DKK
      - PLN
    - <u>ToDo: this needs to be getting live data. Currently conversion is hard-coded </u>
  - Policies and Conditions
    ![image](https://github.com/user-attachments/assets/0ca341bd-c988-4f42-8bcb-387ac51c3b39)
   - <u>ToDo: this area can con configurable (Text + emoji) from the database </u>
  6. Contact Form
     ![image](https://github.com/user-attachments/assets/389f75ac-3b19-4897-a5c0-a89baa7cbf8f)
     - On Request, sends an email to the owners with the information provided
     - Check-in and Check-out are non-restricted
  7. Reviews
    ![image](https://github.com/user-attachments/assets/3e2b03bd-0c3d-4b32-adbd-90789da50712)
    - Gets reviews from Google Reviews and translates to the desired language
    - Direct links to read all reviews on Google (as the page is limited to 5 to reduce bandwidth)
    - Direct link to leave a review for the apartment
  8. Settings Page (always in Bulgarian - no need for translations)
    - Contains a login form<br>
    ![image](https://github.com/user-attachments/assets/75be7311-0d3f-49ad-b82c-77f51ce68104)<br>
    - On Successful login, it leads to the form and a table with all bookings (also contains actions Edit/Delete for each booking)<br>
    ![image](https://github.com/user-attachments/assets/a5d7b6b0-8cfd-4b39-9a99-fe27793e0a89)<br>

# External systems
  1. Supabase Database
     - Booking Table
       - BookingID - The unique Booking Identifier
       - CheckInDT - the date pf checking in
       - CheckOutDT - The date of checking out
       - CustomerID - Foreign key to the Customer table
       - Full Price - The full price of the booking
       - Paid Price - The sum that the customer paid so far
       - Comments - Any additional comments for the booking
     - Customer Table
        - Customer ID - The uniqeu Customer identifier
        - First Name
        - Last Name
        - Telephone
        - <u>ToDo - Does it need comments for customer?<u>

  2. Stripe Payment Processor
     - Allows taking payments through Credit/Debit Card for deposit
     - Allows for sending links for paying the full amount via card/Apple Pay/Google Pay
# Additional Details
  - The website has been optimized for mobile use
  - The whole development was carried out in [Visual Studio Code](https://code.visualstudio.com/) with [Node JS](https://nodejs.org/en) installed

# Useful instructions
1. <b>How to test the website on the local network (within the same router)</b>
   1. Check ipconfig on the command prompt
   2. Use this command on your laptop in Visual Studio Code Terminal (Ctrl + '):<br>
      npx next dev -H 0.0.0.0 -p 3000
   3. On your phone, type out the IPv4 Address followed by the port (3000)
2. <b>How to test the website from anywhere</b>
     1. Download [ngrog]([url](https://download.ngrok.com/windows))
     2. Open the app (it should open in console)
     3. Use this command on your laptop in Visual Studio Code Terminal (Ctrl + '):<br>
        npx next dev -H 0.0.0.0 -p 3000
     4. Generate your key and apply it in the app<br>
        ngrok config add-authtoken $YOUR_AUTHTOKEN
     5. Run the following command<br>
         ngrok.exe http 3000
3. <b> How to setup appointment requests going into your inbox</b> <br>
I made it work only on yahoo, gmail are closing a feature which allows other apps to use the email box<br>
The way it works is that the website uses an email to send one to itself with all the data the customer used.
    1. Go to yahoo account settings (create an account if you don't have one) and go to account info -> Security -> App password -> Generate and manage app passoword.
    2. Create an app password
    3. Create a file called `.env.local` and check `.gitignore` that contains that file as we don't want to share credentials on github.
    4. The file should look like: <br>
    `NEXT_PUBLIC_EMAIL=email@yahoo.com`<br>
     `NEXT_PUBLIC_EMAIL_PASS=passowrd`
    5. Try to use the form and check the Terminal for errors if occured.
