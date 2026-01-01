import { auth, db } from "@/config/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const SignupForm = () => {
  const handleSignup = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { email, password, name, phone, role } = Object.fromEntries(formData);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        phone,
        role,
        email,
        createdAt: new Date(),
      });
      toast("Account created successfully!");
    } catch (error) {
      toast(error.message);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <Input name="name" placeholder="Full Name" required />
      <Input name="phone" placeholder="Phone Number" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="password" type="password" placeholder="Password" required />
      <select name="role" className="w-full border p-2 rounded">
        <option value="user">Normal User</option>
        <option value="admin">Admin</option>
      </select>
      <Button type="submit" className="w-full">
        Sign Up
      </Button>
    </form>
  );
};
