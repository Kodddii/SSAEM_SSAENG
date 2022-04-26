require("dotenv").config();
import express from "express"
import cors from "cors"
import bodyparser from "body-parser"

const app = express();
const port = 3000
console.log("hi")
app.listen(port, () => {
    console.log(port, "번으로 서버가 켜졌어요!");
  });
  