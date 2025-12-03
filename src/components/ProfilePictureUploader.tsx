import { useAuth } from "../context/authContext";
import api from "../service/api";
import { useState } from "react";
import toast from "react-hot-toast";

const ProfilePictureUploader = () => {
  const { user, setUser } = useAuth();
  const [picture, setPicture] = useState("");

  const updatePicture = async () => {
    try {
      const res = await api.put("/auth/profile-picture", { picture });
      setUser(res.data.user);
      toast.success("Profile picture updated!");
    } catch {
      toast.error("Failed to update picture");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Paste image URL"
        value={picture}
        onChange={(e) => setPicture(e.target.value)}
      />
      <button onClick={updatePicture}>Update</button>
    </div>
  );
};

export default ProfilePictureUploader;
