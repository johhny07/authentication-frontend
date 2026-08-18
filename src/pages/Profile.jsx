import { useSelector } from "react-redux";

const Profile = () => {
  const email = useSelector((state) => state.auth.email);

  return (
    <section>
      <h2>Profile</h2>
      <p>Email: {email}</p>
      <p>This page is protected.</p>
    </section>
  );
};

export default Profile; 