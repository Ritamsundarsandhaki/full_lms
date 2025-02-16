import React from "react";
import { Link } from "react-router-dom";
import "/src/css/home.css";
// import ImageWithAnimation, from "/src/js/home";

const Home = () => {
	return (
		<div className="display">
			<div id="header">
				<div className="container">
					<nav>
						<ul id="menu">
							<li>
								<a href="#header">Home</a>
							</li>
							<li>
								<a href="#login">Login</a>
							</li>
							<p id="middle">NIRT</p>
							<li>
								<a href="#register">Register</a>
							</li>
							<li>
								<a href="#getStarted">Get Started</a>
							</li>
							<p id="login">
								<a href="#login">Log in</a>
							</p>
						</ul>
					</nav>
				</div>
				<div className="info">
					<div className="header-text">
						<p>Welcome To Our NIRT</p>
						<p>Library</p>
						<p id="info-msg">
							Your one-stop solution for managing your library effectively
						</p>
					</div>
					<div className="search-bar">
						<input type="text" placeholder="Search Book" />
						<button>Join Us</button>
					</div>
				</div>
			</div>
			<div className="image">
				<span> <img className="fade-in" src="./homePage_img/library_img1" alt="Library Image"></img></span>
			</div>
		</div>
	);
};

export default Home;
