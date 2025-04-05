import express from "express";
import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authRouter = express.Router();
const secretKey =
  "432rewlfds@#$rdjshdkjdshfkjdsfs#$%%$xcmvnfldsjfo#@$#%#$RFDFD*8tgdfvcjdkjkdw";

authRouter.post("/login", async (request, response) => {
    const { password, email } = request.body;
    if (!password || !email) {
      return response.status(422).json({message: "Password or email is required"});
    }
  
    const user = await User.findOne({
        where: {
            email
        }
    });
    if (!user) {
        return response.status(400).json({message:"Invalid email or password"});
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return response.status(400).json({message:"Invalid email or password"});
    }
  
    const jwtToken = jwt.sign(email, secretKey);
    return response.json({token:jwtToken}, 200);
});

authRouter.post("/register", async (request, response) => {
    const {
        name,
        birthdate,
        password, 
        email
    } = request.body;

    const userAlreadyExists = await User.findOne({
        where: {
            email
        }
    });

    if (userAlreadyExists !== null) {
        return response.json({ message: "User already exists" }, 400)
    }

    /**
     * Contains 8 characters
     * Contains special character @$!%*#?&
     * Contains uppercase and lowercase characters
     * Contains number
     */
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/gm
    const passwordIsValid = passwordRegex.test(password);

    if (!passwordIsValid) {
        return response.json({ message: "Password is not valid" }, 400)
    }

    const encryptedPassword = bcrypt.hashSync(password, 10);
    const createdUser = await User.create({
        name,
        birthdate,
        email,
        password: encryptedPassword
    })

    delete createdUser.dataValues.password;

    return response.json(createdUser.dataValues)
})
  
export default authRouter;
