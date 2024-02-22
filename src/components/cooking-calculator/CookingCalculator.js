import React from 'react';
import './CookingCalculator.css';
import Dishes from './Dishes';
import CookingIngredientIcons from './CookingIngredientIcons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import { Icon } from '@iconify/react';

class CookingCalculator extends React.Component {
	constructor(props) {
		super();

		this.state = {
			currentTab: 'heal',
			selectedMeals: [],
			ingredientTotals: {}
		};

		this.tabs = {
			heal: React.createRef(),
			revive: React.createRef(),
			atk: React.createRef(),
			def: React.createRef()
		};

		this.starCss = {
			1: 'one-star-scroll',
			2: 'two-star-scroll',
			3: 'three-star-scroll',
			4: 'four-star-scroll',
			5: 'five-star-scroll'
		};
	}

	switchTab(which) {
		Object.keys(this.tabs).forEach((e) =>
			this.tabs[e].current.classList.remove('active')
		);

		this.tabs[which].current.classList.add('active');

		this.setState({ currentTab: which });
	}

	dishSelected(dish) {
		document.getElementById('bell').classList.add('swinging-bell');
		if (this.state.selectedMeals.length === 0) {
			document.getElementById('mealprep').style.height = '100%';
			document.getElementById('ingredient-totals').style.height = '100%';
		}
		if (_.find(this.state.selectedMeals, { name: dish.name }) === undefined) {
			dish.count = 1;
			let selectedMeals = this.state.selectedMeals.concat({ ...dish });
			let ingredientTotals = { ...this.state.ingredientTotals };
			Object.keys(dish.ingredients).forEach((i) => {
				if (ingredientTotals[i] === undefined) {
					ingredientTotals[i] = dish.ingredients[i];
				} else {
					ingredientTotals[i] += dish.ingredients[i];
				}
			});
			this.setState({ selectedMeals: selectedMeals, ingredientTotals });
		} else {
			this.addDish(dish);
		}
	}

	subtractDish(dish) {
		this.setState((prevState) => {
			if (dish.count - 1 === 0) {
				_.remove(prevState.selectedMeals, { name: dish.name });
			}
			let selectedMeals = prevState.selectedMeals.map((e) =>
				e.name === dish.name ? { ...e, count: e.count - 1 } : { ...e }
			);
			let ingredientTotals = { ...prevState.ingredientTotals };
			Object.keys(dish.ingredients).forEach((i) => {
				ingredientTotals[i] -= dish.ingredients[i];
				if (ingredientTotals[i] === 0) {
					delete ingredientTotals[i];
				}
			});
			return {
				selectedMeals: selectedMeals,
				ingredientTotals: ingredientTotals
			};
		});
	}

	addDish(dish) {
		this.setState((prevState) => {
			let selectedMeals = prevState.selectedMeals.map((e) =>
				e.name === dish.name ? { ...e, count: e.count + 1 } : { ...e }
			);
			Object.keys(dish.ingredients).forEach((ingredient) => {
				if (prevState.ingredientTotals[ingredient] === undefined) {
					prevState.ingredientTotals[ingredient] = dish.ingredients[ingredient];
				} else {
					prevState.ingredientTotals[ingredient] +=
						dish.ingredients[ingredient];
				}
			});
			let ingredientTotals = { ...prevState.ingredientTotals };
			return {
				selectedMeals: selectedMeals,
				ingredientTotals: ingredientTotals
			};
		});
	}

	rowSlideInStart(rowSelector, e) {
		let currHeight = Array.from(
			document.getElementsByClassName(rowSelector)
		).reduce((curr, next) => {
			return curr + next.clientHeight;
		}, 0);
		if (currHeight > e.target.parentElement.clientHeight) {
			e.target.parentElement.style.overflowY = 'auto';
		} else {
			e.target.parentElement.style.overflowY = 'hidden';
		}
	}

	rowSlideInEnd(e) {
		if (
			e.target.parentElement.scrollHeight > e.target.parentElement.clientHeight
		) {
			e.target.parentElement.style.overflowY = 'auto';
		} else {
			e.target.parentElement.style.overflowY = 'hidden';
		}
		e.target.parentElement.scrollTop = 10;
		e.target.parentElement.scrollTop = 0;
	}

	bellSwingDone(e) {
		e.target.classList.remove('swinging-bell');
	}

