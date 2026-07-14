import { useForm } from "react-hook-form";
import { registerUser } from "../../services/authService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";

export default function RegisterForm() {

    const { register, handleSubmit } = useForm();

    const navigate = useNavigate();

    const onSubmit = async (data) => {

        try {

            await registerUser(data);

            toast.success("Registration Successful");

            navigate("/login");

        } catch (err) {

            toast.error(err.response?.data?.message);

        }

    };

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="register-card">

            <h2>Create Account</h2>

            <input
                placeholder="Name"
                {...register("name")}
            />

            <input
                placeholder="Email"
                {...register("email")}
            />

            <input
                type="password"
                placeholder="Password"
                {...register("password")}
            />

            <button>

                Register

            </button>

            <a href="/lms_frontend/#/login">Already have an account? Login</a>


        </form>

    );

}
