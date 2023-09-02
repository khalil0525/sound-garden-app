import styles from "./SignInOverlay.module.css";
import { useState } from "react";
import { useLogin } from "../../../../hooks/useLogin";

const SignInOverlay = (props) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login, error, isPending } = useLogin();

	const handleFormSubmit = (event) => {
		event.preventDefault();
		// try to log user in
		login(email, password);
		console.log(email, password);
	};

	return (
		<div className={styles.modal}>
			<form className={styles["signInForm"]} onSubmit={handleFormSubmit}>
				<h2>Sign in</h2>

				<div className={styles["signInForm_controls"]}>
					<input
						type="email"
						value={email}
						placeholder="Your Email Address"
						onChange={(e) => setEmail(e.target.value)}
					/>

					<input
						type="password"
						value={password}
						placeholder="Password"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				<div className={styles["signInForm_actions"]}>
					{!isPending && <button type="submit">Login</button>}
					{isPending && (
						<button className="btn" disabled>
							Loading
						</button>
					)}
					{/* <button>Register</button> */}
					{error && <p>{error}</p>}
				</div>
			</form>
		</div>
	);
};
export default SignInOverlay;