	render() {
		return (
			<div className="cook-container">
				<div className="panel panel-left">
					<div className="panel-title">Food</div>
					<div className="tabs">
						<div
							ref={this.tabs['heal']}
							onClick={(e) => this.switchTab('heal')}
							className="tab active">
							<img src="./imgs/heal.png" width="30" height="30" alt="heal" />
						</div>
						<div
							ref={this.tabs['revive']}
							onClick={(e) => this.switchTab('revive')}
							className="tab">
							<img
								src="./imgs/revive.png"
								width="30"
								height="30"
								alt="revive"
							/>
						</div>
						<div
							ref={this.tabs['atk']}
							onClick={(e) => this.switchTab('atk')}
							className="tab">
							<img src="./imgs/atk.png" width="30" height="30" alt="attack" />
						</div>
						<div
							ref={this.tabs['def']}
							onClick={(e) => this.switchTab('def')}
							className="tab">
							<img src="./imgs/def.png" width="30" height="30" alt="defense" />
						</div>
					</div>
					<div className="dish-container">
						<div className="dish-wrapper">
							{Dishes[this.state.currentTab].map((e, i) => (
								<div
									key={i}
									className={'dish-tile ' + this.starCss[e.stars]}
									onClick={() => this.dishSelected(e)}>
									<div className="dish-title">{e.name}</div>
									<div className="dish-effect">{e.effect}</div>
									<div className="dish-stars">
										{[...Array(e.stars)].map((e, i) => {
											return <FontAwesomeIcon key={i} icon={faStar} />;
										})}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="panel panel-mid">
					<div className="bell-container">
						<span
							id="bell"
							onAnimationEnd={this.bellSwingDone.bind(this)}
							className="bell fa fa-bell">
							<svg
								id="bell-svg"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512">
								<path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
							</svg>
						</span>
					</div>
					<div className="panel-title">Selected</div>
					<div className="mealprep-container" id="mealprep">
						{this.state.selectedMeals.map((e, i) => {
							return (
								<div
									onAnimationStart={this.rowSlideInStart.bind(this, 'meal-row')}
									onAnimationEnd={this.rowSlideInEnd.bind(this)}
									key={i}
									className={
										'meal-row slide-in-bottom ' +
										this.starCss[e.stars].replace('-scroll', '')
									}>
									<div className="meal-header">
										<div className="meal-name">{e.name}</div>
										<div className="meal-qty">
											<Icon
												onClick={() => this.subtractDish(e)}
												className="meal-icon minus"
												icon="carbon:subtract"
											/>
											<span className="meal-count">{e.count}</span>
											<Icon
												onClick={() => this.addDish(e)}
												className="meal-icon plus"
												icon="carbon:add"
											/>
										</div>
									</div>
									<div className="meal-ingredients">
										{Object.keys(e.ingredients).map((food, i) => {
											return (
												<div key={i} className="meal-ingredient">
													<div className="ingredient-icon">
														{CookingIngredientIcons[food]}
													</div>
													<div className="ingredient-name">
														{e.ingredients[food] +
															' ' +
															food.replace(/_/gi, ' ')}
													</div>
												</div>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				</div>
				<div className="panel panel-right">
					<div className="panel-title">Totals</div>
					<div className="ingredient-totals" id="ingredient-totals">
						{Object.keys(this.state.ingredientTotals)
							.sort(
								(a, b) =>
									this.state.ingredientTotals[b] -
									this.state.ingredientTotals[a]
							)
							.map((key, i) => {
								return (
									<div
										onAnimationStart={this.rowSlideInStart.bind(
											this,
											'ingredient-totals-row'
										)}
										onAnimationEnd={this.rowSlideInEnd.bind(this)}
										key={i}
										className="ingredient-totals-row slide-in-bottom"
										style={{
											animationDelay:
												i * 100 - (i - 1 < 0 ? 0 : (i - 1) * 100) + 'ms'
										}}>
										<div className="ingredient-icon unset-width">
											{CookingIngredientIcons[key]}
										</div>
										<span className="ingredient-total-name">
											{key.replace(/_/gi, ' ')}
										</span>
										<span className="ingredient-total-qty">
											{'x' + this.state.ingredientTotals[key]}
										</span>
									</div>
								);
							})}
					</div>
				</div>
			</div>
		);
	}
}

export default CookingCalculator;
