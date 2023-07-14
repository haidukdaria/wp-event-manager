# wp-event-manager


## How it works
The repository includes files for WordPress theme "Event manager".

This is an event manager that adds post type "Event" with the custom field "Price" and allows you to manage events on the frontend as admin and view them as a client.

There are two page templates - Admin and Client.  Admin can view events list, add new events, edit/delete current events. Clients can view the events list and read more about specific ones. Note that the admin template is available only to logged-in users with the role "administrator".

Technology used in the repository - Wordpress, PHP, HTML, CSS, Javascript, WordPress REST API

## How it looks
Client https://i.imgur.com/OVcSJ9b.png Video https://recordit.co/Y2wf4Hli80

Admin https://i.imgur.com/OUeRY1u.png Video https://recordit.co/zm2ckkW6Ma



## How to use
1. Clone the repository to the directory site/wp-content/themes/

2. Use database file in the repository with all the data set OR do the next steps:
   - Activate the "Event manager" theme in Appearance->Themes (https://i.imgur.com/TCFYt0R.png)
   - Create 2 pages: for a client with page template 'Client' and for an admin with page template 'Admin'  (https://i.imgur.com/Lv1SuFI.png, https://i.imgur.com/5ns1OQ8.png)
   - Set Client page as your homepage in Settings->Reading (https://i.imgur.com/rPJclUg.png)
   - Add these 2 pages to a menu with location 'Primary' to display them in the header in Appearance->Menus (https://i.imgur.com/kOXNZup.png, https://i.imgur.com/rHzRdAo.png)
   - Make sure your user has admin rights to see the admin template
   - Visit site

Credentials for admin in database file from repository (login/password): *developer*/*developer*

## Author
Daria Haiduk, haidukdari@gmail.com

