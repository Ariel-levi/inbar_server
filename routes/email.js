const express = require("express");
const { sendContactEmail } = require("../middlewares/sendEmail");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ msg: "email router works" });
});

router.post("/contact", async (req, res) => {
  try {
    if (
      req.body.email?.length < 3 ||
      req.body.name?.length < 2 ||
      req.body.subject?.length < 3
    ) {
      return res
        .status(400)
        .json({ msg_err: "You must send valid name ,subject and email 1" });
    }
    if (sendContactEmail(req.body)) {
      res.json({ msg: "Email sent", status: "ok" });
    } else {
      return res
        .status(400)
        .json({ msg_err: "You must send valid name ,subject and email 2" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ msg_err: "You must send valid name ,subject and email 3" });
  }
});

// router.post("/contact", async (req, res) => {
//   try {
//     if (
//       req.body.email?.length < 3 ||
//       req.body.name?.length < 2 ||
//       req.body.subject?.length < 3
//     ) {
//       return res
//         .status(400)
//         .json({ msg_err: "You must send valid name ,subject and email 1" });
//     }
//     // if (!sendEmail(req.body)) {
//     const messageSend = await sendEmail(req.body);
//     console.log(messageSend);

//     if (messageSend) {
//       res.json({ msg: "email sended", status: "ok" });
//     } else {
//       return res
//         .status(400)
//         .json({ msg_err: "You must send valid name ,subject and email 2" });
//     }
//   } catch (err) {
//     console.log(err);
//     return res
//       .status(400)
//       .json({ msg_err: "You must send valid name ,subject and email 3" });
//   }
// });

module.exports = router;
