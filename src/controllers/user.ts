import {
    Request,
    Response,
    NextFunction
} from "express";
import {
    validationResult
} from 'express-validator/check';
import User from '../models/User';

export let getLogin = (req: Request, res: Response) => {
    let {
        userID
    } = req.session!;
    if (userID) {
        res.redirect("/");
    }
    res.render("login", {
        title: "Login"
    });
}

export let getSignup = (req: Request, res: Response) => {
    let { userID } = req.session!;
    if (userID) {
        res.redirect("/");
    }
    res.render("signup", {
        title: "Signup"
    });
}

export let postSignup = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(302).json({
      errors: errors.array()
    });
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) return next(err);
    if (existingUser) {
      res
        .status(302)
        .json({ error: "account with that email already exists." });
    }
    user
      .save()
      .then(savedUser => {
        req.session!.userID = savedUser._id;
        return res.redirect("/");
      })
      .catch(err => {
        if (err) return next(err);
      });
  });
};