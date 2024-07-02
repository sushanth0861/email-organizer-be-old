"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAccessToken = void 0;
const axios_1 = __importDefault(require("axios"));
class ApiError extends Error {
    constructor(status, message, location) {
        super(message);
        this.status = status;
        this.message = message;
        this.location = location;
    }
}
const GetAccessToken = async (email, authcode) => {
    const currentdate = new Date();
    console.log(email, authcode);
    //   const user = await User.findOne({ email });
    //   console.log(user);
    //   if (!user) {
    //     return;
    //   }
    //   console.log("first log :\n", user);
    const response = await axios_1.default.post('https://api.upstox.com/v2/login/authorization/token', new URLSearchParams({
        code: authcode,
        client_id: "a6bd03e8-4a4d-489a-8abd-87835e70aea0",
        client_secret: "4tc5owcpzm",
        redirect_uri: 'http://localhost:3000/auth',
        grant_type: 'authorization_code',
    }), {
        headers: {
            'Accept': 'application/json',
            'Api-Version': '2.0',
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    });
    console.log("Data: ", response.data);
    //   const resp = await User.findOneAndUpdate({ email }, {
    //     $set: {
    //       data: response.data,
    //       lastTokenGeneratedAt: currentdate.toLocaleString()
    //     }
    //   });
    if (response) {
        // console.log("Original Doc: ", resp);
        return response.data;
    }
    else {
        throw new ApiError(500, "error authorizing with upstox", ".Controllers/Authorization: GetAccessToken");
    }
};
exports.GetAccessToken = GetAccessToken;
// Commented out section of original code - converted to TypeScript but not used in the main export
/*
export const GetAccessTokenAlt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key, secret, email } = req.body;

    // Add access token to the database
    passport.use(new OAuth2Strategy({
      authorizationURL: `https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id=${key}&redirect_uri=http://localhost:4000/auth`,
      clientID: key,
      clientSecret: secret,
      tokenURL: `https://api.upstox.com/v2/login/authorization/token`,
      callbackURL: "http://localhost:4000/auth"
    },
      function (accessToken, refreshToken, profile, cb) {
        console.log("Access Token => ", accessToken);
      }
    ));

    res.status(201).json({ message: "Authorized successfully", success: true });
    next();
  } catch (error) {
    console.log("error =>>", error);
  }
};
*/
//# sourceMappingURL=upstox-auth.js.map