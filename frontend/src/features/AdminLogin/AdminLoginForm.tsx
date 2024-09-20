import { useToast } from "@/components/hooks/use-toast";
import { useAuth } from "@/components/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/services/authServices";
import { AxiosError } from "axios";
import { useState } from "react";

const AdminLoginForm = () => {
  const { toast } = useToast();
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [token, setToken] = useAuth();
  const handleLogin = async () => {
    try {
      const token = (
        await login({
          username: loginForm.username,
          password: loginForm.password,
        })
      ).data.token;
      setToken(token);
      toast({
        title: "Login Success",
        description: "Welcome admin!",
      });
      window.location.reload();
    } catch (err) {
      if (err instanceof AxiosError) {
        toast({
          title: "Unauthorized",
          description: "Invalid username or password.",
          variant: "destructive",
        });
      }
    }
  };
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div>
        <Label>Username</Label>
        <Input
          className="text-black"
          onChange={(e) =>
            setLoginForm((prevState) => ({
              ...prevState,
              username: e.target.value,
            }))
          }
          value={loginForm.username}
        />
      </div>
      <div>
        <Label>Password</Label>
        <Input
          className="text-black"
          onChange={(e) =>
            setLoginForm((prevState) => ({
              ...prevState,
              password: e.target.value,
            }))
          }
          value={loginForm.password}
          type="password"
        />
      </div>
      <Button onClick={handleLogin} className="mr-auto ml-auto">
        Login
      </Button>
    </div>
  );
};

export default AdminLoginForm;
