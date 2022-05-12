// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const router = express.Router();
// const res = require('express/lib/response');
// const middleware = require('../middlewares/auth-middleware');
// const {CLIENT_FOUND_ROWS} = require('mysql/lib/protocol/constants/client');
// const jwt = require('jsonwebtoken');
// const db = require('../config.js');

// const s3 = new AWS.S3({
//     accessKeyId: process.env.S3_ACCESS_KEY,
//     secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//     region: process.env.S3_BUCKET_REGION,
// });

// // 이미지 파일 AWS S3 저장
// router.post('/single', upload.single('imageUrl'), async (req, res) => {
//   const file = await req.file;
//   console.log(file);
//   try {
//     const result = await file.location;
//     console.log(result)
//     res.status(200).json({ imageUrl: result })
//   } catch (e) {

//   }
// });

// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'friengles',
//         contentType: multerS3.AUTO_CONTENT_TYPE,
//         // acl: 'public-read',
//         metadata: function (req, file, cb) {
//             cb(null, {fieldName: file.fieldname});
//         },
//         key: function (req, file, cb) {
//             cb(null, Date.now().toString());
//         },
//     }),
// });


// const {Post, Hashtag} = require('../consfig.js');
// const {isLoggedIn} = require('./middlewares');

// const router = express.Router();

// try {
//     fs.readdirSync('uploads');
// } catch (error) {
//     console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
//     fs.mkdirSync('uploads');
// }

// const upload = multer({
//     storage: multer.diskStorage({
//         destination(req, file, cb) {
//             cb(null, 'uploads/');
//         },
//         filename(req, file, cb) {
//             const ext = path.extname(file.originalname);
//             cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
//         },
//     }),
//     limits: {fileSize: 5 * 1024 * 1024},
// });

// router.post('/img', upload.single('img'), (req, res) => {
//     console.log(req.file);
//     res.json({url: `/img/${req.file.filename}`});
// });

// const upload2 = multer();
// router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
//     try {
//         const post = await Post.create({
//             content: req.body.content,
//             img: req.body.url,
//             UserId: req.user.id,
//         });
//         const hashtags = req.body.content.match(/#[^\s#]*/g);
//         if (hashtags) {
//             const result = await Promise.all(
//                 hashtags.map(tag => {
//                     return Hashtag.findOrCreate({
//                         where: {title: tag.slice(1).toLowerCase()},
//                     });
//                 }),
//             );
//             await post.addHashtags(result.map(r => r[0]));
//         }
//         res.redirect('/');
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// });

module.exports = router;