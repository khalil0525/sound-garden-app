# Sound Garden: Music sharing application

Live Demo of [Sound Garden](https://sound-garden-eeeed.web.app/)

## 📖 Table of Contents

1. ➤ [About The Project](#about-the-project)
2. ➤ [Overview](#overview)
3. ➤ [How to Use the Project](#how-to-use-the-project)
4. ➤ [Credits](#credits)

## 📝About The Project

Sound Garden is a music sharing application that allows users to:

- Create/Sign in to an account
- Upload/Delete/Edit/Like/Download/Stream songs
- Search for songs
- Like songs, saving them for later listening
- View a list of liked Songs
- View all songs for a Genre
- View uploaded songs
- View profile
- Edit profile details
- View artists by name (Coming soon)
- Change profile banner photo (Coming Soon)
- Search for & View another user's profile (Coming Soon)

## ☁Overview

This project was created to give users the ability to share music with each other.

The technologies involved are:

1. **HTML/CSS** (JSX)(Front-End)
2. **React.js** (Front-end)
3. **Firebase** (Back-end)
4. **Firestore** (Database)
5. **Google Cloud Functions** (To control parts of back-end)
6. **Algolia** (Search functionality)

The reason I choose these technologies is because **React** is apart of my main stack, and it's something I use often. **HTML/CSS** are a must when working with **React**, due to the nature of JSX. At the beginning of this project I hadn't expanded my development skills into **full-stack**, which is why I chose to work with the most viable solution for the back-end, which happened to be **Firebase**. **Firebase** comes with a lot of built in tools such as **Firestore** + **Google Cloud Functions**, which is what I needed to create a functioning database and **CRUD** system.

Some challenges that I faced were caused by the choice of technologies. The **SERN** stack would have been the best choice for this application because **Firestore** is a non-relational database. With a relational database, it would have been much easier to tie information together, and create models before initiating the project. I was able to overcome the obstacles that come with using a non-relational database by implementing cloud functions that gave the database functionality to perform similar to a relational database. Another thing that helped was setting strict rules for the collections within the database.

## Build

To build locally, simply follow these steps:

1. Clone repo to local machine
2. Change directory to project & run `npm i`
3. Run the `npm start` command to start app

## 📜Credits

Khalil Collins

[![Github Profile](https://user-images.githubusercontent.com/11954011/176273000-707b1d41-9837-4f02-bac9-3126e1bcd260.png)](https://github.com/khalil0525)
[![LinkedIn Profile](https://user-images.githubusercontent.com/11954011/176273060-72918a45-23ce-48b7-90f0-9b5debb0258f.png)](https://www.linkedin.com/in/khalil-collins/)
