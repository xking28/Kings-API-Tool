const fs = require('fs');
const path = require('path');
const { profileImage } = require('discord-arts');

const profilecard = async (req, res) => {
   const userid = String(req.params.userid);
   const overwriteBadges = Boolean(req.body.overwriteBadges);
   const badgesFrame = Boolean(req.body.badgeFrame);
   const removeBadges = Boolean(req.body.removeBadges);
   const removeBorder = Boolean(req.body.removeBorder);
   const customBackground = String(req.body.customBackground);
   const usernameColor = String(req.body.usernameColor);
   const borderColor = String(req.body.borderColor);
   const borderColor_2 = req.body.borderColor_2;
   const tagColor = String(req.body.tagColor);
   const presenceStatus = String(req.body.presenceStatus);
   const squareAvatar = Boolean(req.body.squareAvatar);
   const removeAvatarFrame = Boolean(req.body.removeAvatarFrame);
   const moreBackgroundBlur = Boolean(req.body.moreBackgroundBlur);
   const backgroundBrightness = Number(req.body.backgroundBrightness);
   const customDate = String(req.body.customDate);
   const localDateType = String(req.body.localDateType);
   const disableProfileTheme = Boolean(req.body.disableProfileTheme);
   console.log(userid)
  
    if (!userid) {
        return res.status(400).send('userid is required');
    }
    if (!borderColor_2) {
        return res.status(400).send('borderColor_2 is required');
    }
    if (!borderColor) {
        return res.status(400).send('borderColor is required');
    }
  
    let options = {
        customBackground: customBackground,
        overwriteBadges: overwriteBadges,
        badgesFrame: badgesFrame,
        removeBadges: removeBadges,
        removeBorder: removeBorder,
        usernameColor: usernameColor,
        tagColor: tagColor,
        borderColor: [borderColor, borderColor_2],
        presenceStatus: presenceStatus,
        squareAvatar: squareAvatar,
        removeAvatarFrame: removeAvatarFrame,
        moreBackgroundBlur: moreBackgroundBlur,
        backgroundBrightness: backgroundBrightness,
        customDate: customDate,
        localDateType: localDateType,
        disableProfileTheme: disableProfileTheme
    };

    Object.keys(options).forEach(key => options[key] === 'undefined' && delete options[key]);

    try {
        const buffer = await profileImage(userid, options);

        const imageName = `profile-${Date.now()}.png`;
        const imagePath = path.join(__dirname, 'cards', imageName);
        fs.writeFileSync(imagePath, buffer);

        res.json({ imageUrl: `${req.protocol}://${req.get('host')}/cards/${imageName}` });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating profile image, check required parameters');
    }
};
module.exports = profilecard;
