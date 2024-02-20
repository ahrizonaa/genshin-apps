import CookingCalculator from '../cooking-calculator/CookingCalculator';
import Sakura from '../sakura-animation/Sakura';
import './Home.css';

function Home() {
	return (
		<div className="home-container">
			<Sakura />
			<img
				className="logo"
				src="../imgs/genshin-logo-trans.png"
				alt="Genshin Impact"
			/>
			<CookingCalculator></CookingCalculator>
		</div>
	);
}

export default Home;
