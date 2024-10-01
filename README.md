

# VibeWire - *A Full-Stack Real-Time ChatApp*

 ***VibeWire*** is a feature-rich real-time chat application built using React, Vite, and >Radix UI components on the client side, combined with a backend that supports >WebSocket-based communication. It offers users a seamless experience with features like >authentication, real-time messaging, user profile management, and notifications.


## 🚀 Features

- **Real-Time Messaging** : Users can send and receive messages in real time using WebSocket.

- **Channel Management** : Create and manage multiple channels for group conversations.

- **Direct Messaging** : Communicate with individual users through direct messages.

- **Profile Management** : Users can update their profiles and add profile images.

- **Search Functionality** : Easily search for contacts and messages.


## 🛠️Tech Stack

- ### Frontend:

  - React.js
  - Zustand (State Management)
  - Axios (API Calls)
  - React Router (Routing)
  - Multer (File Uploads)

- ### Backend:

  - Node.js
  - Express.js
  - MongoDB (Mongoose for data modeling)
  - JWT (User authentication)


## 📦 Getting Started

### Prerequisites
- Node.js
- MongoD
- npm

### Backend Setup

Clone the repository :

> ```bash
>   git clone https://github.com/yourusername/yourproject.git
> ```

Navigate to the project directory :

> ```bash
>  cd VibeWire/server
>```

Install the dependencies :

>```bash
>  npm Install
>```

Create a .env file in the root directory and add your environment variables. Example :

>```bash
>  JWT_KEY=your_jwt_secret_key
>  MONGO_URI=your_mongo_connection_string
>```

Start the server :

>```bash
>  npm run dev
>```
### Frontend Setup


Navigate to the project directory :

>```bash
>  cd VibeWire/client
>```

Install the dependencies :

>```bash
>  npm Install
>
>```

Start the server :

>```bash
>  npm run dev
>```

## Usage

- Open the application in your web browser (default: http://localhost:3001).
- Create an account or log in with your credentials.
- Access your chats, create channels, and manage your profile from the dashboard


## Frontend Structure

The frontend is organized into components for managing chats, contacts, and user profiles. Key components include:

- CreateChannel: Allows users to create new chat channels.
- NewDm: Enables users to start direct messages with contacts.
- Profile: Manages user profile settings.

## Backend Structure

The backend is structured around RESTful API principles, providing endpoints for authentication, messaging, and channel management. Key controllers include:

- AuthController: Handles user authentication and profile management.
- ChannelController: Manages channel creation and messages.
- MessagesController: Handles messaging functionalities.

## 🤝 **Contributing**
Contributions are welcome! Feel free to open issues or submit pull requests.
