import fs from "fs";

const contractCode = fs
  .readFileSync("./contract/compiled/interview.cell")
  .toString("base64");

export default contractCode;
