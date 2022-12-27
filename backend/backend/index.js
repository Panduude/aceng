import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import db from './config/Database.js';
import SequelizeStore from 'connect-session-sequelize';
import UserRoutes from './routes/UserRoute.js';
import RoomRoutes from './routes/RoomRoute.js';
import BookingRoutes from './routes/BookingRoute.js';
import AuthRoutes from './routes/AuthRoute.js';

dotenv.config();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

/* 
--------------------------------Migrating Table--------------------
*/

// (async () => {
//   await db.sync();
// })();

/*
-------------------------------------------------------------------
  */

const app = express();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: 'auto',
    },
  })
);

app.use(fileUpload());
app.use(express.static('public'));
app.use(express.static('public/images/rooms'));

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173'
  })
);
app.use(express.json());
app.use(UserRoutes);
app.use(RoomRoutes);
app.use(BookingRoutes);
app.use(AuthRoutes);

// Migrating Session Sequelize
// store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log('Server is running');
});
