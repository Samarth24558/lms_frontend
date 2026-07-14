import { useForm } from "react-hook-form";
import { loginUser } from "../../services/authService";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./LoginForm.css";

export default function LoginForm() {

    const { register, handleSubmit } = useForm();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const onSubmit = async (data) => {

        try {

            const res = await loginUser(data);

            dispatch(loginSuccess(res.data));

            toast.success("Login Successful");

            if (res.data.user.role === "admin") {

                navigate("/admin");

            } else {

                navigate("/dashboard");

            }

        } catch (err) {

            toast.error(err.response?.data?.message || "Login Failed");

        }

    };

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="login-card">

            <h2>Welcome Back 👋</h2>

            <input
                placeholder="Email"
                {...register("email")}
            />

            <input
                type="password"
                placeholder="Password"
                {...register("password")}
            />

            <button type="submit">

                Login

            </button>

            <a href="/lms_frontend/#/register">Don't have an account? Register</a>

        </form>

    );

}
