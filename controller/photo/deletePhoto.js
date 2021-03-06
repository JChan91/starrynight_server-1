const { Photo, HashTag, Favorite, Reply } = require('../../models');
const jwt = require('jsonwebtoken');

module.exports = {
  delete: async (req, res) => {
    const { id } = req.body;
    const token = req.headers.authorization;
    const decode = jwt.verify(token, process.env.SECRET_KEY);

    // 1. 해당 사진을 삭제하면서 관련된 Hashtag, Favorite, Reply도 삭제한다.
    if (decode.id) {
      const deletePhoto = await Photo.destroy({ where: { id: id, userId: decode.id } });

      if(deletePhoto) {
        const deleteHashTag = await HashTag.destroy({ where: { photoId: id } });
        const deleteFavorite = await Favorite.destroy({ where: { photoId: id } });
        const deleteReply = await Reply.destroy({ where: { photoId: id } });
      }

      if (deletePhoto) {
        res.status(200).send('사진이 삭제되었습니다.');
      } else {
        res.status(404).send('다시 시도해주세요');
      }
    }
  },
}