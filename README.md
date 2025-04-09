# Background
This repository comprises the entire code base of the 'Abstract Apartment' website. 
This repository was started from [gentry-auto-detailing](https://github.com/loftongentry/gentry-auto-detailing) but with features and color theme mathcing the customer's needs.

The website is build with NodeJS and it contains all the general pages listed below

# The Website Design
The website design is simple, comprising 4 total pages. The pages are:
  1. Home: The home page of the website
  2. About: An about page that accompanies details about my sister
  3. Services: Services offered by her small business
  4. Contact: A page with a form that allows the user the submit an appointment request from my sister
  
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
    5. Try to use the form and check the Terminal for errors if occured
