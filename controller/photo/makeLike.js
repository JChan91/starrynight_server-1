const { Favorite, Photo } = require("../../models");
const jwt = require("jsonwebtoken");
const KEY = process.env.SECRET_KEY;

module.exports = {
  post: async (req, res) => {
    try {
      // 클라이언트로부터 로그인 토큰정보, 좋아요 누른 사진의 경로를 받아온다
      const { photoId } = req.body;
      const userToken = req.headers.authorization;

      // Token을 decoding 한다
      let token = userToken;
      let decode = jwt.verify(token, KEY);

      // 새 좋아요 인스턴스를 만든다
      const findLike = await Favorite.findOne({
        where: {
          pickerId: decode.id,
          photoId: photoId,
        },
      });

      if (!findLike) {
        const newLike = await Favorite.create({
          pickerId: decode.id,
          photoId: photoId,
          favorite: true,
        });

        res.status(201).json({ favorite: newLike.favorite });
      } else {
        const update = await Favorite.update(
          { favorite: !findLike.dataValues.favorite },
          {
            where: {
              pickerId: findLike.dataValues.pickerId,
              photoId: findLike.dataValues.photoId,
            },
          }
        );

        res.status(201).json({ favorite: update.favorite });
      }
    } catch (err) {
      res.status(500).send("실패입니다");
    }
  },
};
