<h1 align="center">
	Share and Fun 🤳
</h1>
<h4 align="center">Share and Fun is a social media platform built with the MERN Stack. You can connect with your friends, share images, like and comment on posts, and search for topics. Share and Fun is secure and stateless with email verification and JWT authentication. Join Share and Fun and have fun with social networking!</h4>

<p align="center">
    <img src="https://img.shields.io/badge/%E2%9D%A4-Made%20with%20Love-blue"  alt="Gitter">
</p>

<p align="center">
  • <a href="#key-features">Key Features</a> 
  • <a href="#how-to-use">How To Use</a> 
  • <a href="#app-demo">App demo</a> 
  • <a href="https://share-and-fun-web-app.vercel.app">Live Demo</a> 
  </p>

<p align="center">
    <img src="https://github.com/Pravin69/Share-and-Fun-Web-app/blob/main/demo/app_demo.jpeg?raw=true" alt="Share and Fun Capture" style="max-width: 100% !important">
</p>

## Key Features

- **Email Verification** :-

  - Implemented a secure email verification process for account registration, preventing unauthorized access and spam accounts.

- **Global State Management** :-

  - Utilized Redux to manage the global state of the application, ensuring seamless data flow and a responsive user interface.

- **JWT Authentication** :-

  - Implemented a stateless authentication and authorization strategy using JSON Web Tokens (JWT), ensuring data security and integrity.

- **Post Creation and User Management** :-

  - Users can create and delete posts with images, like and comment on posts, and reply to comments, enabling social interaction and expression.

- **Cloudinary** :-

  - Used Cloudinary to manage digital assets like images, optimizing storage and performance.

- **Post Search** :-

  - Users can search for posts by keywords, facilitating content discovery and relevance.

- **User Account Management** :-

  - Users can easily create or update their accounts, offering a personalized and user-centric experience.

- **Light and Dark Mode** :-
  - Users can switch between light and dark mode, offering a customizable and user-friendly interface.

## How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line :

```
# Clone this repository
  git clone https://github.com/Pravin69/Share-and-Fun-Web-app

# Go into the repository
  cd Share-and-Fun-Web-app

# Install client dependencies
  cd client
  npm install

# Install server dependencies
  cd server
  npm install

# Configure environment variables by creating .env file in the server and client directory and copy the content of env.example file in .env file, and fill it with your own secrets.
  cp env.example .env

# Create a MongoDB database and name it 'social_app', You can use MongoDB Atlas cloud free tier.

# Start server in a terminal
  cd server/
  npm start

# Start client in another terminal while server is running.
  cd client/
  npm run dev
```

## App Demo

![Demo](https://github.com/Pravin69/Share-and-Fun-Web-app/blob/main/demo/Demo.gif?raw=true)

## You may also like... 🙂

- [Apna-Shop](https://github.com/Pravin69/mern-ecommerce) - An e-commerce platform
- [Movie-remix](https://github.com/Pravin69/movie-remix) - A movie recommender app
