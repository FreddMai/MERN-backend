const uuid = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Fred M",
    email: "test@test.com",
    password: "test",
  },
];

const getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const errros = validationResult(req);
  if (!errros.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }
  const { name, email, password } = req.body;
  const hasUser = DUMMY_USERS.find((u) => u.email === email);

  if (hasUser) {
    throw new HttpError("Could not create user, email exists", 422);
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const user = DUMMY_USERS.find((u) => email === email);

  if (!user || user.password !== password) {
    throw new HttpError("Could not identify user", 401);
  }

  res.status(200).json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
