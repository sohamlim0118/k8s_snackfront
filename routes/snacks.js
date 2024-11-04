// snacks.js 파일의 수정
const mongoose = require("mongoose");

const GUESTBOOK_DB_ADDR = process.env.GUESTBOOK_DB_ADDR;
const mongoURI = "mongodb://" + GUESTBOOK_DB_ADDR + "/snacks";

const db = mongoose.connection;

db.on("disconnected", () => {
  console.error(`Disconnected: unable to reconnect to ${mongoURI}`);
  throw new Error(`Disconnected: unable to reconnect to ${mongoURI}`);
});
db.on("error", (err) => {
  console.error(`Unable to connect to ${mongoURI}: ${err}`);
});

db.once("open", () => {
  console.log(`connected to ${mongoURI}`);
});

const connectToMongoDB = async () => {
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 2000,
  });
};

// snacks 컬렉션용 스키마 정의
const snackSchema = mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  image: { type: String, required: [true, "Image URL is required"] },
  nutritionalIngredients: {
    calories: { type: String },
    carbohydrates: { type: String },
    protein: { type: String },
    fat: { type: String },
  },
  required: { type: Number, default: 0 },
});

const snackModel = mongoose.model("Snack", snackSchema); // snacks 컬렉션 모델

// users 컬렉션용 스키마 정의
const userSchema = mongoose.Schema({
  num: { type: Number, required: [true, "UserNum is required"] },
  name: { type: String, required: [true, "Username is required"] },
  password: { type: String, required: [true, "Password is required"] },
});

const userModel = mongoose.model("User", userSchema); // users 컬렉션 모델

// snacks 데이터를 생성 및 저장하는 함수
const createSnack = async (params) => {
  try {
    const snack = new snackModel({
      name: params.name,
      image: params.image,
      nutritionalIngredients: params.nutritionalIngredients,
    });
    const validationError = snack.validateSync();
    if (validationError) {
      throw validationError;
    }
    await snack.save();
    return snack;
  } catch (error) {
    throw error;
  }
};

// users 데이터를 생성 및 저장하는 함수
const createUser = async (params) => {
  try {
    const user = new userModel({
      num: params.num,
      name: params.name,
      password: params.password,
    });
    const validationError = user.validateSync();
    if (validationError) {
      throw validationError;
    }
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  connectToMongoDB,
  snackModel,
  createSnack,
  userModel,
  createUser,
};
