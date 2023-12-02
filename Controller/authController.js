const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Session = require("../Models/sessionModel");
const labModel = require("../Models/labModel");
const departmentModel = require("../Models/departmentModel");
const mailService = require("../utils/mailSerive");
// const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

//* Token function

const createAndSendToken = catchAsync(async (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  await Session.create({
    token,
  });

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

//This is the signup function to create user
exports.signup = catchAsync(async (req, res, next) => {
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  if (password !== passwordConfirm) {
    return res.status(400).json({
      status: "fail",
      message: "Passwords do not match",
    });
  } else {
    const lab = req.body.lab;
    const foundLab = await labModel.findOne({ name: lab })
    if (foundLab) {
      const department = foundLab.department;
      console.log(department);
      const newUser = await User.create({
        userId: req.body.userId,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        designation: req.body.designation,
        contactNumber: req.body.contactNumber,
        department: department,
        // passwordChangedAt: req.body.passwordChangedAt
        roles: {
          role: req.body.roles.role || "User",
          lab: foundLab._id,
        },
        issuedItems: [],
        firstLogin: true,
      });
      createAndSendToken(newUser, 201, res);
    }
  }


  // res.status(201).json({
  //   status: "success",
  //   data: newUser,
  // });
  // next();
});

//This is the login function to login the user
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Checking the Email and password exists
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  //  Finding the user with the email provided
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const dep = await departmentModel.findById(user.department);
  const lab = await labModel.findById(user.roles.lab);

  user.department = dep;
  user.roles.lab = lab;

  //Creating the token
  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // * Getting the token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please login to get access", 401)
    );
  }

  // * Verification of the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // * Check user still exists or not
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("The user doesnot exists", 401));
  }

  // ! Grant access to the protected routes
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that address", 404));
  }

  // Generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //Sending the email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetpassword/${resetToken}`;
  const message = `Forgot Your Password Submit a Patch request with your new password and passwordConfirm to the ${resetURL}.\n If you didn't forget your password, please ignore.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token(valid for 10 min only)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token send to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    return next(
      new AppError(
        "There was an Error sending the error to the email. Try Again!",
        500
      )
    );
  }
});

exports.refreshController = catchAsync(async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new AppError("Please login", 400));
  }

  token = req.headers.authorization.split(" ")[1];
  const session = await Session.findOne({ token });

  if (!token || !session) {
    return next(new AppError("Please login", 400));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  let user = null;

  if (decoded.id) {
    user = await User.findById({ _id: decoded.id });
  }

  const dep = await departmentModel.findById(user.department);
  const lab = await labModel.findById(user.roles.lab);

  user.department = dep;
  user.roles.lab = lab;

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Getting user baised on reset Token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //If the token is not expired and the user is found
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //login the user and send JWT
  createAndSendToken(user, 200, res);
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

exports.addUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    userId: req.body.userId,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    designation: req.body.designation,
    contactNumber: req.body.contactNumber,
    // passwordChangedAt: req.body.passwordChangedAt
    department: req.body.department,
    roles: {
      role: req.body.roles.role || "user",
      lab: req.body.roles.lab,
    },
    firstLogin: true,
  });

  if(res.status(201)){
    const mailOptions = {
      from: "a_dhiman@mt.iitr.ac.in",
      to: req.body.email,
      subject: `Welcome to Inventory Portal, Tinkering Lab`,
      html: ` This is to inform you that your credentials has been created to access the Inventory Portal, Tinkering Lab.
      <p>Kindly login with the following credentials:</p>
      <p>Email: ${req.body.email}</p>
      <p>Password: ${req.body.password}</p>

      <p>Onced logged in, you can always change your password from the profile section.</p>
      <p>For any queries, please contact the admin ayushd175@gmail.com.</p>
      <br>
      Regards,
      <p>Tinkering Lab Students' Body</p>
      </br>
      `,      

    };
    mailService.sendMail(mailOptions, function (err) {
      if (err) {
        return next(new AppError(err.message, err.statusCode));
      } else {
        console.log("Mail sent successfully!");
      }
    });
  }
  res.status(201).json({
    status: "success",
    data: newUser,
  });
});


exports.updateUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const getUser = await User.findByIdAndUpdate(id, 
    {
      ...req.body,
    });
    res.status(200).json({
      status: "user updated successfully",
      data: getUser,
    });
  });

exports.searchUsers = catchAsync(async (req, res, next) => {
  const query = req.body.query;
  console.log(query);
  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
    ],
  });

  if (!users) {
    return next(new AppError("No users found with that query", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
})