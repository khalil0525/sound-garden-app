# Sound Garden: Music sharing application 

## 📖 Table of Contents
1. ➤ [About The Project](#about-the-project) 
2. ➤ [Overview](#overview) 
3. ➤ [How to Use the Project](#how-to-use-the-project)

## 📝About The Project
Sound Garden is a music sharing application that allows users to:
- Create/Sign in to an account
- Search for songs
- Upload/Delete/Like/Download/Stream songs
- View a list of liked Songs
- View all songs for a Genre
- Like songs, saving them for later listening
- View uploaded songs
- View profile
- Edit profile details

## ☁Overview
This project was created to give users the ability to share music with each other.

The technologies involved are:

1) **HTML/CSS** (JSX)(Front-End)
2) **React.js** (Front-end)
3) **Firebase** (Back-end)
4) **Firestore** (Database)
5) **Google Cloud Functions** (To control parts of back-end)
6) **Algolia** (Search functionality) 

The reason I choose these technologies is because **React** is apart of my main stack, and it's something I use often. **HTML/CSS** are a must when working with **React**, due to the nature of JSX. At the beginning of this project I hadn't expanded my development skills into **full-stack**, which is why I chose to work with the most viable solution for the back-end, which happened to be **Firebase**. **Firebase** comes with a lot of built in tools such as **Firestore** + **Google Cloud Functions**, which is what I needed to create a functioning database and **CRUD** system.

Some challenges that I faced were caused by the choice of technologies. The **SERN** stack would have been the best choice for this application because **Firestore** is a non-relational database. With a relational database, it would have been much easier to tie information together, and create models before initiating the project. I was able to overcome the obstacles that come with using a non-relational database by implementing cloud functions that gave the database functionality to perform similar to a relational database. Another thing that helped was setting strict rules for the collections within the database. 

## 📖How to Use the Project

![SoundGarden](https://user-images.githubusercontent.com/11954011/176253416-ec7d2465-b688-4e88-83eb-8b6c273b1688.PNG)
