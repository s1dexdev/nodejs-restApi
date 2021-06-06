const fs = require('fs/promises');
const path = require('path');
const Jimp = require('jimp');

class Upload {
  constructor() {
    this.folderUserAvatar = 'public/avatars';
  }

  async transformAvatar(pathFile) {
    const file = await Jimp.read(pathFile);
    await file.resize(250, 250).writeAsync(pathFile);
  }
  async saveAvatarToStatic({ idUser, pathFile, name, oldFile }) {
    await this.transformAvatar(pathFile);
    await fs.rename(pathFile, path.join(this.folderUserAvatar, name));
    await this.deleteOldAvatar(path.join(this.folderUserAvatar, oldFile));

    const avatarUrl = path.normalize(name);

    return avatarUrl;
  }
  async deleteOldAvatar(pathFile) {
    try {
      await fs.unlink(pathFile);
    } catch (error) {
      console.error(error.message);
    }
  }
}

module.exports = Upload;
