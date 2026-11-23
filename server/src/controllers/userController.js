import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
export const getProfile = async (req, res) => {
  try {
    const profile = await User.findById(req.user.id).select("-password");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }
    const image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(image, {
      folder: "finance-app/profile-images",
      resource_type: "image",
    });

    const imageUrl = result.secure_url;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { image: imageUrl },
      { new: true },
    ).select("-password");

    if (!user) {
      await cloudinary.uploader.destroy(result.public_id);

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      public_id: result.public_id,
      imageUrl: user.image,
    });
  } catch (error) {
    console.error("Image upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name.trim(),
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password -refreshTokenHash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: user,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
