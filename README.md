# [Helpful Living](https://helpful-living-c45db5e13902.herokuapp.com/)

Welcome to Helpful Living. Here at Helpful Living, we aim to help you live your life a little more easily. Whether you are in need of your house being cleaned, getting the weekly shop in, or just want someone to come with you for a coffee, we are here to help.

Through our website, you will be able to book in for an initial consultant call to see how we can best provide for your needs, and after that you will be able to log on to track, edit or cancel your future appointments. We aim to make this experience as simple as possible for you, and to keep all lines of communication open for any further help you may need.

Add an image of the finished site here. I like to use [amiresponsive](https://ui.dev/amiresponsive) to get an image of my site on all device sizes, and amiresponsive allows you to click links on the page and scroll, so each device can show a different element of your site.

To visit the deployed site, visit [here](https://helpful-living-c45db5e13902.herokuapp.com/).
---

## CONTENTS

* [User Experience](#user-experience-ux)
  * [User Stories](#user-stories)

* [Design](#design)
  * [Colour Scheme](#colour-scheme)
  * [Typography](#typography)
  * [Imagery](#imagery)
  * [Entity Relationship Diagram](#entity-relationship-diagram)
  * [Wireframes](#wireframes)

* [Features](#features)
  * [General Features on Each Page](#general-features-on-each-page)
  * [Future Implementations](#future-implementations)
  * [Accessibility](#accessibility)

* [Technologies Used](#technologies-used)
  * [Languages Used](#languages-used)
  * [Frameworks, Libraries & Programs Used](#frameworks-libraries--programs-used)
  * [AI Use](#ai-use)

* [Deployment & Local Development](#deployment--local-development)
  * [Deployment](#deployment)
  * [Local Development](#local-development)
    * [How to Fork](#how-to-fork)
    * [How to Clone](#how-to-clone)

* [Bugs](#bugs)

* [Testing](#testing)

* [Credits](#credits)
  * [Code Used](#code-used)
  * [Content](#content)
  * [Media](#media)
  * [Acknowledgments](#acknowledgments)

---

## User Experience (UX)

### User Stories

| Title | User Story | Acceptance Criteria | Tasks |
| :--- | :--- | :--- | :--- |
| **Accounts System** | As a **potential customer**, I want to **create an account, log in and see that I’m logged in** so that I can **track my bookings**. | <ul><li>A clear registration form collects and securely validates a new user’s name, email, phone number and password.</li><li>A login form allows an existing user to sign in with their credentials.</li><li>Once logged in, the user’s status is visible in the navigation (e.g. “Hello, &lt;name&gt;!”)</li><li>A “Log Out” option is available to end the session.</li></ul> | <ul><li>Set up **Django’s authentication system** and a custom user model.</li><li>Create Django views and forms for user registration and login.</li><li>Update the base HTML template to display conditional navigation links for logged-in and logged-out users.</li></ul> |
| **Landing Page** | As a **new visitor**, I want to **visit a welcoming landing page that tells me about the business** so that I can **understand what you offer**. | <ul><li>The landing page displays a clear welcome message and a summary of your services.</li><li>The page is visually appealing and easy to navigate.</li><li>It contains links to other key pages, such as "Services," "Gallery," and "Login/Register."</li></ul> | <ul><li>Create a **core app** in Django.</li><li>Write a view to render the landing page.</li><li>Design the `landing_page.html` template.</li><li>Set up the URL path for the homepage (`/`).</li></ul> |
| **Booking System** | As a **logged-in user**, I want to **book a 20-minute consultation** so I can **schedule my first appointment**. | <ul><li>A "Book" button on the services page or a dedicated booking page leads to a consultation form.</li><li>The form allows the user to select a date and an available time slot.</li><li>The system creates a new booking record linked to the user's account.</li></ul> | <ul><li>Create a **Booking model** linked to the **User model**.</li><li>Implement a Django form for the booking process.</li><li>Build a view to handle the booking form submission.</li></ul> |
| **Services Page** | As a **potential customer**, I want to **see a page with a list of services** so I can **find out more information about your offerings**. | <ul><li>The "Services" page is accessible from the navigation.</li><li>It displays each service as a visually distinct card with a title, a brief description, and an image.</li><li>Clicking on a service card leads to a separate page with more detailed information about that service.</li></ul> | <ul><li>Create a services app and a **Service model**.</li><li>Write a Django view to fetch all Service objects for the main page.</li><li>Design the `service_list.html` template for the cards page.</li><li>Create a separate view and template for the individual service detail page.</li></ul> |
| **Gallery** | As a **potential customer**, I want to **browse a gallery of past work** so I can **see examples of your services in action**. | <ul><li>A dedicated "Gallery" page is available from the navigation.</li><li>The page displays images in a grid format.</li><li>Clicking on an image opens a larger, more detailed view within a lightbox.</li></ul> | <ul><li>Create a **GalleryImage model** to store image details.</li><li>Implement a view to fetch all images from the database.</li><li>Design the `gallery.html` template and integrate a JavaScript lightbox library.</li></ul> |
| **Notifications System** | As a **logged-in user**, I want to **receive notifications about my appointments** so that **I am always up to date on changes and updates**. | <ul><li>A notification badge appears in the navbar, showing the number of unread messages.</li><li>Clicking the badge reveals a pop-up with a list of the last few notifications.</li><li>Read notifications are visually distinguished from unread ones (e.g. greyed out).</li><li>The pop-up has a "See All" button that links to a full notifications page.</li></ul> | <ul><li>Create a **Notification model** linked to the **User model**.</li><li>Build a Django view that returns the latest notifications from the database, filtered by the logged in user.</li><li>Use **JavaScript** on the frontend to fetch and render the notifications in a dynamic pop-up.</li></ul> |
| **Contact Form** | As a **visitor**, I want to **send a message** so I can **ask a question about your services**. | <ul><li>A simple contact form is available on a "Contact" page.</li><li>The form collects a name, email, and a message.</li><li>Upon submission, the message is sent to the site administrator's email address.</li></ul> | <ul><li>Create a **Django form** for the contact messages.</li><li>**Configure the Django email backend** in `settings.py`.</li><li>Write a view to handle the form submission and send the email.</li></ul> |
| **Email Notification System** | As a **site owner**, I want the system to **automatically send emails to users** so that I can **communicate changes to their bookings**. | <ul><li>When a superuser amends a user's booking, an email is automatically sent to the user's registered email address.</li><li>When a superuser deletes a user's booking, a different email is sent to the user, confirming the cancellation.</li><li>The emails contain clear, user-friendly language and specify the reason for the change or deletion.</li></ul> | <ul><li>Configure the Django email backend in `settings.py` with your email server details.</li><li>Create a custom method on the **Booking model's `save()`** to check for changes and trigger an email.</li><li>Implement a **`post_delete` signal** for the Booking model to handle deletion emails.</li><li>Design two separate email templates: one for amendments and one for cancellations.</li><li>Write the Python code to send the emails, passing in the necessary booking data.</li></ul> |
| **Reviews System** | As a **potential customer**, I want to **read reviews from other clients** so I can **trust the quality of your work**. | <ul><li>A "Reviews" section or page is accessible on the site.</li><li>The reviews are displayed with a star rating and a customer's comment.</li><li>Reviews are organized to be easy to read, with total star rating at the top of the list.</li><li>Ratings are able to go through straight away, but comments must be **approved first**.</li></ul> | <ul><li>Create a **Review model** with fields for comment, rating, and a link to the **Service model**.</li><li>Write a view to fetch and display the reviews.</li><li>Design a template to render the reviews on the page.</li><li>Ensure superuser needs to approve comments before applying to the page publicly.</li></ul> |
| **Superuser Features** | As a **site owner**, I want to **manage content in-app** so that I can **improve the ease of use of the tools for myself**. | <ul><li>Allow the owner to approve/amend/delete user bookings where required.</li><li>Allow the owner to contact users via the site.</li><li>The owner can manage images within the gallery.</li><li>The owner receives notifications to keep up to date with the user’s interactions with the site.</li></ul> | <ul><li>Use **Django block conditionals** within the HTML templates to allow certain features to only be available for the superuser.</li><li>Implement a contact form for the superuser to select a registered site user and send them an email.</li><li>Add an image upload feature to the gallery page, accessible only by the superuser.</li><li>Ensure that any actions made by the user which require the superuser to be informed appear within the superuser’s notification menu.</li></ul> |


## Design

### Colour Scheme

![color palette for the site](/documentation/images/helpful-living-colour-palette.png)

The colour scheme for this site was derived from the logo colors using the [coolers](https://coolors.co/image-picker) web application.

### Typography

Fonts chosen from [Google Fonts](https://fonts.google.com/).

- Logo Font: Quicksand
- Heading Font: Poppins
- Primary Font: Lato

Since the website is designed for helping primarily older users, and those that need a bit of extra support and care, readability is key. I have chosen fonts which are accessible for the users, while remaining visually modern and pleasing.

The Lato font provides a high level of clarity so that characters are not easily confused (e.g. 1, I and l).

The Poppins font offers a good level of differentiation between characters too, whilst also having a more circular design and stronger weights, allowing it to be useful for my headings.

The Quicksand font has a more gentle curved design, which is visually more inviting for a logo text.

### Imagery

Use this section to explain what sort of imagery you plan to use through your site.

### Entity Relationship Diagram
![Entity relationship diagram showing how each table within the database is linked.](/documentation/images/helpful_living_erd.png)

### Wireframes

Add the images or links for your wireframes here.

There are lots of different options to create your wireframes - Code Institute students can access [Balsamiq](https://balsamiq.com/) as part of the course.

Some other options include [Figma](https://www.figma.com/), [AdobeXD](https://www.adobe.com/products/xd.html), [Sketch](https://www.sketch.com/?utm_source=google&utm_medium=cpc&adgroup=uxui&device=c&matchtype=e&utm_campaign=ADDICTMOBILE_SKETCH_GAD_DG_UK_T1_ALWAYS-ON_S_TRF_PROS_BRAND&utm_term=sketch&utm_source=google&utm_medium=cpc&utm_content=TOF_BRND__generic&hsa_acc=8710913982&hsa_cam=16831089317&hsa_grp=134620695759&hsa_ad=592060065319&hsa_src=g&hsa_tgt=kwd-14921750&hsa_kw=sketch&hsa_mt=e&hsa_net=adwords&hsa_ver=3&gclid=Cj0KCQjwr4eYBhDrARIsANPywCjRIFn93DMezYnsyE5Fic_8l8kynJtut0GYMU01TiohHjwziFtlH0gaAhteEALw_wcB) and [Mockup](https://apps.apple.com/us/app/mockup-sketch-ui-ux/id1527554407) to name just a few! Or you can even go old school and get those wireframes completed using pen and paper. Just snap an image of the completed wireframes to add the images to the README.

## Features

👩🏻‍💻 View an example of a completed user experience section [here](https://github.com/kera-cudmore/TheQuizArms#Features)

This section can be used to explain what pages your site is made up of.

### General features on each page

If there is a feature that appears on all pages of your site, include it here. Examples of what to include would the the navigation, a footer and a favicon.

I then like to add a screenshot of each page of the site here, i use [amiresponsive](https://ui.dev/amiresponsive) which allows me to grab an image of the site as it would be displayed on mobile, tablet and desktop, this helps to show the responsiveness of the site.

### Future Implementations

What features would you like to implement in the future on your site? Would you like to add more pages, or create login functionality? Add these plans here.

### Accessibility

Be an amazing developer and get used to thinking about accessibility in all of your projects!

This is the place to make a note of anything you have done with accessibility in mind. Some examples include:

Have you used icons and added aria-labels to enable screen readers to understand these?
Have you ensured your site meets the minimum contrast requirements?
Have you chosen fonts that are dyslexia/accessible friendly?

Code Institute have an amazing channel for all things accessibility (a11y-accessibility) I would highly recommend joining this channel as it contains a wealth of information about accessibility and what we can do as developers to be more inclusive.

## Technologies Used

### Languages Used

- HTML5
- CSS
- JavaScript
- Python

### Frameworks, Libraries & Programs Used

- Cloudinary
- Crispy Bootstrap5
- DJ Database URL
- Django
- Django AllAuth
- Django Crispy Forms
- Django Summernote
- Gunicorn
- Psycopg2
- WhiteNoise
- Git
- GitHub

For further dependency libraries, and version information, please see [requirements.txt](/requirements.txt).

### AI Use
- Help to locate deployment error caused by missing Procfile.
- Bypass bootstrap stylings to help with custom styling on navbar.
- Touch up logo image to give white border around the heart shape.
- Help make autocomplete feature and other widgets reusable throughout models, instead of applying settings repeatedly.
- Ensure the access token auto-generates on new booking.

## Deployment & Local Development

### Deployment

Deployed using [Heroku](https://www.heroku.com/) via [GitHub](http://www.github.com/).
- Ensure the repository is available within your GitHub.
- Sign into Heroku and create a new app.
- Ensure any env variables are passed through to Heroku through the config variables.
- Choose the option to deploy the app via Heroku, and deploy from main branch.

### Local Development

#### How to Fork

- Go to the [main repository page](https://github.com/fspruce/helpful-living).
- Locate the fork button in the upper right-hand corner of the page, and click "fork".
- Confirm fork details, such as repository name and ownership, and click "create fork".

#### How to Clone

- Go to the [main repository page](https://github.com/fspruce/helpful-living).
- Locate the green "code" button near the top right of the file list.
- Click the "code" button, ensuring the HTTPS tab is selected, and copy the project URL.
- Through your local terminal, navigate to where you wish to save the project, and use `git clone <project-url>` to clone the repo. 

## Bugs

|Bug | Fix|
|----|----|
|Missing Procfile for Heroku deployment | Add Procfile to tell Heroku to use Gunicorn to run the app |
|Missing URL for Summernote| Add URL for Summernote|

## Testing

Start as you mean to go on - and get used to writing a TESTING.md file from the very first project!

Testing requirements aren't massive for your first project, however if you start using a TESTING.md file from your first project you will thank yourself later when completing your later projects, which will contain much more information.
  
Use this part of the README to link to your TESTING.md file - you can view the example TESTING.md file [here](milestone1-testing.md)

## Credits

-[coolers](https://coolors.co/generate) for color palette from image.
- [favicon.io](https://favicon.io/favicon-converter/) for favicon generation.

### Code Used

If you have used some code in your project that you didn't write, this is the place to make note of it. Credit the author of the code and if possible a link to where you found the code. You could also add in a brief description of what the code does, or what you are using it for here.

### Content

Who wrote the content for the website? Was it yourself - or have you made the site for someone and they specified what the site was to say? This is the best place to put this information.

###  Media

If you have used any media on your site (images, audio, video etc) you can credit them here. I like to link back to the source where I found the media, and include where on the site the image is used.
  
###  Acknowledgments

If someone helped you out during your project, you can acknowledge them here! For example someone may have taken the time to help you on slack with a problem. Pop a little thank you here with a note of what they helped you with (I like to try and link back to their GitHub or Linked In account too). This is also a great place to thank your mentor and tutor support if you used them.