import bcrypt from 'bcryptjs';

const users = [
  {
    username: 'AdminUser',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    username: 'JohnDoe',
    email: 'john@email.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    username: 'JaneDoe',
    email: 'jane@email.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

export default users;