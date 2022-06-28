# Sound Garden: Music sharing application 

## 📖 Table of Contents
1. ➤ [About The Project](#about-the-project) 
2. ➤ [Overview](#overview) 
3. ➤ [How to Use the Project](#how-to-use-the-project)

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

1) **HTML/CSS** (JSX)(Front-End)
2) **React.js** (Front-end)
3) **Firebase** (Back-end)
4) **Firestore** (Database)
5) **Google Cloud Functions** (To control parts of back-end)
6) **Algolia** (Search functionality) 

The reason I choose these technologies is because **React** is apart of my main stack, and it's something I use often. **HTML/CSS** are a must when working with **React**, due to the nature of JSX. At the beginning of this project I hadn't expanded my development skills into **full-stack**, which is why I chose to work with the most viable solution for the back-end, which happened to be **Firebase**. **Firebase** comes with a lot of built in tools such as **Firestore** + **Google Cloud Functions**, which is what I needed to create a functioning database and **CRUD** system.

Some challenges that I faced were caused by the choice of technologies. The **SERN** stack would have been the best choice for this application because **Firestore** is a non-relational database. With a relational database, it would have been much easier to tie information together, and create models before initiating the project. I was able to overcome the obstacles that come with using a non-relational database by implementing cloud functions that gave the database functionality to perform similar to a relational database. Another thing that helped was setting strict rules for the collections within the database. 

## 📖How to Use the Project
### Create/Sign in an account
![Create-signin SG](https://user-images.githubusercontent.com/11954011/176270113-f4cf0cbf-969d-479a-a465-13e660932f07.png)
### Upload song
![Upload](https://user-images.githubusercontent.com/11954011/176270137-3b5f7ac5-acaf-493a-8fab-f96fd0c0fd84.png)
### Stream song
![play song](https://user-images.githubusercontent.com/11954011/176270233-3d7b9967-7a99-4594-96cb-3876d1114887.png)
### Like song
![Like Song](https://user-images.githubusercontent.com/11954011/176270171-307f776e-36a2-46eb-83a4-53273159aa2a.png)
### Delete song
![Delete Song](https://user-images.githubusercontent.com/11954011/176270268-39de7dbc-6e42-4d52-adee-702d5c3a2c9a.png)
### Edit song
![Edit song](https://user-images.githubusercontent.com/11954011/176270289-ad91321f-f0a2-4dea-b18b-e3cbb66862fa.png)
### Search for songs
![SoundGarden](https://user-images.githubusercontent.com/11954011/176253416-ec7d2465-b688-4e88-83eb-8b6c273b1688.PNG)
### View a list of liked Songs
![LikedSongs](https://user-images.githubusercontent.com/11954011/176271680-5eabce00-c315-413e-950b-77191f826b00.png)
### View all songs for a Genre
![GenresPage](https://user-images.githubusercontent.com/11954011/176271703-b558e3ce-0076-48b5-8828-ed51a44ea1ac.png)
### View uploaded songs
![UploadedSongs](https://user-images.githubusercontent.com/11954011/176271726-e7980121-6ced-44a5-8305-d7c9fcf057fc.png)
### View profile
![ViewProfile](https://user-images.githubusercontent.com/11954011/176270318-4a8122a1-ae54-4cf8-850b-735681c3f71f.png)
### Edit profile details
![EditProfile](https://user-images.githubusercontent.com/11954011/176271742-65676b03-1b1c-46e1-9808-aa96db5135a9.png)

